// Game: Palworld Mobile - Save & Load System

export const SaveManager = {
    saveKey: "PALWORLD_MOBILE_SAVE_DATA",

    // Sabhi systems ka data ek sath save karna
    saveGame(playerData, inventory, buildings, pals) {
        const fullSave = {
            player: playerData,
            items: inventory,
            world: buildings,
            capturedPals: pals,
            timestamp: Date.now()
        };
        
        localStorage.setItem(this.saveKey, JSON.stringify(fullSave));
        console.log("Game Saved Successfully!");
    },

    // Save data wapas load karna
    loadGame() {
        const rawData = localStorage.getItem(this.saveKey);
        if (!rawData) return null;
        
        console.log("Loading Game Data...");
        return JSON.parse(rawData);
    },

    deleteSave() {
        localStorage.removeItem(this.saveKey);
        return "Save Deleted";
    }
};
