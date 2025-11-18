const apiKey = "e5f6724a0d910e4c9cb00f6c27c6e2cd"
const x = document.getElementById("demo")

// Function to get location via browser geolocation
function getLocation(){
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
    }
    else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

async function success(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await res.json();
    console.log(data);
    x.innerHTML = `
    Temperature: ${(data.main.temp - 273.15).toFixed(2)}℃ <br> 
    Humidity: ${data.main.humidity}% <br>
    Weather: ${data.weather[0].main} <br>
    Location: ${data.name}
`;
    x.style.color="white"
}

function error() {
  alert("Sorry, no position available.");
}

// Function to get location by pincode
async function getLocationByPin(){
  const pincode = document.getElementById("pincode").value
  const res = await fetch (`https://api.openweathermap.org/data/2.5/weather?zip=${pincode},in&appid=${apiKey}`)
  const data = await res.json();
  x.innerHTML =`
    Temperature: ${(data.main.temp - 273.15).toFixed(2)}℃ <br> 
    Humidity: ${data.main.humidity}% <br>
    Weather: ${data.weather[0].main} <br>
    Location: ${data.name}
`;
  x.style.color="white"
}

// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

