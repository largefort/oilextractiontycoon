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
            mod.applyMod();
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

    applyAllMods() {
        this.mods.forEach(mod => mod.applyMod());
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
                    applyMod: function() {
                        setInterval(() => {
                            const moneyElement = document.getElementById('money');
                            let money = parseInt(moneyElement.innerText, 10);
                            money += 100; // Increase money by 100 every second
                            moneyElement.innerText = money.toString();
                        }, 1000);
                    }
                }`;
        } else if (keywords.includes('oil')) {
            code = `
                {
                    name: "${modName}",
                    version: "1.0",
                    applyMod: function() {
                        setInterval(() => {
                            const oilElement = document.getElementById('oil');
                            let oil = parseInt(oilElement.innerText, 10);
                            oil += 10; // Increase oil by 10 every second
                            oilElement.innerText = oil.toString();
                        }, 1000);
                    }
                }`;
        } else if (keywords.includes('energy')) {
            code = `
                {
                    name: "${modName}",
                    version: "1.0",
                    applyMod: function() {
                        setInterval(() => {
                            const energyElement = document.getElementById('energy');
                            let energy = parseInt(energyElement.innerText, 10);
                            energy += 5; // Increase energy by 5 every second
                            energyElement.innerText = energy.toString();
                        }, 1000);
                    }
                }`;
        }

        return code;
    }
}

const ModAPI = new ModdingAPI();
