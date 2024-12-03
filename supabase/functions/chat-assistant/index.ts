import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, type, userId } = await req.json();

    let systemPrompt = '';
    if (type === 'resume') {
      systemPrompt = "You are a professional resume writer. Help users create and improve their resumes with specific, actionable advice. Focus on highlighting achievements, using strong action verbs, and maintaining professional formatting.";
    } else {
      systemPrompt = "You are a cover letter writing expert. Help users craft compelling cover letters that connect their experiences with job requirements. Focus on storytelling, maintaining proper business letter format, and showcasing relevant skills.";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Store the chat history
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    await supabase.from('chat_history').insert({
      user_id: userId,
      message,
      response: aiResponse,
      type,
    });

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});