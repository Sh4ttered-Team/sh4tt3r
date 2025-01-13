// A custom tool for fetching data from external sources

async function FFFF(repo, folder, itemtype) {
  // Fetch Files From Folder, gets list of filenames in a folder (used for dynamic assets)
  const gitToken = localStorage.getItem('gitKey'); // Uses GitHub API token if set
  let response;

  const fetchFromGitHub = async (token) => {
    try {
      const headers = token ? { 'Authorization': `token ${token}` } : {};
      const res = await UF(
        "https://api.github.com/repos/" + repo + "/contents/" + folder,
        headers
      );
      return res;
    } catch (e) {
      return null;
    }
  };
  response = await fetchFromGitHub(gitToken);
  if (!response) {
    console.error("URL fetch failed!");
    return null;
  }

  // Check if the response is auth error
  if (response.status === 401) {
    console.warn("Authentication failed. Retrying...");
    response = await fetchFromGitHub(gitToken);

    if (response.status === 401) {
      console.error("Authentication failed again. Resetting GitHub token.");
      localStorage.removeItem('gitKey'); // Reset the GitHub token
      return null;
    }
  }

  // Filter and return the files based on itemtype
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

  //Fetch Internet Connection Status, pretty much just checks if you can access the internet
async function FICS() {
  if (!navigator.onLine) {
    return false;
  }

  try {
    let response = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
