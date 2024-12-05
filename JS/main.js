const IsUserBypass = (document.getElementsByTagName('acc-bypass').length != 0) ? true : false;
let user = await FDB('profiles');
let prefix = '';

if (window.location.href.startsWith('https://ssh-lvl.github.io/')) {
    prefix = '/new-shatter';
}

if (user) {
    if (user[0].banned) {
        window.location.href = prefix + '/404.html';
    } else if (!user) {
        window.location.href = prefix + '/SUB/-Login.html';
    }
    if (user[0].admin) {
        let erudaScript = document.createElement('script');
        erudaScript.src = '//cdn.jsdelivr.net/npm/eruda';
        erudaScript.async = true;
    
        document.body.appendChild(erudaScript);
    
        erudaScript.onload = function() {
            eruda.init();
        };
    
        erudaScript.onerror = function() {
            alert('eruda fail')
        };
    }
    
} else if (!await loggedIn()) {
    window.location.href = prefix + '/SUB/-Login.html';
}
