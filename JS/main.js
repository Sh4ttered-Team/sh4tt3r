//check for if the page is account bypassed
const IsUserBypass = checkForTag("acc-bypass");
const AdminReqConBypass = checkForTag("con-bypass");
const LoadingScreen = checkForTag("loading");

export let isCloaked = false;
export let settings;

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
	if (document.getElementsByClassName("overlay").length == 0) {
		const style = document.createElement("style");
		style.innerHTML = `
            .overlay {
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
		overlay.className = "overlay";
		overlay.innerHTML = `
            <img src="${window.prefix != "/" ? window.prefix : ""
			}/UI/loading.svg" style="width: 50%; height: 50%" />
            <h1 style="font-size: xxx-large; color: var(--color-text-light)">Please wait...</h1>
        `;

		document.body.appendChild(overlay);

		window.showLoadingScreen = function () {
			document.getElementsByClassName("overlay")[0].style.visibility =
				"visible";
		};

		window.hideLoadingScreen = function () {
			document.getElementsByClassName("overlay")[0].style.visibility = "hidden";
		};
	}
}

//check for account
async function checkAcc() {
	let user = await FDB("profiles");

	if (user) {
		if (user[0].banned) {
			window.location.href = window.prefix + "/404.html";
		} else if (!user) {
			window.location.href = window.prefix + "/SUB/-Login.html";
		}
	} else if (!(await loggedIn())) {
		window.location.href = window.prefix + "/SUB/-Login.html";
	}
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

function checkForTag(tag) {
	return document.getElementsByTagName(tag).length !== 0;
}

if (window.location.href.includes("/~")) {
	window.location.href = window.prefix + "/404.html";
}

const params = new URLSearchParams(window.location.search);
if (params.get("Cloaked")) {
	isCloaked = true;
}

if (!localStorage.getItem('settings')) {
	localStorage.setItem('settings', JSON.stringify({}));
}

settings = JSON.parse(localStorage.getItem('settings'));

if (settings['cloak'] && !isCloaked) {
	cloak(window.location.href)
}

function cloak(url,relative_path = false) {
	url = `${relative_path ? '/' : ''}` + url + '?Cloaked=true';
	alert(url)
	let cloak = window.open(
		"about:blank",
		"_blank",
		`width=${window.screen.width}, height=${window.screen.height}`
	);
	cloak.document.write("<style>body,html {padding: 0; margin: 0;}</style>");

	cloak.document.write(`<iframe src='${url}' frameBorder='0' style='width: 100vw; height: 100vh;' />`);
	window.location.replace("about:blank");
}