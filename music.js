var saveclass = null;
const apiKey = "e5f6724a0d910e4c9cb00f6c27c6e2cd";
const playlists = {
  Clear: 'PLkt9XUTl-ArjQZFVNK1oayMWYDLlMGSrW', 
  Clouds: 'PLkt9XUTl-Arih01dq-xS78UkSjvc77SIJ', 
  Rain: 'PLkt9XUTl-Arhmi4RPQ--XCYK2xIHDWLskw', 
  Drizzle: 'PLkt9XUTl-Arhmi4RPQ--XCYK2xIHDWLskw',
  Thunderstorm: 'PLkt9XUTl-ArjSjdlIc-3x9DrMm5FXId9N', 
  Snow: 'PPLkt9XUTl-ArixwkZYEQimDcazTc9Fgbvg', 
  Mist: 'PLkt9XUTl-Ari4soHZcB7_6_Pq6tf_IMhu', 
  Fog: 'PLkt9XUTl-Ari4soHZcB7_6_Pq6tf_IMhu',
  default: 'PLkt9XUTl-ArjQZFVNK1oayMWYDLlMGSrW'
};
function getWeatherPlaylist(mainWeather) {
  return playlists[mainWeather] || playlists.default;
}
let player;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  document.getElementById('music-player').innerHTML = "Geolocation is not supported by this browser."; // Fixed: Use 'music-player' instead of undefined 'x'
}
async function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
  const data = await res.json();
  console.log(data);
  const weatherMain = data.weather[0].main;
  const playlistId = getWeatherPlaylist(weatherMain);
  document.getElementById('music-player').innerHTML = '<div id="youtube-player"></div>';
  if (!window.onYouTubeIframeAPIReady) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = initPlayer; 
  } else {
    initPlayer();
  }
  function initPlayer() {
    player = new YT.Player('youtube-player', {
      width: '100%',
      height: 450,
      videoId: '',
      playerVars: {
        listType: 'playlist',
        list: playlistId,
        autoplay: 1,
        loop: 1,
        playlist: playlistId,
        mute: 1,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3
      },
      events: {
        onReady: onPlayerReady,
        onError: onPlayerError
      }
    });
  }
  function onPlayerReady(event) {
    console.log('Player ready! Playlist ID:', playlistId);
    event.target.setVolume(50); 
  }
  function onPlayerError(event) {
    console.error('Player error:', event.data);
    if (event.data === 150 || event.data === 101) { 
      player.nextVideo(); 
    }
  }
  console.log('Playlist ID loaded:', playlistId);
}
function error() {
  alert("Sorry, no position available.");
}