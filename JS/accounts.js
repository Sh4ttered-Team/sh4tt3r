async function LTA(rawCred, Password) {
	//Login To Account

	const { data, error } = await supabaseClient.auth.signInWithPassword({
		email: rawCred,
		password: Password,
	});

	if (window.hideLoadingScreen) {
		window.hideLoadingScreen();
	}
	if (error) {
		alert("Error signing in: " + error.message);
	} else {
		window.location.href = window.prefix + '/';
	}
}

async function loggedIn() {
	const {
		data: { session },
	} = await supabaseClient.auth.getSession();
	return !!session;
}

async function LOA() {
	//Logout Of Accout
	await supabaseClient.auth.signOut();
	window.location.reload();
}
