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
    const linkedinApiKey = Deno.env.get('default-application_9907702')
    
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

    console.log('Fetching jobs with keywords:', keywords, 'and location:', location)

    // Fetch from LinkedIn Data Scraper API
    const linkedinResponse = await fetch(
      `https://linkedin-data-scraper.p.rapidapi.com/profile_updates_original?profile_url=https%3A%2F%2Fwww.linkedin.com%2Fin%2F${encodeURIComponent(keywords)}&page=1&reposts=1&comments=1`,
      {
        headers: {
          'x-rapidapi-key': linkedinApiKey,
          'x-rapidapi-host': 'linkedin-data-scraper.p.rapidapi.com',
        },
      }
    )

    if (!linkedinResponse.ok) {
      console.error('LinkedIn API error:', await linkedinResponse.text())
      throw new Error('Failed to fetch from LinkedIn API')
    }

    const linkedinData = await linkedinResponse.json()
    console.log('Fetched data from LinkedIn:', linkedinData)

    // Transform LinkedIn data to our schema
    const transformedJobs = linkedinData.map(post => ({
      title: post.title || 'Job Position',
      company: post.company || 'Company Name',
      location: location || post.location || 'Remote',
      description: post.content || post.description || 'No description available',
      salary_range: null,
      job_type: 'Full-time',
      url: post.url || null,
      source: 'LinkedIn',
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