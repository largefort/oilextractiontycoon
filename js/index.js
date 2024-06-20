document.addEventListener('DOMContentLoaded', function() {
    const translations = {
        en: {
            title: "Oil Extraction Tycoon Mobile",
            oil: "Oil:",
            energy: "Energy:",
            efficiency: "Efficiency:",
            weather: "Fetching...",
            buyLand: "Buy Land ($100)",
            buyOilRig: "Buy Oil Rig ($500)",
            buyPowerPlant: "Buy Power Plant ($1000)",
            upgradeOilRig: "Upgrade Oil Rig ($300)",
            upgradePowerPlant: "Upgrade Power Plant ($600)",
            worldMap: "World Map",
            controls: "Controls",
            settings: "Settings",
            settingsTitle: "Geo Map Settings",
            animationSpeed: "Animation Speed:",
            mapTheme: "Map Theme:",
            showMarkers: "Show Markers",
            language: "Language:"
        },
        es: {
            title: "Magnate de Extracción de Petróleo",
            oil: "Petróleo:",
            energy: "Energía:",
            efficiency: "Eficiencia:",
            weather: "Obteniendo...",
            buyLand: "Comprar Terreno ($100)",
            buyOilRig: "Comprar Plataforma Petrolífera ($500)",
            buyPowerPlant: "Comprar Planta de Energía ($1000)",
            upgradeOilRig: "Mejorar Plataforma Petrolífera ($300)",
            upgradePowerPlant: "Mejorar Planta de Energía ($600)",
            worldMap: "Mapa Mundial",
            controls: "Controles",
            settings: "Configuraciones",
            settingsTitle: "Configuraciones de Mapa",
            animationSpeed: "Velocidad de Animación:",
            mapTheme: "Tema del Mapa:",
            showMarkers: "Mostrar Marcadores",
            language: "Idioma:"
        },
        no: {
            title: "Oljeutvinningsmagnat",
            oil: "Olje:",
            energy: "Energi:",
            efficiency: "Effektivitet:",
            weather: "Henter...",
            buyLand: "Kjøp Land ($100)",
            buyOilRig: "Kjøp Oljebor ($500)",
            buyPowerPlant: "Kjøp Kraftverk ($1000)",
            upgradeOilRig: "Oppgrader Oljebor ($300)",
            upgradePowerPlant: "Oppgrader Kraftverk ($600)",
            worldMap: "Verdenskart",
            controls: "Kontroller",
            settings: "Innstillinger",
            settingsTitle: "Geo Kartinnstillinger",
            animationSpeed: "Animasjonshastighet:",
            mapTheme: "Karttema:",
            showMarkers: "Vis Markører",
            language: "Språk:"
        },
        he: {
            title: "מנהל מיצוי נפט",
            oil: "נפט:",
            energy: "אנרגיה:",
            efficiency: ":יעילות",
            weather: "טוען...",
            buyLand: "קנה קרקע ($100)",
            buyOilRig: "קנה מתקן קידוח ($500)",
            buyPowerPlant: "קנה תחנת כוח ($1000)",
            upgradeOilRig: "שדרג מתקן קידוח ($300)",
            upgradePowerPlant: "שדרג תחנת כוח ($600)",
            worldMap: "מפת העולם",
            controls: "בקרות",
            settings: "הגדרות",
            settingsTitle: "הגדרות מפת גיאו",
            animationSpeed: "מהירות אנימציה:",
            mapTheme: "נושא מפה:",
            showMarkers: "הצג סמנים",
            language: "שפה:"
        },
        is: {
            title: "Olíuútdráttarmógúll",
            oil: "Olía:",
            energy: "Orka:",
            efficiency: "Skilvirkni:",
            weather: "Sækir...",
            buyLand: "Kaupa Land ($100)",
            buyOilRig: "Kaupa Olíubor ($500)",
            buyPowerPlant: "Kaupa Orkuver ($1000)",
            upgradeOilRig: "Uppfæra Olíubor ($300)",
            upgradePowerPlant: "Uppfæra Orkuver ($600)",
            worldMap: "Heimskort",
            controls: "Stýringar",
            settings: "Stillingar",
            settingsTitle: "Stillingskort",
            animationSpeed: "Animasíuhraði:",
            mapTheme: "Kortþema:",
            showMarkers: "Sýna Merki",
            language: "Tungumál:"
        }
    };
    function changeLanguage(language) {
        const selectedTranslations = translations[language];
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.innerText = selectedTranslations[key];
        });

        // Save selected language to local storage
        localStorage.setItem('selectedLanguage', language);
    }

    // Retrieve saved language from local storage or set default language to English
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    changeLanguage(savedLanguage);

    // Set the language select dropdown to the saved language
    document.getElementById('language-select').value = savedLanguage;

    // Language selection event listener
    document.getElementById('language-select').addEventListener('change', function() {
        changeLanguage(this.value);
    });
});
