const clientId = "73705189850145dabc55a8e8be71e94a";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

// top-level token storage so SDK can access it
let accessToken = null;

async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

function populateUI(profile) {
    const displayName = profile.display_name || "User";
    document.getElementById("displayName").innerText = `${displayName}`;
    if (profile.images && profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        const holder = document.getElementById("avatar");
        holder.innerHTML = "";
        holder.appendChild(profileImage);
        const imgUrlEl = document.getElementById("imgUrl");
        if (imgUrlEl) imgUrlEl.innerText = profile.images[0].url;
    }
    document.getElementById("id").innerText = profile.id || "";
    document.getElementById("email").innerText = profile.email || "";
    document.getElementById("uri").innerText = profile.uri || "";
    if (profile.external_urls && profile.external_urls.spotify) {
        document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    }
    document.getElementById("url").innerText = profile.href || "";
    document.getElementById("url").setAttribute("href", profile.href || "#");
}

async function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function redirectToAuthCodeFlow(clientId) {
    const verifier = await generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5500/music-sub.html");
    params.append("scope", "user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5500/music-sub.html");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
    });

    const data = await result.json();
    // store token so SDK can access it
    if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
    }
    return data.access_token;
}

// run auth & profile exchange inside async IIFE so we can use await
(async function mainAuthFlow() {
    if (!code) {
        redirectToAuthCodeFlow(clientId);
        return;
    }

    // we have code -> exchange for token and fetch profile
    try {
        accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        populateUI(profile);

        // clean URL (optional)
        history.replaceState(null, "", window.location.pathname);
    } catch (err) {
        console.error("Auth/profile error:", err);
    }
})();


// Spotify Web Playback SDK entry point
window.onSpotifyWebPlaybackSDKReady = () => {
    // prefer in-memory accessToken, fallback to localStorage
    const token = accessToken || localStorage.getItem("access_token");
    if (!token) {
        console.error("No access token available for the Web Playback SDK.");
        return;
    }

    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });
    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });
    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay();
    };

    player.connect();
};