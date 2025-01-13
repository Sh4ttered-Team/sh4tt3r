// A custom tool for fetching data from external sources

async function FFFF(repo, folder, itemtype) {
  //Fetch Files From Folder, gets list of filenames in a folder(used for dynamic assets)
  const gitToken = localStorage.getItem('gitKey'); //uses github api token if set
  let response;
  try {
    response = await UF(
      "https://api.github.com/repos/" + repo + "/contents/" + folder, (gitToken) ? {'Authorization': `token ${gitToken}`} : {}
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
    .filter((item) => item.type === itemtype && !item.name.startsWith("-") && !item.name.startsWith("~"))
    .map((file) => file.name);

  return Files;
}

async function UF(api, headers = {}) {
  //(api required:url, headers optional:other headers like api keys) //URL Fetch(used as a base for fetches), simply returns the response from an api call
  try {
    const response = await fetch(api, {'headers':headers});
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
  const { data, error } = await supabaseClient
        .from(table)
        .select('*');

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }
    return data;
}

async function FICS() {
  //Fetch Internet Connection Status, pretty much just checks if you can access the internet
  try {
    let response = await UF("https://www.google.com", { mode: "no-cors" });
    if(!response) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}
