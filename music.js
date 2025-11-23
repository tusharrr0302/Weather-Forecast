var saveclass = null;
const apiKey = "e5f6724a0d910e4c9cb00f6c27c6e2cd"
const playlists = {
      Clear:      'PL4fGSpr7zM3qL9X4uXM3ZYw1A1b9X8V3f', // Sunny / Happy vibes
      Clouds:     'PL4fGSpr7zM3o5XZz2v3g_9Z4d5j3k8p0r', // Chill / Lo-fi
      Rain:       'PL8B722A7F5F7E927B',                     // Rainy day jazz / calm
      Drizzle:    'PL8B722A7F5F7E927B',                     // Same as rain
      Thunderstorm:'PL4fGSpr7zM3rP8c5t5m5v7q8p9d2k3s1a', // Dramatic / intense
      Snow:       'PL4fGSpr7zM3rG7d8a9b0c1d2e3f4g5h6j', // Winter / cozy
      Mist:       'PL4fGSpr7zM3pQ6r7s8t9u0v1w2x3y4z5a', // Calm / ambient
      Fog:        'PL4fGSpr7zM3pQ6r7s8t9u0v1w2x3y4z5a',
      default:    'PL4fGSpr7zM3qL9X4uXM3ZYw1A1b9X8V3f'  // Sunny as fallback
    };

    function getWeatherPlaylist(mainWeather) {
      return playlists[mainWeather] || playlists.default;
    }

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error)
  }
else { 
  x.innerHTML = "Geolocation is not supported by this browser."
}

async function success(position) {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    const data = await res.json()
    console.log(data)
    const weatherMain = data.weather[0].main;
    const playlistId = getWeatherPlaylist(weatherMain);
            const playerHtml = `
              <iframe 
                width="100%" 
                height="400" 
                src="https://www.youtube.com/embed/videoseries?list=${playlistId}&loop=1&autoplay=1&mute=0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
              </iframe>
            `;
            document.getElementById('music-player').innerHTML = playerHtml;
}

function error() {
  alert("Sorry, no position available.")
}

