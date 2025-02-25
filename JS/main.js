//check for if the page is account bypassed
const IsUserBypass = checkForTag("acc-bypass");
const AdminReqConBypass = checkForTag("con-bypass");
const AdminReq = checkForTag("admin-req");
const LoadingScreen = checkForTag("loading");
const ThemeBypass = checkForTag("theme-bypass");

function googleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-2EWL8GKTZP';
    document.head.appendChild(script);

    script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-2EWL8GKTZP');
    };
}
googleAnalytics();

if (window.self !== window.top) {
	window.isCloaked = true;
}
export let settings;

function parseSettings(jsonString) {
	try {
		return JSON.parse(jsonString);
	} catch (e) {
		console.warn("Initial JSON parsing failed. Attempting recovery...", e);
		let fixedString = jsonString
			.replace(/,\s*}/g, '}')
			.replace(/,\s*]/g, ']')
			.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');

		try {
			return JSON.parse(fixedString);
		} catch (secondError) {
			console.error("JSON recovery failed. Resetting to default settings.", secondError);
			return {};
		}
	}
}

let rawSettings = localStorage.getItem('settings');
settings = parseSettings(rawSettings) || {};
localStorage.setItem('settings', JSON.stringify(settings));

if (!ThemeBypass) {
	if (settings['theme']) {
		document.addEventListener('DOMContentLoaded', () => {
			if (settings['theme']) {
				document.documentElement.setAttribute('data-theme', settings['theme']);
			}
		});
	}
}

//fix for different web environments (local dev/github pages)
window.prefix = "";
if (window.location.href.startsWith("https://shattered-team.github.io/")) {
	window.prefix = "/new-shatter";
}

//if there isn't an account bypass for the page
//go to banned or login,
//if admin load console (bypassable)

if (!IsUserBypass) {
	checkAcc();
}

if (LoadingScreen) {
	addLoadingScreen();
}

function addLoadingScreen() {
	if (document.getElementsByClassName("loading-overlay").length == 0) {
		const style = document.createElement("style");
		style.innerHTML = `
		.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 9999;
		pointer-events: all;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		visibility: hidden;
		}
	`;
		document.head.appendChild(style);

		const overlay = document.createElement("div");
		overlay.className = "loading-overlay";
		overlay.innerHTML = `
		<img src="${window.prefix != "/" ? window.prefix : ""}/UI/loading.svg" style="width: 50%; height: 50%" />
		<h1 style="font-size: xxx-large; color: var(--color-text-light)">Please wait...</h1>
	`;

		document.body.appendChild(overlay);

		window.showLoadingScreen = function () {
			document.querySelector(".loading-overlay").style.visibility = "visible";
			document.addEventListener("keydown", e => e.preventDefault());
			document.body.style.pointerEvents = "none";
		};

		window.hideLoadingScreen = function () {
			document.querySelector(".loading-overlay").style.visibility = "hidden";
			document.body.style.pointerEvents = "auto";
			document.removeEventListener("keydown", e => e.preventDefault());
		};
	}
}


//check for account
async function checkAcc() {
    let user = await FDB("profiles");
    if (!user || user.length === 0) {
        window.location.href = window.prefix + "/SUB/-Login.html";
        return;
    }
    let userData = user[0];
    if (userData.banned) {
        window.location.href = window.prefix + "/404.html";
        return;
    }
    if (AdminReq && !userData.admin) {
        window.location.href = window.prefix + "/404.html";
        return;
    }
    if (userData.admin && (window.prefix === "" || settings['console'])) {
        loadConsole();
    }
    supabaseClient
        .channel('user')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'profiles'
            },
            async (payload) => {
                try {
                    console.log('User update received:', payload);
                    let updatedUser = await FDB("profiles");
                    if (!updatedUser || updatedUser.length === 0) {
                        window.location.href = window.prefix + "/SUB/-Login.html";
                        return;
                    }
                    let updatedUserData = updatedUser[0];

                    if (updatedUserData.banned) {
                        window.location.href = window.prefix + "/404.html";
                    }
                } catch (error) {
                    console.error('Error refreshing user:', error);
                }
            }
        )
        .subscribe((status) => {
            console.log('User subscription status:', status);
        });
}

//load eruda console
function loadConsole() {
	if (!document.getElementById("console")) {
		let erudaScript = document.createElement("script");
		erudaScript.src = "//cdn.jsdelivr.net/npm/eruda";
		erudaScript.type = "module";
		erudaScript.id = "console";

		document.body.appendChild(erudaScript);

		erudaScript.onload = function () {
			eruda.init();
		};

		erudaScript.onerror = function () {
			alert("eruda failed to load");
		};
	}
}

//ctrl + i, keybind to load eruda console
document.addEventListener("keydown", async function (event) {
	if (event.ctrlKey && event.key === "i") {
		event.preventDefault();
		let user = await FDB("profiles");
		if (user && user[0] && user[0].admin === false && !AdminReqConBypass) {
			return;
		}
		loadConsole();
	}
});

//ctrl + \, edit settings data  // same admin perms as console
document.addEventListener("keydown", async function (event) {
	if (event.ctrlKey && event.key === "\\") {
		event.preventDefault();
		let user = await FDB("profiles");
		if (user && user[0] && user[0].admin === false && !AdminReqConBypass) {
			return;
		}
		let input = prompt('settings', JSON.stringify(settings));
		localStorage.setItem('settings', input);
		window.location.reload();
	}
});

function checkForTag(tag) {
	return document.getElementsByTagName(tag).length !== 0;
}

if (window.location.href.includes("/~")) {
	window.location.href = window.prefix + "/404.html";
}

if (settings['cloak'] && !window.isCloaked) {
	cloak(window.location.href)
}

function cloak(url, relative_path = false) {
	url = `${relative_path ? '/' : ''}` + url;
	let cloak = window.open(
		"about:blank",
		"_blank",
		`width=${window.screen.width}, height=${window.screen.height}`
	);
	cloak.document.write("<style>body,html {padding: 0; margin: 0;}</style>");

	cloak.document.write(`<iframe src='${url}' frameBorder='0' style='width: 100vw; height: 100vh;' />`);
	window.location.replace("about:blank");
}
