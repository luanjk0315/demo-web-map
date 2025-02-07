// Initialize the map (Centered in Calgary)
var map = L.map('map').setView([51.0447, -114.0719], 10);

// OpenStreetMap (Default)
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// ✅ Fetch Weather Data from OpenWeatherMap API
const weatherAPI = "https://api.openweathermap.org/data/2.5/weather?lat=51.0447&lon=-114.0719&appid=67a80270ee5af9803402261c51b88e31&units=metric";

fetch(weatherAPI)
    .then(response => response.json())
    .then(data => {
        let temp = data.main.temp;         // Temperature (°C)
        let weather = data.weather[0].main; // Weather condition
        let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        // ✅ Add Weather Marker with Popup
        L.marker([51.0447, -114.0719]).addTo(map)
            .bindPopup(`
                <b>Weather in Calgary</b><br>
                <img src="${icon}" alt="Weather Icon"><br>
                <b>Condition:</b> ${weather}<br>
                <b>Temperature:</b> ${temp}°C
            `)
            .openPopup();
    })
    .catch(error => console.error("Error loading weather data:", error));



    
// Esri Satellite
var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri, Maxar, Earthstar Geographics'
});

// Stamen Terrain
var terrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
    attribution: '&copy; Stamen Design, OpenStreetMap contributors'
});

// Dark Mode
var dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB'
});

// Layer control (Allows users to switch between maps)
var baseMaps = {
    "OpenStreetMap": osm,
    "Satellite (Esri)": satellite,
    "Dark Mode (CartoDB)": dark
};

L.control.layers(baseMaps).addTo(map);


// Upload shapefile
document.getElementById("shapefileInput").addEventListener("change", function (event) {
    var file = event.target.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            shp(e.target.result).then(function (geojson) {
                L.geoJSON(geojson, {
                    style: { color: "green", weight: 2 }
                }).addTo(map);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

