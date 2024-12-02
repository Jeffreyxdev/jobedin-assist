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

    // Mock job data for demonstration
    const mockJobs = [
      {
        title: keywords,
        company: "Example Company",
        location: location || "Remote",
        description: "This is a sample job description.",
        salary_range: "$50,000 - $100,000",
        job_type: "Full-time",
        url: "https://example.com/job",
        source: "Internal",
        user_id: user.id,
      }
    ]

    // Insert jobs into Supabase
    const { data: insertedJobs, error } = await supabase
      .from('jobs')
      .insert(mockJobs)
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