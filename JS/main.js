const user = await FDB('profiles');
let prefix = '';

if (window.location.href.startsWith('https://ssh-lvl.github.io/')) {
    prefix = '/new-shatter';
}

if (user && user.size > 0) {
    if (user[0].banned) {
        window.location.href = prefix + '/404.html';
    } else {
        window.location.href = prefix + '/SUB/-Login.html';
    }
    if (user[0].admin) {
        let erudaScript = document.createElement('script').src = '//cdn.jsdelivr.net/npm/eruda';
        let erudaInit = document.createElement('script').type = 'text/javascript';
        erudaInit.text = 'eruda.init();';
        document.body.appendChild(erudaScript);
        document.body.appendChild(erudaInit);
    }
} else if (!await loggedIn()) {
    window.location.href = prefix + '/SUB/-Login.html';
}
