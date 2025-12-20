/***********************
 * MAP INITIALIZATION *
 ***********************/
var map = L.map('map', { zoomControl: false }).setView([37.8, -96], 4);

/****************
 * BASE LAYERS *
 ****************/
var baseLayers = {
    "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18
    }),
    "Satellite": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap',
        maxZoom: 18
    }),
    "EsriWorldImagery": L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
    )
};

baseLayers["EsriWorldImagery"].addTo(map);

/*****************
 * WEATHER LAYER *
 *****************/
const OPENWEATHER_KEY = 'd84afbbe625f95c7ac07c52f081f1da6';
var weatherLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`,
    { maxZoom: 18 }
).addTo(map);

/***********************
 * HIGH FIDELITY LAYER *
 ***********************/
var highFidelityLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    { maxZoom: 19 }
);

/***********************
 * MINI MAP CONTROL *
 ***********************/
L.control.worldMiniMap({
    position: 'bottomleft',
    style: { opacity: 0.9, backgroundColor: 'lightblue' }
}).addTo(map);

/***********************
 * GAME STATE *
 ***********************/
var money = 1000;
var oil = 0;
var energy = 0;
var efficiency = 100;
var weather = 'Fetching...';
var weatherImpact = 1.0;

var ownedLand = [];
var oilRigs = [];
var powerPlants = [];

var totalOilExtracted = 0;
var totalEnergyGenerated = 0;
var totalBuildingsPlaced = 0;
var totalLandsOwned = 0;
var totalMoneyProduced = 0;

/***********************
 * WEATHER IMPACT TABLE *
 ***********************/
var weatherConditions = {
    thunderstorm: 0.5,
    drizzle: 0.8,
    rain: 0.7,
    snow: 0.6,
    clear: 1.0,
    clouds: 0.9,
    wind: 0.8,
    overcast: 0.7
};

/***********************
 * HELPERS *
 ***********************/
function normalizeWeather(c) {
    c = c.toLowerCase();
    if (c.includes('rain')) return 'rain';
    if (c.includes('snow')) return 'snow';
    if (c.includes('thunder')) return 'thunderstorm';
    if (c.includes('cloud')) return 'clouds';
    if (c.includes('wind')) return 'wind';
    return 'clear';
}

function shortNumberFormat(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return Math.floor(n);
}

function wattsFormat(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + ' GW';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + ' MW';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + ' kW';
    return Math.floor(n) + ' W';
}

/***********************
 * UI UPDATES *
 ***********************/
function updateResourceCounters() {
    document.getElementById('money').innerText = shortNumberFormat(money);
    document.getElementById('oil').innerText = shortNumberFormat(oil);
    document.getElementById('energy').innerText = wattsFormat(energy);
    document.getElementById('efficiency').innerText = efficiency.toFixed(0) + '%';

    document.getElementById('total-oil').innerText = shortNumberFormat(totalOilExtracted);
    document.getElementById('total-energy').innerText = wattsFormat(totalEnergyGenerated);
    document.getElementById('total-buildings').innerText = totalBuildingsPlaced;
    document.getElementById('total-lands').innerText = totalLandsOwned;
    document.getElementById('total-money-produced').innerText = shortNumberFormat(totalMoneyProduced);
}

/***********************
 * POPUPS *
 ***********************/
function spawnPopup(cls, text, point) {
    const el = document.createElement('div');
    el.className = cls;
    el.innerText = text;
    el.style.left = point.x + 'px';
    el.style.top = point.y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
}

/***********************
 * SAVE / LOAD *
 ***********************/
function saveGameState() {
    localStorage.setItem('oilExtractionGameState', JSON.stringify({
        money, oil, energy, efficiency, weather,
        totals: {
            totalOilExtracted,
            totalEnergyGenerated,
            totalBuildingsPlaced,
            totalLandsOwned,
            totalMoneyProduced
        },
        oilRigs: oilRigs.map(r => ({
            latlng: r.marker.getLatLng(),
            level: r.level,
            revenue: r.revenue
        })),
        powerPlants: powerPlants.map(p => ({
            latlng: p.marker.getLatLng(),
            level: p.level,
            production: p.production
        }))
    }));
}

function loadGameState() {
    const s = JSON.parse(localStorage.getItem('oilExtractionGameState'));
    if (!s) return;

    money = s.money;
    oil = s.oil;
    energy = s.energy;
    efficiency = s.efficiency;
    weather = s.weather;

    Object.assign(
        { totalOilExtracted, totalEnergyGenerated, totalBuildingsPlaced, totalLandsOwned, totalMoneyProduced },
        s.totals
    );

    s.oilRigs.forEach(d => {
        const m = L.marker(d.latlng, { draggable: true })
            .addTo(map)
            .bindPopup(`Oil Rig (Level ${d.level})`);
        oilRigs.push({ marker: m, level: d.level, revenue: d.revenue });
    });

    s.powerPlants.forEach(d => {
        const m = L.marker(d.latlng, { draggable: true })
            .addTo(map)
            .bindPopup(`Power Plant (Level ${d.level})`);
        powerPlants.push({ marker: m, level: d.level, production: d.production });
    });

    updateResourceCounters();
}

/***********************
 * WEATHER FETCH *
 ***********************/
const VISUAL_CROSSING_KEY = 'WGQL3A3FAHHPJD78V4XK987HG';

async function fetchWeather() {
    try {
        const r = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Iceland?unitGroup=metric&key=${VISUAL_CROSSING_KEY}&contentType=json`
        );
        const d = await r.json();
        const raw = d.currentConditions.conditions;
        const norm = normalizeWeather(raw);

        weather = raw;
        weatherImpact = weatherConditions[norm] || 1.0;
        document.getElementById('weather').innerText = weather;
        saveGameState();
    } catch (e) {
        console.error('Weather error', e);
    }
}

/***********************
 * ECONOMY TICK *
 ***********************/
function generateRevenue() {
    let m = 0, o = 0, e = 0;

    oilRigs.forEach(r => {
        const rev = r.revenue * weatherImpact;
        m += rev;
        o += r.level;
        totalOilExtracted += r.level;
        totalMoneyProduced += rev;
        spawnPopup('dollar-pop-up', `$${rev.toFixed(1)}`, map.latLngToContainerPoint(r.marker.getLatLng()));
    });

    powerPlants.forEach(p => {
        const prod = p.production * weatherImpact;
        e += prod;
        totalEnergyGenerated += prod;
        spawnPopup('energy-pop-up', wattsFormat(prod), map.latLngToContainerPoint(p.marker.getLatLng()));
    });

    money += m;
    oil += o;
    energy += e;

    updateResourceCounters();
    saveGameState();
}

/***********************
 * EFFICIENCY *
 ***********************/
function calculateEfficiency() {
    efficiency = ownedLand.length === 0 ? 100 : Math.max(50, 100 - Math.random() * 30);
}

/***********************
 * MAP SETTINGS *
 ***********************/
function updateMapTheme(theme) {
    Object.values(baseLayers).forEach(l => map.removeLayer(l));
    baseLayers[theme]?.addTo(map);
}

function toggleHighFidelity(on) {
    on ? highFidelityLayer.addTo(map) : map.removeLayer(highFidelityLayer);
}

/***********************
 * INIT *
 ***********************/
loadGameState();
fetchWeather();
setInterval(generateRevenue, 1000);
setInterval(fetchWeather, 60000);
setInterval(() => {
    calculateEfficiency();
    updateResourceCounters();
}, 30000);
