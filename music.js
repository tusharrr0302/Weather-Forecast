
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

let player;
let currentWeather = "Clear";

function getWeatherPlaylist(main) {
  return playlists[main] || playlists.default;
}

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore(tag, firstScript);

function onYouTubeIframeAPIReady() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    document.getElementById("track-title").textContent = "Geolocation not supported";
  }
}

async function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
  const data = await res.json();

  const weatherMain = data.weather[0].main;
  currentWeather = weatherMain;
  const playlistId = getWeatherPlaylist(weatherMain);


  document.getElementById("weather-mood").textContent = `Playing ${weatherMain} vibes`;
  document.getElementById("weather-tag").textContent = weatherMain;


  player = new YT.Player('youtube-player', {
    height: '1',
    width: '1',
    playerVars: {
      listType: 'playlist',
      list: playlistId,
      autoplay: 1,
      loop: 1,
      playlist: playlistId,
      modestbranding: 1,
      controls: 0,
      fs: 0,
      iv_load_policy: 3
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: (e) => (e.data === 150 || e.data === 101) && player.nextVideo()
    }
  });
}

function onPlayerReady(e) {
  e.target.playVideo();
  updateTitle();
  setInterval(updateTitle, 6000);
}

function onPlayerStateChange(e) {
  const btn = document.getElementById("play-pause");
  btn.innerHTML = e.data === 1 
    ? '<i class="fas fa-pause"></i>' 
    : '<i class="fas fa-play"></i>';
}

function updateTitle() {
  if (player && player.getVideoData) {
    const title = player.getVideoData().title || "Unknown Track";
    document.getElementById("track-title").textContent = title;
  }
}

document.getElementById("play-pause").onclick = () => player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo();
document.getElementById("next-btn").onclick = () => player.nextVideo();
document.getElementById("prev-btn").onclick = () => player.previousVideo();
document.getElementById("volume-slider").oninput = (e) => {
  player.setVolume(e.target.value);
  if (e.target.value > 0) player.unMute();
};

function error() {
  document.getElementById("track-title").textContent = "Location access denied";
  document.getElementById("weather-mood").textContent = "Allow location to play mood music";
}