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
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
    })
};

baseLayers["EsriWorldImagery"].addTo(map);

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
        energy = gameState.energy;
        efficiency = gameState.efficiency;
        weather = gameState.weather;
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

// Function to upgrade oil rig
function upgradeOilRig(marker) {
    var oilRig = oilRigs.find(rig => rig.marker === marker);
    if (oilRig) {
        var upgradeCost = oilRig.level * 100;
        if (money >= upgradeCost) {
            money -= upgradeCost;
            oilRig.level++;
            oilRig.revenue += 10;
            marker.setPopupContent('Oil Rig (Level ' + oilRig.level + ')');
            updateResourceCounters();
            saveGameState();
        } else {
            alert('Not enough money to upgrade the oil rig!');
        }
    }
}

// Function to upgrade power plant
function upgradePowerPlant(marker) {
    var powerPlant = powerPlants.find(plant => plant.marker === marker);
    if (powerPlant) {
        var upgradeCost = powerPlant.level * 200;
        if (money >= upgradeCost) {
            money -= upgradeCost;
            powerPlant.level++;
            powerPlant.production += 20;
            marker.setPopupContent('Power Plant (Level ' + powerPlant.level + ')');
            updateResourceCounters();
            saveGameState();
        } else {
            alert('Not enough money to upgrade the power plant!');
        }
    }
}

// Function to calculate efficiency
function calculateEfficiency() {
    var totalLand = ownedLand.length;
    var totalOilRigs = oilRigs.length;
    var totalPowerPlants = powerPlants.length;
    if (totalLand > 0) {
        efficiency = ((totalOilRigs + totalPowerPlants) / totalLand) * 100;
    } else {
        efficiency = 100;
    }
    updateEfficiency();
}

// Function to fetch and update weather
function fetchWeather() {
    var apiKey = 'your_openweathermap_api_key';
    var lat = map.getCenter().lat;
    var lon = map.getCenter().lng;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            var condition = data.weather[0].main.toLowerCase();
            weather = condition.charAt(0).toUpperCase() + condition.slice(1);
            weatherImpact = weatherConditions[condition] || 1.0;
            updateWeather();
            updateResourceCounters();
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Periodically fetch weather
setInterval(fetchWeather, 60000); // Fetch weather every 60 seconds

// Event listener for adding oil rig
document.getElementById('add-oil-rig').addEventListener('click', function() {
    newOilRig = L.marker(map.getCenter(), {
        icon: L.icon({
            iconUrl: 'pump.gif',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        }),
        draggable: true
    }).addTo(map).bindPopup('Oil Rig (Level 1)').openPopup();

    newOilRig.on('click', function() {
        upgradeOilRig(newOilRig);
    });

    oilRigs.push({
        marker: newOilRig,
        level: 1,
        revenue: 10
    });

    calculateEfficiency();
    updateResourceCounters();
    saveGameState();
});

// Event listener for adding power plant
document.getElementById('add-power-plant').addEventListener('click', function() {
    newPowerPlant = L.marker(map.getCenter(), {
        icon: L.icon({
            iconUrl: 'windturbine.gif',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        }),
        draggable: true
    }).addTo(map).bindPopup('Power Plant (Level 1)').openPopup();

    newPowerPlant.on('click', function() {
        upgradePowerPlant(newPowerPlant);
    });

    powerPlants.push({
        marker: newPowerPlant,
        level: 1,
        production: 20
    });

    calculateEfficiency();
    updateResourceCounters();
    saveGameState();
});

// Event listener for purchasing land
document.getElementById('purchase-land').addEventListener('click', function() {
    var landCost = 500;
    if (money >= landCost) {
        var marker = L.marker(map.getCenter()).addTo(map).bindPopup('Owned Land');
        ownedLand.push(marker);
        money -= landCost;
        calculateEfficiency();
        updateResourceCounters();
        saveGameState();
    } else {
        alert('Not enough money to purchase land!');
    }
});

// Load game state on page load
loadGameState();
fetchWeather(); // Fetch weather immediately on load

// Debug console commands

// Add money
function moneyinitAdd(amount) {
    money += amount;
    updateMoney();
    console.log(`Added ${amount} money. New balance: ${money}`);
}

// Add oil rigs
function addOilRigs(count) {
    for (let i = 0; i < count; i++) {
        let newOilRig = L.marker(map.getCenter(), {
            icon: L.icon({
                iconUrl: 'pump.gif',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            }),
            draggable: true
        }).addTo(map).bindPopup('Oil Rig (Level 1)').openPopup();

        newOilRig.on('click', function() {
            upgradeOilRig(newOilRig);
        });

        oilRigs.push({
            marker: newOilRig,
            level: 1,
            revenue: 10
        });
    }
    console.log(`Added ${count} oil rigs.`);
    updateResourceCounters();
}

// Add power plants
function addPowerPlants(count) {
    for (let i = 0; i < count; i++) {
        let newPowerPlant = L.marker(map.getCenter(), {
            icon: L.icon({
                iconUrl: 'windturbine.gif',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            }),
            draggable: true
        }).addTo(map).bindPopup('Power Plant (Level 1)').openPopup();

        newPowerPlant.on('click', function() {
            upgradePowerPlant(newPowerPlant);
        });

        powerPlants.push({
            marker: newPowerPlant,
            level: 1,
            production: 20
        });
    }
    console.log(`Added ${count} power plants.`);
    updateResourceCounters();
}

// Increase all production
function increaseProduction(multiplier) {
    oilRigs.forEach(rig => {
        rig.revenue *= multiplier;
    });
    powerPlants.forEach(plant => {
        plant.production *= multiplier;
    });
    console.log(`Increased all production by a factor of ${multiplier}.`);
    updateResourceCounters();
}

// Add land
function addLand(lat, lng) {
    var marker = L.marker([lat, lng]).addTo(map).bindPopup('Owned Land');
    ownedLand.push(marker);
    console.log(`Added land at coordinates (${lat}, ${lng}).`);
    calculateEfficiency();
    updateResourceCounters();
}

