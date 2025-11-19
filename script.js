const apiKey = "e5f6724a0d910e4c9cb00f6c27c6e2cd"
let x = document.getElementById("demo")

// Function to get location via browser geolocation

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
    const currentDate = new Date().toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short"
});

x.innerHTML = `
  <div style="
      padding: 50px;
      font-family: 'Poppins', sans-serif;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
  ">
      <p style="margin: 0; font-size: 14px; opacity: 0.8;">
          ${currentDate}
      </p>
      <h1 style="
          margin: 10px 0 0;
          font-size: 54px;
          font-weight: 600;
          line-height: 1; ">
          ${(data.main.temp - 273.15).toFixed(1)}°C
      </h1>
      <p style="margin: 6px 0 2px; font-size: 18px; opacity: 0.85;">
          ${data.weather[0].main}
      </p>
      <p style="margin: 0; font-size: 15px; opacity: 0.7;">
          Humidity: ${data.main.humidity}%
      </p>
      <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.8;">
          Location: ${data.name}
      </p>
  </div>
`;

x.style.color = "white";

}
function error() {
  alert("Sorry, no position available.")
}

// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// search via location and update map
async function searchByLocation(){
  const searchloc = document.getElementById("pincode").value;
  const res = await fetch (`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchloc)}&format=json&limit=1&countrycodes=in`)
  const data = await res.json()
  console.log(data);
  if (data.length === 0) {
            alert("Location not found!")
            return;
        }
  const lat = data[0].lat;
  const lon = data[0].lon;
  map.setView([lat, lon], 15);
  L.marker([lat, lon]).addTo(map)
    .bindPopup(`Searched Location`)
    .openPopup();
  const resFromOWM = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  const dataFromOWM = await resFromOWM.json()
  console.log(dataFromOWM)

const currentDate = new Date().toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short"
});

x.innerHTML = `
  <div style="
      padding: 50px;
      font-family: 'Poppins', sans-serif;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
  ">

      <p style="margin: 0; font-size: 14px; opacity: 0.8;">
        ${currentDate}
      </p>

      <h1 style="
          margin: 10px 0 0;
          font-size: 54px;
          font-weight: 600;
          line-height: 1;
      ">
          ${(dataFromOWM.main.temp - 273.15).toFixed(1)}°C
      </h1>

      <p style="margin: 6px 0 2px; font-size: 18px; opacity: 0.85;">
          ${dataFromOWM.weather[0].main}
      </p>

      <p style="margin: 0; font-size: 15px; opacity: 0.7;">
          Humidity: ${dataFromOWM.main.humidity}%
      </p>

  </div>
`;

}


//on-click update
map.on("click", async function (e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  const data = await res.json()
  L.popup()
    .setLatLng([lat, lon])
    .setContent(`Clicked Location`)
    .openOn(map);
  const currentDate = new Date().toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short"
});

x.innerHTML = `
  <div style="
      padding: 50px;
      font-family: 'Poppins', sans-serif;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
  ">
      <p style="margin: 0; font-size: 14px; opacity: 0.8;">
        ${currentDate}
      </p>
      <h1 style="
          margin: 10px 0 0;
          font-size: 54px;
          font-weight: 600;
          line-height: 1;
      ">
        ${(data.main.temp - 273.15).toFixed(1)}°C
      </h1>
      <p style="margin: 6px 0 2px; font-size: 18px; opacity: 0.85;">
        ${data.weather[0].main}
      </p>
      <p style="margin: 0; font-size: 15px; opacity: 0.7;">
        Humidity: ${data.main.humidity}%
      </p>
      <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.8;">
        Location: ${data.name}
      </p>
  </div>`;
x.style.color = "white";
});
