const user = await FDB('profiles');
if (user[0] == null) {
    window.location.href = '/new-shatter/SUB/-Login.html' 
}
if (user[0].banned) {
    window.location.href = '/new-shatter/404.html';
}

if (!await loggedIn()) {
    window.location.href = '/new-shatter/SUB/-Login.html';
}