// Game: Palworld Mobile - Environment Objects

export const EnvironmentObjects = {
    resourceTypes: {
        TREE: { drop: "Wood", amount: [5, 10], tool: "Axe" },
        ROCK: { drop: "Stone", amount: [3, 8], tool: "Pickaxe" },
        PALLDIUM_ORE: { drop: "Fragment", amount: [1, 3], tool: "Pickaxe" }
    },

    // Random Egg Spawning Logic
    eggSpawns: [
        { type: "SCORCHING", chance: 0.1, biome: "DESERT" },
        { type: "FROZEN", chance: 0.1, biome: "SNOW" },
        { type: "ROCKY", chance: 0.3, biome: "HILLS" }
    ],

    spawnObject(type, x, z) {
        return {
            id: `obj_${Math.random().toString(36).substr(2, 9)}`,
            type: type,
            position: { x, y: 0, z },
            isHarvested: false
        };
    },

    getRandomEgg(biomeType) {
        // Biome ke hisab se egg dhoondne ka logic
        const possibleEggs = this.eggSpawns.filter(e => e.biome === biomeType);
        return possibleEggs[Math.floor(Math.random() * possibleEggs.length)];
    }
};
