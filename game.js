// Initialize map
var map = L.map('map', {
    zoomControl: false // Disable default zoom control
}).setView([37.8, -96], 4); // Centered on the USA

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
    "EsriWorldImagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
    })
};

// Weather layer
var apiKey = 'd84afbbe625f95c7ac07c52f081f1da6';
var weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    maxZoom: 18
});

baseLayers["EsriWorldImagery"].addTo(map);

weatherLayer.addTo(map); // Add weather layer to the map
// Initialize World Mini Map
var worldMiniMap = L.control.worldMiniMap({
    position: 'bottomleft',
    style: {
        opacity: 0.9,
        borderRadius: '0px',
        backgroundColor: 'lightblue'
    }
}).addTo(map);

var money = 1000;
var oil = 0;
var energy = 0;
var ownedLand = [];
var oilRigs = [];
var powerPlants = [];
var newOilRig;
var newPowerPlant;
var efficiency = 100;
var weather = 'Fetching...';
var weatherImpact = 1.0; // Multiplier for production rate

var totalOilExtracted = 0;
var totalEnergyGenerated = 0;
var totalBuildingsPlaced = 0;
var totalLandsOwned = 0;
var totalMoneyProduced = 0; // This tracks the total money produced by oil rigs

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

// Function to format large numbers in a short format (e.g., 1K, 1M)
function shortNumberFormat(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M';
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K';
    }
    return num;
}

// Function to format large numbers in watts notation
function wattsFormat(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + ' GW';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + ' MW';
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + ' kW';
    }
    return num + ' W';
}

// Function to update money display
function updateMoney() {
    document.getElementById('money').innerText = shortNumberFormat(money);
}

// Function to update oil display
function updateOil() {
    document.getElementById('oil').innerText = shortNumberFormat(oil);
}

// Function to update energy display
function updateEnergy() {
    document.getElementById('energy').innerText = wattsFormat(energy);
}

// Function to update efficiency display
function updateEfficiency() {
    document.getElementById('efficiency').innerText = efficiency + '%';
}

// Function to update weather display
function updateWeather() {
    document.getElementById('weather').innerText = weather;
}

// Function to update money production display
function updateMoneyProduction() {
    var moneyProduction = 0;
    oilRigs.forEach(rig => {
        moneyProduction += rig.level * 10 * weatherImpact; // Assuming revenue is level * 10
    });
    document.getElementById('money-production').innerText = shortNumberFormat(moneyProduction.toFixed(2));
}

// Function to update oil rig production display
function updateOilRigProduction() {
    var oilRigProduction = 0;
    oilRigs.forEach(rig => {
        oilRigProduction += rig.level * weatherImpact; // Assuming each rig produces level * 1 barrel/s
    });
    document.getElementById('oil-rig-production').innerText = shortNumberFormat(oilRigProduction.toFixed(2));
}

// Function to update power plant production display
function updatePowerPlantProduction() {
    var powerPlantProduction = 0;
    powerPlants.forEach(plant => {
        powerPlantProduction += plant.production * weatherImpact; // Assuming production is level * 20 watts
    });
    document.getElementById('power-plant-production').innerText = wattsFormat(powerPlantProduction.toFixed(2));
}

// Function to update all resource counters
function updateResourceCounters() {
    updateMoney();
    updateOil();
    updateEnergy();
    updateEfficiency();
    updateMoneyProduction();
    updateOilRigProduction();
    updatePowerPlantProduction();
    updateStats();
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

// Function to show energy pop-up
function showEnergyPopUp(amount, latlng) {
    var popUp = document.createElement('div');
    popUp.className = 'energy-pop-up';
    popUp.style.left = latlng.x + 'px';
    popUp.style.top = latlng.y + 'px';
    popUp.innerText = `${wattsFormat(amount)}`;
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
        energy: energy,
        efficiency: efficiency,
        weather: weather,
        ownedLand: ownedLand.map(marker => marker.getLatLng()),
        oilRigs: oilRigs.map(rig => ({
            latlng: rig.marker.getLatLng(),
            level: rig.level,
            revenue: rig.revenue
        })),
        powerPlants: powerPlants.map(plant => ({
            latlng: plant.marker.getLatLng(),
            level: plant.level,
            production: plant.production
        })),
        stats: {
            totalOilExtracted: totalOilExtracted,
            totalEnergyGenerated: totalEnergyGenerated,
            totalBuildingsPlaced: totalBuildingsPlaced,
            totalLandsOwned: totalLandsOwned,
            totalMoneyProduced: totalMoneyProduced
        }
    };
    localStorage.setItem('oilExtractionGameState', JSON.stringify(gameState));
}

// Function to load game state
function loadGameState() {
    var gameState = JSON.parse(localStorage.getItem('oilExtractionGameState'));
    if (gameState) {
        money = gameState.money;
        oil = gameState.oil;
        energy = gameState.energy;
        efficiency = gameState.efficiency;
        weather = gameState.weather;

        totalOilExtracted = gameState.stats.totalOilExtracted || 0;
        totalEnergyGenerated = gameState.stats.totalEnergyGenerated || 0;
        totalBuildingsPlaced = gameState.stats.totalBuildingsPlaced || 0;
        totalLandsOwned = gameState.stats.totalLandsOwned || 0;
        totalMoneyProduced = gameState.stats.totalMoneyProduced || 0;

        updateResourceCounters();

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

        gameState.powerPlants.forEach(plantData => {
            var powerPlant = L.marker(plantData.latlng, {
                icon: L.icon({
                    iconUrl: 'windturbine.gif',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                }),
                draggable: true
            }).addTo(map).bindPopup('Power Plant (Level ' + plantData.level + ')');
            powerPlant.on('click', function() {
                upgradePowerPlant(powerPlant);
            });
            powerPlants.push({
                marker: powerPlant,
                level: plantData.level,
                production: plantData.production
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
        totalOilExtracted += rig.level; // Track total oil extracted

        totalMoneyProduced += revenue; // Track total money produced

        updateMoney();
        updateOil();
        updateResourceCounters(); // Update resource counters

        // Show dollar pop-up effect
        var latlng = map.latLngToContainerPoint(rig.marker.getLatLng());
        showDollarPopUp(revenue.toFixed(2), latlng);
    });

    powerPlants.forEach(plant => {
        var production = plant.production * weatherImpact;
        energy += production;
        totalEnergyGenerated += production; // Track total energy generated

        updateEnergy();
        updateResourceCounters(); // Update resource counters

        // Show energy pop-up effect
        var latlng = map.latLngToContainerPoint(plant.marker.getLatLng());
        showEnergyPopUp(production.toFixed(2), latlng);
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
    var apiKey = '<WGQL3A3FAHHPJD78V4XK987HG>';
    var url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Iceland?unitGroup=us&key=WGQL3A3FAHHPJD78V4XK987HG&contentType=json`;

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
            var marker = L.marker(latlng).addTo(map).bindPopup('Owned Land');
            ownedLand.push(marker);
            money -= 100;
            totalLandsOwned++; // Track total lands owned
            calculateEfficiency();
            updateResourceCounters();
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
            totalBuildingsPlaced++; // Track total buildings placed
            updateResourceCounters();
            saveGameState();
            updateAchievements(); // Check achievements
            newOilRig = null;
        });

        newOilRig.on('click', function() {
            upgradeOilRig(newOilRig);
        });
    } else {
        alert("Not enough money!");
    }
}

// Function to buy power plant
function buyPowerPlant() {
    if (money >= 1000) {
        alert("Drag and drop the power plant anywhere on the map.");
        newPowerPlant = L.marker(map.getCenter(), {
            icon: L.icon({
                iconUrl: 'windturbine.gif',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            }),
            draggable: true
        }).addTo(map).bindPopup('Place this Power Plant').openPopup();

        newPowerPlant.on('dragend', function() {
            var latlng = newPowerPlant.getLatLng();
            newPowerPlant.bindPopup('Power Plant (Level 1)'). openPopup();
            powerPlants.push({
                marker: newPowerPlant,
                level: 1,
                production: 20
            });
            money -= 1000;
            totalBuildingsPlaced++; // Track total buildings placed
            updateResourceCounters();
            saveGameState();
            updateAchievements(); // Check achievements
            newPowerPlant = null;
        });

        newPowerPlant.on('click', function() {
            upgradePowerPlant(newPowerPlant);
        });
    } else {
        alert("Not enough money!");
    }
}

// Function to upgrade oil rig
function upgradeOilRig(oilRig) {
    var rigToUpgrade = oilRigs.find(rig => rig.marker._leaflet_id === oilRig._leaflet_id);
    if (rigToUpgrade && money >= 300) {
        rigToUpgrade.level += 1;
        rigToUpgrade.revenue = rigToUpgrade.level * 10;
        rigToUpgrade.marker.setPopupContent('Oil Rig (Level ' + rigToUpgrade.level + ')').openPopup();
        money -= 300;
        updateResourceCounters();
        saveGameState();
        updateAchievements(); // Check achievements
    } else {
        alert("Not enough money to upgrade or no oil rig found!");
    }
}

// Function to upgrade power plant
function upgradePowerPlant(powerPlant) {
    var plantToUpgrade = powerPlants.find(plant => plant.marker._leaflet_id === powerPlant._leaflet_id);
    if (plantToUpgrade && money >= 600) {
        plantToUpgrade.level += 1;
        plantToUpgrade.production = plantToUpgrade.level * 20;
        plantToUpgrade.marker.setPopupContent('Power Plant (Level ' + plantToUpgrade.level + ')').openPopup();
        money -= 600;
        updateResourceCounters();
        saveGameState();
        updateAchievements(); // Check achievements
    } else {
        alert("Not enough money to upgrade or no power plant found!");
    }
}

// Function to update stats
function updateStats() {
    document.getElementById('total-oil').innerText = shortNumberFormat(totalOilExtracted);
    document.getElementById('total-energy').innerText = wattsFormat(totalEnergyGenerated);
    document.getElementById('total-buildings').innerText = totalBuildingsPlaced;
    document.getElementById('total-lands').innerText = totalLandsOwned;
    document.getElementById('total-money-produced').innerText = shortNumberFormat(totalMoneyProduced);

    saveGameState(); // Auto-save stats whenever they are updated
}

// Function to load version number from GitHub
async function loadVersionNumber() {
    try {
        const response = await fetch('https://api.github.com/repos/your-github-username/your-repo-name/releases/latest');
        const data = await response.json();
        const version = data.tag_name || '1.0.0';
        document.getElementById('version').innerText = version;
    } catch (error) {
        console.error('Failed to fetch version number:', error);
    }
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
    // Implementation for updating animation speed
    console.log("Animation speed set to: " + speed);
}

// Update map theme
function updateMapTheme(theme) {
    switch(theme) {
        case 'street':
            baseLayers["Street Map"].addTo(map);
            break;
        case 'satellite':
            baseLayers.Satellite.addTo(map);
            break;
        case 'EsriWorldImagery':
            baseLayers["EsriWorldImagery"].addTo(map);
            break;
    }
    console.log("Map theme set to: " + theme);
}

// Toggle markers
function toggleMarkers(show) {
    if (show) {
        ownedLand.forEach(marker => {
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
        });
        oilRigs.forEach(rig => {
            if (!map.hasLayer(rig.marker)) {
                rig.marker.addTo(map);
            }
        });
        powerPlants.forEach(plant => {
            if (!map.hasLayer(plant.marker)) {
                plant.marker.addTo(map);
            }
        });
    } else {
        ownedLand.forEach(marker => {
            if (map.hasLayer(marker)) {
                marker.removeFrom(map);
            }
        });
        oilRigs.forEach(rig => {
            if (map.hasLayer(rig.marker)) {
                rig.marker.removeFrom(map);
            }
        });
        powerPlants.forEach(plant => {
            if (map.hasLayer(plant.marker)) {
                plant.marker.removeFrom(map);
            }
        });
    }
    console.log("Show markers: " + show);
}

// Toggle high fidelity
function toggleHighFidelity(enable) {
    if (enable) {
        highFidelityLayer.addTo(map);
        console.log("High Fidelity enabled");
    } else {
        map.removeLayer(highFidelityLayer);
        console.log("High Fidelity disabled");
    }
}

// Load game state on start
loadGameState();

// Generate revenue every 10 seconds
setInterval(generateRevenue, 1000);

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

// Fetch the latest version number on page load
loadVersionNumber();
