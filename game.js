// Helper function to format numbers in a short format (e.g., 1K, 1M)
function shortNumberFormat(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num;
}

// Initialize map
var map = L.map('map').setView([37.8, -96], 4); // Centered on the USA

// Base layers without pan animations
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
    document.getElementById('money-mobile').innerText = shortNumberFormat(money);
}

// Function to update oil display
function updateOil() {
    document.getElementById('oil-mobile').innerText = shortNumberFormat(oil);
}

// Function to update efficiency display
function updateEfficiency() {
    document.getElementById('efficiency-mobile').innerText = efficiency + '%';
}

// Function to show dollar pop-up
function showDollarPopUp(amount, latlng) {
    var popUp = document.createElement('div');
    popUp.className = 'dollar-pop-up';
    popUp.style.left = latlng.x + 'px';
    popUp.style.top = latlng.y + 'px';
    popUp.innerText = `$${shortNumberFormat(amount)}`;
    document.body.appendChild(popUp);

    setTimeout(() => {
        popUp.style.transform = 'translateY(-50px)';
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
        updateMoney();
        updateOil();
        updateEfficiency();

        gameState.ownedLand.forEach(latlng => {
            var marker = L.marker(latlng).addTo(map).bindPopup('Owned Land');
            ownedLand.push(marker);
        });

        gameState.oilRigs.forEach(rigData => {
            var oilRig = L.marker(rigData.latlng, {
                icon: L.icon({
                    iconUrl: 'pump.gif',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                }),
                draggable: true
            }).addTo(map).bindPopup('Oil Rig (Level ' + rigData.level + ')');
            oilRig.on('click', function() {
                upgradeOilRig(oilRig);
            });
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

// Function to set dynamic weather effects
function setWeatherEffects(weatherType) {
    if (window.weather) {
        window.weather.stop();
    }

    switch (weatherType) {
        case 'rain':
            window.weather = new WeatherEffect(map, { type: 'rain', intensity: 0.5 });
            break;
        case 'snow':
            window.weather = new WeatherEffect(map, { type: 'snow', intensity: 0.5 });
            break;
        case 'thunderstorm':
            window.weather = new WeatherEffect(map, { type: 'thunderstorm', intensity: 0.5 });
            break;
        case 'clear':
            // Clear any weather effects
            break;
        default:
            // Clear any weather effects
            break;
    }

    if (window.weather) {
        window.weather.start();
    }
}

// Function to simulate weather change for testing
function simulateWeatherChange() {
    const weatherTypes = ['clear', 'rain', 'snow', 'thunderstorm'];
    const weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    setWeatherEffects(weatherType);
    weatherImpact = weatherConditions[weatherType] || 1.0;
    saveGameState();
}

// Function to buy land
function buyLand() {
    if (money >= 100) {
        alert("Tap on the map to buy land.");
        map.once('click', function(e) {
            var latlng = e.latlng;
            var marker = L.marker(latlng).addTo(map).bindPopup('Owned Land');
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
            newOilRig.on('click', function() {
                upgradeOilRig(newOilRig);
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
function upgradeOilRig(oilRig) {
    var rigToUpgrade = oilRigs.find(rig => rig.marker === oilRig);
    if (money >= 300 && rigToUpgrade) {
        rigToUpgrade.level++;
        rigToUpgrade.revenue = rigToUpgrade.level * 10;
        rigToUpgrade.marker.setPopupContent('Oil Rig (Level ' + rigToUpgrade.level + ')').openPopup();
        money -= 300;
        updateMoney();
        saveGameState();
    } else {
        alert("Not enough money to upgrade or no oil rig found!");
    }
}

// Function to handle 120Hz support for Samsung Galaxy A54 5G
function isSamsungGalaxyA54() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /SM-A546/.test(userAgent);
}

function setRefreshRate() {
    if (isSamsungGalaxyA54()) {
        const style = document.createElement('style');
        style.innerHTML = `
            @media (min-refresh-rate: 120Hz) {
                * {
                    scroll-behavior: smooth;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Function to limit refresh rate to 30Hz for specific browsers
function limitRefreshRate() {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isOpera = /OPR/.test(userAgent) || /Opera/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isModernBrowser = isChrome || isSafari || isOpera || isFirefox;

    if (isModernBrowser) {
        let lastFrameTime = 0;
        const frameInterval = 1000 / 30;

        function requestAnimationFrameWithLimit(callback) {
            const now = performance.now();
            const elapsed = now - lastFrameTime;

            if (elapsed >= frameInterval) {
                lastFrameTime = now - (elapsed % frameInterval);
                callback(now);
            }

            window.requestAnimationFrame(() => requestAnimationFrameWithLimit(callback));
        }

        window.requestAnimationFrame = requestAnimationFrameWithLimit;
    }
}

// Display mobile overlay if on a mobile device
function showMobileOverlay() {
    document.getElementById('mobile-overlay').style.display = 'block';
}

// Toggle settings modal
function toggleSettingsModal() {
    var modal = document.getElementById('settings-modal');
    if (modal.style.display === "none" || modal.style.display === "") {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}

// Update animation speed
function updateAnimationSpeed(speed) {
    console.log("Animation speed set to: " + speed);
}

// Update map theme
function updateMapTheme(theme) {
    for (const layer in baseLayers) {
        map.removeLayer(baseLayers[layer]);
    }
    baseLayers[theme].addTo(map);
    console.log("Map theme set to: " + theme);
}

// Toggle markers
function toggleMarkers(show) {
    if (show) {
        ownedLand.forEach(marker => marker.addTo(map));
        oilRigs.forEach(rig => rig.marker.addTo(map));
    } else {
        ownedLand.forEach(marker => marker.removeFrom(map));
        oilRigs.forEach(rig => rig.marker.removeFrom(map));
    }
    console.log("Show markers: " + show);
}

showMobileOverlay();
setRefreshRate();
limitRefreshRate();

// Load game state on start
loadGameState();

// Generate revenue every 10 seconds
setInterval(generateRevenue, 1000);

// Recalculate efficiency every 30 seconds
setInterval(() => {
    calculateEfficiency();
    updateEfficiency();
}, 30000);

// Simulate weather change every 60 seconds
setInterval(() => {
    simulateWeatherChange();
}, 60000);

// Initial weather change
simulateWeatherChange();
