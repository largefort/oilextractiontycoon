// Initialize map
var map = L.map('map').setView([37.8, -96], 4); // Centered on the USA

// Base layers
var baseLayers = {
    "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }),
    "Satellite": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://www.opentopomap.org/copyright">OpenStreetMap',
        maxZoom: 18,
    }),
    "3D Map": L.tileLayer('https://maps.heigit.org/osm_tiles/{z}/{x}/{y}.png', {
        attribution: '3D map data © <a href="https://www.heigit.org">HeiGIT</a>',
        maxZoom: 18,
    })
};

baseLayers["Street Map"].addTo(map);
L.control.layers(baseLayers).addTo(map);

var money = 1000;
var oil = 0;
var ownedLand = [];
var oilRigs = [];
var newOilRig;
var efficiency = 100;
var weather = 'Fetching...';
var weatherImpact = 1.0; // Multiplier for production rate

// Weather conditions and their impact
var weatherConditions = {
    'thunderstorm': 0.5,
    'drizzle': 0.8,
    'rain': 0.7,
    'snow': 0.6,
    'clear': 1.0,
    'clouds': 0.9,
    'wind': 0.8,
    'overcast': 0.7,
    'red weather alert': 0.3,
    'yellow weather alert': 0.5
};

// Initialize Leaflet Draw
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    draw: false,
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

// Function to update money display
function updateMoney() {
    document.getElementById('money').innerText = money;
}

// Function to update oil display
function updateOil() {
    document.getElementById('oil').innerText = oil;
}

// Function to update efficiency display
function updateEfficiency() {
    document.getElementById('efficiency').innerText = efficiency + '%';
}

// Function to update weather display
function updateWeather() {
    document.getElementById('weather').innerText = weather;
}

// Function to show dollar pop-up
function showDollarPopUp(amount, latlng) {
    var popUp = document.createElement('div');
    popUp.className = 'dollar-pop-up';
    popUp.style.left = (latlng.x - 20) + 'px';
    popUp.style.top = (latlng.y - 20) + 'px';
    popUp.innerText = `$${amount}`;
    document.body.appendChild(popUp);

    setTimeout(() => {
        popUp.style.top = (latlng.y - 40) + 'px';
        popUp.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(popUp);
        }, 1000);
    }, 1000);
}

// Function to save game state
function saveGameState() {
    var gameState = {
        money: money,
        oil: oil,
        efficiency: efficiency,
        weather: weather,
        ownedLand: ownedLand.map(marker => marker.getLatLng()),
        oilRigs: oilRigs.map(rig => ({
            latlng: rig.marker.getLatLng(),
            level: rig.level,
            revenue: rig.revenue
        }))
    };
    localStorage.setItem('oilExtractionGameState', JSON.stringify(gameState));
}

// Function to load game state
function loadGameState() {
    var gameState = JSON.parse(localStorage.getItem('oilExtractionGameState'));
    if (gameState) {
        money = gameState.money;
        oil = gameState.oil;
        efficiency = gameState.efficiency;
        weather = gameState.weather;
        updateMoney();
        updateOil();
        updateEfficiency();
        updateWeather();
        
        gameState.ownedLand.forEach(latlng => {
            var marker = L.marker(latlng).addTo(map).bindPopup('Owned Land').openPopup();
            ownedLand.push(marker);
        });
        
        gameState.oilRigs.forEach(rigData => {
            var oilRig = L.marker(rigData.latlng, {
                icon: L.icon({
                    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/oil-pump.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                }),
                draggable: true
            }).addTo(map).bindPopup('Oil Rig (Level ' + rigData.level + ')').openPopup();
            oilRigs.push({
                marker: oilRig,
                level: rigData.level,
                revenue: rigData.revenue
            });
        });
    }
}

// Function to generate revenue
function generateRevenue() {
    oilRigs.forEach(rig => {
        var revenue = rig.revenue * weatherImpact;
        money += revenue;
        oil += rig.level; // Oil production increases with level
        updateMoney();
        updateOil();

        // Show dollar pop-up effect
        var latlng = map.latLngToContainerPoint(rig.marker.getLatLng());
        showDollarPopUp(revenue.toFixed(2), latlng);
    });
    saveGameState();
}

// Function to calculate efficiency
function calculateEfficiency() {
    var totalLands = ownedLand.length;
    if (totalLands === 0) {
        efficiency = 100;
        return;
    }

    var lowOilLands = Math.floor(Math.random() * totalLands);
    efficiency = ((totalLands - lowOilLands) / totalLands) * 100;
}

// Function to change weather based on API data
async function fetchWeather() {
    var apiKey = '<AK4KJ2NGA3TSFBNHGQ2FJQEZF>';
    var url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/america?unitGroup=metric&key=AK4KJ2NGA3TSFBNHGQ2FJQEZF&contentType=json`;
    
    try {
        var response = await fetch(url, {
            method: 'GET',
            headers: {}
        });
        var data = await response.json();
        console.log(data); // Log the response for debugging purposes
        var weatherType = data.currentConditions.conditions.toLowerCase();
        weather = weatherType;
        weatherImpact = weatherConditions[weatherType] || 1.0;
        updateWeather();
        saveGameState();
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to buy land
function buyLand() {
    if (money >= 100) {
        alert("Tap on the map to buy land.");
        map.once('click', function(e) {
            var latlng = e.latlng;
            var marker = L.marker(latlng).addTo(map).bindPopup('Owned Land').openPopup();
            ownedLand.push(marker);
            money -= 100;
            updateMoney();
            calculateEfficiency();
            updateEfficiency();
            saveGameState();
        });
    } else {
        alert("Not enough money!");
    }
}

// Function to buy oil rig
function buyOilRig() {
    if (money >= 500) {
        alert("Drag and drop the oil rig anywhere on the map.");
        newOilRig = L.marker(map.getCenter(), {
            icon: L.icon({
                iconUrl: 'pump.gif',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            }),
            draggable: true
        }).addTo(map).bindPopup('Place this Oil Rig').openPopup();

        newOilRig.on('dragend', function() {
            var latlng = newOilRig.getLatLng();
            newOilRig.bindPopup('Oil Rig (Level 1)').openPopup();
            oilRigs.push({
                marker: newOilRig,
                level: 1,
                revenue: 10
            });
            money -= 500;
            updateMoney();
            saveGameState();
            newOilRig = null;
        });
    } else {
        alert("Not enough money!");
    }
}

// Function to upgrade oil rig
function upgradeOilRig() {
    if (money >= 300 && oilRigs.length > 0) {
        alert("Tap on an oil rig to upgrade.");
        map.once('click', function(e) {
            var latlng = e.latlng;
            var rigToUpgrade = oilRigs.find(function(rig) {
                return rig.marker.getLatLng().equals(latlng);
            });

            if (rigToUpgrade) {
                rigToUpgrade.level++;
                rigToUpgrade.revenue = rigToUpgrade.level * 10;
                rigToUpgrade.marker.setPopupContent('Oil Rig (Level ' + rigToUpgrade.level + ')').openPopup();
                money -= 300;
                updateMoney();
                saveGameState();
            } else {
                alert("You must tap on an oil rig to upgrade!");
            }
        });
    } else {
        alert("Not enough money or you don't have any oil rigs!");
    }
}

// Load game state on start
loadGameState();

// Generate revenue every 10 seconds
setInterval(generateRevenue, 10000);

// Recalculate efficiency every 30 seconds
setInterval(() => {
    calculateEfficiency();
    updateEfficiency();
}, 30000);

// Fetch weather every 60 seconds
setInterval(() => {
    fetchWeather();
}, 60000);

// Initial fetch weather
fetchWeather();
