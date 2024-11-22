// A custom tool for fetching data from external sources



async function FFFF(folder) {  //Fetch Files From Folder, gets list of filenames in a folder(used for dynamic assets)
    const response = await UF('https://api.github.com/repos/ssh-lvl/new-shatter/contents/'+folder);
    if (!Array.isArray(response)) {
        console.error('url fetch failed! :' + typeof(response) == null ? 'null' : response)
        return null;
    }
    const Files = response
        .filter(item => item.type === "file")
        .map(file => file.name);
    
    return Files;
}

async function UF(api) { //URL Fetch(used as a base for fetches), simply returns the response from an api call
    try {
        const response = await fetch(api);
        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (e) {
        return e;
    }
}

async function FDB(table) { //Fetch DataBase, gets the 

}