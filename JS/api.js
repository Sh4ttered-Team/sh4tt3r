export async function api(body, auth_token, endpoint) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${auth_token}`);

    const raw = JSON.stringify(body);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch(`https://fffwukshwgrcdyqmvahg.supabase.co/functions/v1/${endpoint}`, requestOptions);
        return await response.text();
    } catch (error) {
        console.error(error);
    }
}