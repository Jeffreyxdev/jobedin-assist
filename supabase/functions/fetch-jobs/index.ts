import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const mockCompanies = [
  'TechCorp', 'InnovateSoft', 'DevHub', 'CloudScale', 'DataFlow',
  'AIVentures', 'CyberSys', 'QuantumTech', 'ByteLogic', 'NetSphere'
]

const mockLocations = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
  'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Denver, CO'
]

const mockJobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote']

const mockSalaryRanges = [
  '$80,000 - $120,000', '$100,000 - $150,000', '$120,000 - $180,000',
  '$150,000 - $200,000', '$200,000 - $250,000'
]

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { keywords, location } = await req.json()
    
    // Get auth token from request header
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      }
    )

    // Get user ID from session
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Generate 5-10 mock job listings based on keywords
    const numJobs = Math.floor(Math.random() * 6) + 5
    const jobs = []

    for (let i = 0; i < numJobs; i++) {
      const job = {
        title: `${keywords.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
        company: mockCompanies[Math.floor(Math.random() * mockCompanies.length)],
        location: location || mockLocations[Math.floor(Math.random() * mockLocations.length)],
        description: `We are seeking a talented ${keywords} to join our team. The ideal candidate will have strong experience in ${keywords} and related technologies.`,
        salary_range: mockSalaryRanges[Math.floor(Math.random() * mockSalaryRanges.length)],
        job_type: mockJobTypes[Math.floor(Math.random() * mockJobTypes.length)],
        url: `https://example.com/jobs/${Math.random().toString(36).substring(7)}`,
        source: 'Mock Data',
        user_id: user.id
      }
      
      // Insert job into database
      const { error: insertError } = await supabaseClient
        .from('jobs')
        .insert(job)

      if (insertError) {
        console.error('Error inserting job:', insertError)
        continue
      }

      jobs.push(job)
    }

    return new Response(
      JSON.stringify({ jobs }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})