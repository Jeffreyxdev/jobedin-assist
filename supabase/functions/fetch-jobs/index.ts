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
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')
    
    // Fetch from RapidAPI
    const rapidApiUrl = `https://jobs-api14.p.rapidapi.com/v2/list?query=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location || 'United States')}`
    const rapidApiResponse = await fetch(rapidApiUrl, {
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'jobs-api14.p.rapidapi.com',
      },
    })
    
    const rapidApiJobs = await rapidApiResponse.json()
    
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

    // Transform and store RapidAPI jobs
    const transformedJobs = rapidApiJobs.data.map(job => ({
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city + ', ' + job.job_country,
      description: job.job_description,
      salary_range: job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : null,
      job_type: job.job_employment_type,
      url: job.job_apply_link,
      source: 'RapidAPI',
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