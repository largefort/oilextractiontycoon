class ModdingAPI {
    constructor() {
        this.mods = [];
        this.loadModsFromStorage();
        this.authorizedDomains = ['geotycoon.online']; // Update with your actual domain
    }

    loadMod(mod) {
        if (!this.isAuthorizedDomain()) {
            console.error('Unauthorized domain.');
            return;
        }

        if (this.validateMod(mod)) {
            this.mods.push(mod);
            this.applyMod(mod);
            console.log(`Mod "${mod.name}" version ${mod.version} loaded successfully.`);
            this.saveModToStorage(mod);
        } else {
            console.error(`Failed to load mod "${mod.name}".`);
        }
    }

    isAuthorizedDomain() {
        const currentDomain = window.location.hostname;
        return this.authorizedDomains.includes(currentDomain);
    }

    validateMod(mod) {
        return mod.name && mod.version && typeof mod.applyMod === 'function';
    }

    applyMod(mod) {
        if (mod.moneyProductionRate) {
            this.moneyProductionRate += mod.moneyProductionRate;
        }
        if (mod.oilProductionRate) {
            this.oilProductionRate += mod.oilProductionRate;
        }
        if (mod.energyProductionRate) {
            this.energyProductionRate += mod.energyProductionRate;
        }
        // Update the resource container display here
        updateResourceContainer();
    }

    applyAllMods() {
        this.mods.forEach(mod => this.applyMod(mod));
    }

    getMods() {
        return this.mods;
    }

    saveModToStorage(mod) {
        let storedMods = JSON.parse(localStorage.getItem('mods')) || [];
        storedMods.push(mod);
        localStorage.setItem('mods', JSON.stringify(storedMods));
    }

    loadModsFromStorage() {
        let storedMods = JSON.parse(localStorage.getItem('mods')) || [];
        storedMods.forEach(mod => {
            if (this.validateMod(mod)) {
                this.mods.push(mod);
            }
        });
        this.applyAllMods();
    }

    clearAllMods() {
        this.mods = [];
        localStorage.removeItem('mods');
        console.log('All mods cleared from storage.');
    }

    removeMod(modName) {
        this.mods = this.mods.filter(mod => mod.name !== modName);
        let storedMods = JSON.parse(localStorage.getItem('mods')) || [];
        storedMods = storedMods.filter(mod => mod.name !== modName);
        localStorage.setItem('mods', JSON.stringify(storedMods));
        console.log(`Mod "${modName}" removed.`);
    }

    generateModCode(modName) {
        const keywords = modName.toLowerCase().split(' ');
        let code = `
            {
                name: "${modName}",
                version: "1.0",
                applyMod: function() {
                    console.log("Mod ${modName} is applied!");
                }
            }`;

        if (keywords.includes('money')) {
            code = `
                {
                    name: "${modName}",
                    version: "1.0",
                    moneyProductionRate: 100,
                    applyMod: function() {
                        // Implement money production increase logic here
                    }
                }`;
        } else if (keywords.includes('oil')) {
            code = `
                {
                    name: "${modName}",
                    version: "1.0",
                    oilProductionRate: 10,
                    applyMod: function() {
                        // Implement oil production increase logic here
                    }
                }`;
        } else if (keywords.includes('energy')) {
            code = `
                {
                    name: "${modName}",
                    version: "1.0",
                    energyProductionRate: 5,
                    applyMod: function() {
                        // Implement energy production increase logic here
                    }
                }`;
        }

        return code;
    }
}

const ModAPI = new ModdingAPI();
