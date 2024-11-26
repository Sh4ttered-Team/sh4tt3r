// A custom tool for fetching data from external sources

async function FFFF(folder, itemtype) {
  //Fetch Files From Folder, gets list of filenames in a folder(used for dynamic assets)
  let response;
  try {
    response = await UF(
      "https://api.github.com/repos/ssh-lvl/new-shatter/contents/" + folder
    );
  } catch (e) {
    return null;
  }
  if (!response) {
    console.error(
      "url fetch failed! :" + typeof response == null ? "null" : response
    );
    return null;
  }
  const Files = response
    .filter((item) => item.type === itemtype && !item.name.startsWith("-"))
    .map((file) => file.name);

  return Files;
}

async function UF(api, headers = {}) {
  //(api required:url, headers optional:other headers like api keys) //URL Fetch(used as a base for fetches), simply returns the response from an api call
  try {
    const response = await fetch(api, headers);
    if (!response.ok || response.type == TypeError) {
      return null;
    }
    return response.json();
  } catch (e) {
    return e;
  }
}

async function FDB(table) {
  //Fetch data from a table in the supabase
  const SUPABASE_URL = "https://fffwukshwgrcdyqmvahg.supabase.co";
  const key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZnd1a3Nod2dyY2R5cW12YWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzOTkxMjAsImV4cCI6MjA0Njk3NTEyMH0.MsMeFMkrJCeJzRFWMZXM-CZu8gwaScV7feentsgMQvI";
  const response = await UF(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (!Array.isArray(response)) {
    console.error(
      "url fetch failed! :" + typeof response == null ? "null" : response
    );
    return null;
  }
  return response;
}

async function FICS() {
  //Fetch Internet Connection Status, pretty much just checks if you can access the internet
  try {
    await UF("https://www.google.com", { mode: "no-cors" });
    return true;
  } catch (e) {
    return false;
  }
}
