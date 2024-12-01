const user = await FDB('profiles');
let prefix
if (window.location.href.startsWith('https://ssh-lvl.github.io/')) {
    prefix = '/new-shatter';
}
else {
    prefix = '';
}
if (user[0] == null) {
    window.location.href = prefix + '/SUB/-Login.html' 
}
if (user[0].banned) {
    window.location.href = prefix + '/404.html';
}

if (!await loggedIn()) {
    window.location.href = prefix + '/SUB/-Login.html';
}

