async function LTA(Email, Password) {
	//Login To Account
	const { user, error } = await supabaseClient.auth.signInWithPassword({
		email: Email,
		password: Password,
	});

	if (error) {
		alert("Error signing in: " + error.message);
	} else {
		let prefix;
		if (window.location.href.startsWith("https://ssh-lvl.github.io/")) {
			prefix = "/new-shatter/";
		} else {
			prefix = "/";
		}
		window.location.href = prefix;
	}
}

async function loggedIn() {
	const {
		data: { session },
	} = await supabaseClient.auth.getSession();
	if (session) {
		return true;
	} else {
		return false;
	}
}

async function LOA() {
	//Logout Of Accout
	await supabaseClient.auth.signOut();
	window.location.reload();
}
