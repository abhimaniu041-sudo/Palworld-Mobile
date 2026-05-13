// Game: Palworld Mobile - Base Pal Management

export const BaseAutomation = {
    deployedPals: [],

    deployToBase(palData, position) {
        const worker = {
            ...palData,
            basePos: position,
            currentTask: 'IDLE',
            lastWorkTime: Date.now()
        };
        this.deployedPals.push(worker);
        console.log(`%c [BASE] ${palData.name} is now working at your base!`, "color: #00ffff; font-weight: bold;");
    },

    processTasks(inventory) {
        this.deployedPals.forEach(pal => {
            // Every 10 seconds, workers generate resources
            if (Date.now() - pal.lastWorkTime > 10000) {
                inventory.addItem('wood', 'Wood', 0.5, 1);
                pal.lastWorkTime = Date.now();
                console.log(`[AUTO] Worker ${pal.name} gathered 1 Wood.`);
            }
        });
    }
};
