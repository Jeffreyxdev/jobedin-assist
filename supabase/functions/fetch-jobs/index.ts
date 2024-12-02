import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { keywords, location } = await req.json()
    const findworkApiKey = Deno.env.get('FINDWORK_API_KEY')
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get user ID from auth header
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    const { data: { user } } = await supabase.auth.getUser(authHeader)
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch from Findwork API
    const findworkResponse = await fetch('https://findwork.dev/api/jobs/', {
      headers: {
        'Authorization': `Token ${findworkApiKey}`,
      },
    })

    if (!findworkResponse.ok) {
      console.error('Findwork API error:', await findworkResponse.text())
      throw new Error('Failed to fetch from Findwork API')
    }

    const findworkJobs = await findworkResponse.json()
    console.log('Fetched jobs from Findwork:', findworkJobs)

    // Transform Findwork jobs to our schema
    const transformedJobs = findworkJobs.results.map(job => ({
      title: job.role,
      company: job.company_name,
      location: job.location || 'Remote',
      description: job.text,
      salary_range: job.salary || null,
      job_type: job.employment_type || 'Full-time',
      url: job.url,
      source: 'Findwork',
      user_id: user.id,
    }))

    // Insert jobs into Supabase
    const { data: insertedJobs, error } = await supabase
      .from('jobs')
      .insert(transformedJobs)
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, jobs: insertedJobs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})