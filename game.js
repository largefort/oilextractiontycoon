// Helper function to format numbers in a short format (e.g., 1K, 1M)
function shortNumberFormat(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num;
}

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

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

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
function showDollarPopUp(amount, lngLat) {
    var popUp = document.createElement('div');
    popUp.className = 'dollar-pop-up';
    var point = map.project(lngLat);
    popUp.style.left = point.x + 'px';
    popUp.style.top = point.y + 'px';
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
        ownedLand: ownedLand.map(marker => marker.getLngLat()),
        oilRigs: oilRigs.map(rig => ({
            lngLat: rig.marker.getLngLat(),
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

        gameState.ownedLand.forEach(lngLat => {
            var marker = new mapboxgl.Marker()
                .setLngLat(lngLat)
                .setPopup(new mapboxgl.Popup().setText('Owned Land'))
                .addTo(map);
            ownedLand.push(marker);
        });

        gameState.oilRigs.forEach(rigData => {
            var oilRig = new mapboxgl.Marker({ draggable: true })
                .setLngLat(rigData.lngLat)
                .setPopup(new mapboxgl.Popup().setText('Oil Rig (Level ' + rigData.level + ')'))
                .addTo(map);
            oilRig.getElement().addEventListener('click', function() {
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
        var lngLat = rig.marker.getLngLat();
        showDollarPopUp(revenue.toFixed(2), lngLat);
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
    // Implement your weather effect logic here
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
        alert("Click on the map to buy land.");
        map.once('click', function(e) {
            var lngLat = e.lngLat;
            var marker = new mapboxgl.Marker()
                .setLngLat(lngLat)
                .setPopup(new mapboxgl.Popup().setText('Owned Land'))
                .addTo(map);
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
        newOilRig = new mapboxgl.Marker({ draggable: true })
            .setLngLat(map.getCenter())
            .setPopup(new mapboxgl.Popup().setText('Place this Oil Rig'))
            .addTo(map);

        newOilRig.on('dragend', function() {
            var lngLat = newOilRig.getLngLat();
            newOilRig.setPopup(new mapboxgl.Popup().setText('Oil Rig (Level 1)')).togglePopup();
            oilRigs.push({
                marker: newOilRig,
                level: 1,
                revenue: 10
            });
            newOilRig.getElement().addEventListener('click', function() {
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
        rigToUpgrade.marker.setPopup(new mapboxgl.Popup().setText('Oil Rig (Level ' + rigToUpgrade.level + ')')).togglePopup();
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
    let styleURL = '';
    switch (theme) {
        case 'street':
            styleURL = 'mapbox://styles/mapbox/streets-v11';
            break;
        case 'satellite':
            styleURL = 'mapbox://styles/mapbox/satellite-v9';
            break;
        case '3d':
            styleURL = 'mapbox://styles/mapbox/mapbox-streets-v8';
            break;
    }
    map.setStyle(styleURL);
    console.log("Map theme set to: " + theme);
}

// Toggle markers
function toggleMarkers(show) {
    if (show) {
        ownedLand.forEach(marker => marker.addTo(map));
        oilRigs.forEach(rig => rig.marker.addTo(map));
    } else {
        ownedLand.forEach(marker => marker.remove());
        oilRigs.forEach(rig => rig.marker.remove());
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
