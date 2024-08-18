(async () => {
    // Initialize CrazyGames SDK
    await window.CrazyGames.SDK.init();

    // Retrieve environment and QA tool status
    const environment = window.CrazyGames.SDK.environment;
    console.log("Environment:", environment);

    const isQaTool = window.CrazyGames.SDK.isQaTool;
    console.log("Is QA Tool available:", isQaTool);

    // Initialize game state using CrazyGames SDK data
    window.CrazyGames.SDK.data.setItem("money", 1000);
    window.CrazyGames.SDK.data.setItem("oil", 0);
    window.CrazyGames.SDK.data.setItem("energy", 0);
    window.CrazyGames.SDK.data.setItem("ownedLand", JSON.stringify([]));
    window.CrazyGames.SDK.data.setItem("oilRigs", JSON.stringify([]));
    window.CrazyGames.SDK.data.setItem("powerPlants", JSON.stringify([]));
    window.CrazyGames.SDK.data.setItem("newOilRig", null);
    window.CrazyGames.SDK.data.setItem("newPowerPlant", null);
    window.CrazyGames.SDK.data.setItem("efficiency", 100);
    window.CrazyGames.SDK.data.setItem("weather", 'Fetching...');
    window.CrazyGames.SDK.data.setItem("weatherImpact", 1.0);

    // Retrieve and log initial game state
    const money = window.CrazyGames.SDK.data.getItem("money");
    const oil = window.CrazyGames.SDK.data.getItem("oil");
    const energy = window.CrazyGames.SDK.data.getItem("energy");
    const ownedLand = JSON.parse(window.CrazyGames.SDK.data.getItem("ownedLand"));
    const oilRigs = JSON.parse(window.CrazyGames.SDK.data.getItem("oilRigs"));
    const powerPlants = JSON.parse(window.CrazyGames.SDK.data.getItem("powerPlants"));
    const newOilRig = window.CrazyGames.SDK.data.getItem("newOilRig");
    const newPowerPlant = window.CrazyGames.SDK.data.getItem("newPowerPlant");
    const efficiency = window.CrazyGames.SDK.data.getItem("efficiency");
    const weather = window.CrazyGames.SDK.data.getItem("weather");
    const weatherImpact = window.CrazyGames.SDK.data.getItem("weatherImpact");

    console.log("Initial Game State:", {
        money,
        oil,
        energy,
        ownedLand,
        oilRigs,
        powerPlants,
        newOilRig,
        newPowerPlant,
        efficiency,
        weather,
        weatherImpact
    });

    // Handle game loading events
    function startLoading() {
        window.CrazyGames.SDK.game.loadingStart();
        // Simulate loading process...
        window.CrazyGames.SDK.game.loadingStop();
    }

    function loadNextLevel() {
        window.CrazyGames.SDK.game.loadingStart();
        // Simulate loading next level assets...
        window.CrazyGames.SDK.game.loadingStop();
    }

    // Handle gameplay events
    function stopGameplay() {
        window.CrazyGames.SDK.game.gameplayStop();
    }

    function startGameplay() {
        window.CrazyGames.SDK.game.gameplayStart();
    }

    // Handle happy time celebrations
    function celebrate() {
        window.CrazyGames.SDK.game.happytime();
    }

    // Handle user account availability
    const isUserAccountAvailable = window.CrazyGames.SDK.user.isUserAccountAvailable;
    console.log("User account system available:", isUserAccountAvailable);

    // Retrieve user information - await example
    try {
        const user = await window.CrazyGames.SDK.user.getUser();
        console.log("User info (await):", user);
    } catch (e) {
        console.log("Get user error (await):", e);
    }

    // Retrieve user information - .then .catch example
    window.CrazyGames.SDK.user
        .getUser()
        .then((user) => console.log("User info (.then):", user))
        .catch((e) => console.log("Get user error (.then):", e));

    // Retrieve system information
    const systemInfo = window.CrazyGames.SDK.user.systemInfo;
    console.log("System info:", systemInfo);

    // Handle user authentication prompt
    try {
        const user = await window.CrazyGames.SDK.user.showAuthPrompt();
        console.log("Auth prompt result:", user);
    } catch (e) {
        console.log("Error during auth prompt:", e);
    }

    // Retrieve user token
    try {
        const token = await window.CrazyGames.SDK.user.getUserToken();
        console.log("User token:", token);
    } catch (e) {
        console.log("Error retrieving user token:", e);
    }

    // Handle game invite links
    function createInviteLink(roomId) {
        const link = window.CrazyGames.SDK.game.inviteLink({ roomId });
        console.log("Invite link:", link);
    }

    function showInviteButton(roomId) {
        const link = window.CrazyGames.SDK.game.showInviteButton({ roomId });
        console.log("Invite button link:", link);
    }

    function hideInviteButton() {
        window.CrazyGames.SDK.game.hideInviteButton();
    }

    function getInviteParam(param) {
        const value = window.CrazyGames.SDK.game.getInviteParam(param);
        console.log(`${param} value:`, value);
        return value;
    }

    // Example of setting game state
    function updateGameState(newMoney, newOil, newEnergy) {
        window.CrazyGames.SDK.data.setItem("money", newMoney);
        window.CrazyGames.SDK.data.setItem("oil", newOil);
        window.CrazyGames.SDK.data.setItem("energy", newEnergy);
        console.log("Game state updated:", {
            money: newMoney,
            oil: newOil,
            energy: newEnergy
        });
    }

    // Save and load game state methods using SDK
    function saveGameState() {
        const gameState = {
            money: window.CrazyGames.SDK.data.getItem("money"),
            oil: window.CrazyGames.SDK.data.getItem("oil"),
            energy: window.CrazyGames.SDK.data.getItem("energy"),
            efficiency: window.CrazyGames.SDK.data.getItem("efficiency"),
            weather: window.CrazyGames.SDK.data.getItem("weather"),
            ownedLand: JSON.parse(window.CrazyGames.SDK.data.getItem("ownedLand")),
            oilRigs: JSON.parse(window.CrazyGames.SDK.data.getItem("oilRigs")),
            powerPlants: JSON.parse(window.CrazyGames.SDK.data.getItem("powerPlants")),
        };
        console.log("Saving game state:", gameState);
        window.CrazyGames.SDK.data.setItem('gameState', JSON.stringify(gameState));
    }

    function loadGameState() {
        const gameState = JSON.parse(window.CrazyGames.SDK.data.getItem('gameState'));
        if (gameState) {
            console.log("Loaded game state:", gameState);
            window.CrazyGames.SDK.data.setItem("money", gameState.money);
            window.CrazyGames.SDK.data.setItem("oil", gameState.oil);
            window.CrazyGames.SDK.data.setItem("energy", gameState.energy);
            window.CrazyGames.SDK.data.setItem("efficiency", gameState.efficiency);
            window.CrazyGames.SDK.data.setItem("weather", gameState.weather);
            window.CrazyGames.SDK.data.setItem("ownedLand", JSON.stringify(gameState.ownedLand));
            window.CrazyGames.SDK.data.setItem("oilRigs", JSON.stringify(gameState.oilRigs));
            window.CrazyGames.SDK.data.setItem("powerPlants", JSON.stringify(gameState.powerPlants));
        }
    }

    // Call these functions to manage the game lifecycle
    startLoading();
    startGameplay();
    saveGameState();
    loadGameState();
})();
