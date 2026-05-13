// Game: Palworld Mobile - Catching System

export const CatchingSystem = {
    spheres: {
        COMMON: { name: "Pal Sphere", power: 1.0, color: "#3498db" },
        MEGA: { name: "Mega Sphere", power: 1.5, color: "#2ecc71" },
        GIGA: { name: "Giga Sphere", power: 2.0, color: "#f1c40f" },
        HYPER: { name: "Hyper Sphere", power: 3.5, color: "#9b59b6" }
    },

    // Catch rate logic based on HP and Sphere Power
    calculateCaptureChance(monsterMaxHP, monsterCurrentHP, sphereType) {
        const sphere = this.spheres[sphereType];
        const hpFactor = (monsterMaxHP - monsterCurrentHP) / monsterMaxHP;
        
        // Formula: Base 20% + HP loss bonus + Sphere bonus
        let chance = (0.2 + (hpFactor * 0.5)) * sphere.power;
        
        return Math.min(0.99, chance); // Max 99% chance
    },

    throwSphere(sphereType, monsterHPState) {
        const chance = this.calculateCaptureChance(100, monsterHPState, sphereType);
        const roll = Math.random();
        
        return roll < chance ? "SUCCESS" : "FAILED_PAL_ESCAPED";
    }
};
