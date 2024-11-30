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
