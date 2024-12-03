const SUPABASE_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/dist/umd/supabase.min.js';

async function loadSupabaseScript() {
  let cachedScript = localStorage.getItem('supabaseScript');

  if (!cachedScript) {
    const response = await fetch(SUPABASE_URL);
    cachedScript = await response.text();
    localStorage.setItem('supabaseScript', cachedScript);
    window.location.reload();
  }

  const script = document.createElement('script');
  script.text = cachedScript;
  document.head.appendChild(script);
}

loadSupabaseScript();

const supabaseUrl = "https://fffwukshwgrcdyqmvahg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZnd1a3Nod2dyY2R5cW12YWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzOTkxMjAsImV4cCI6MjA0Njk3NTEyMH0.MsMeFMkrJCeJzRFWMZXM-CZu8gwaScV7feentsgMQvI";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);