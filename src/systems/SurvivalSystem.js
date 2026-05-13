// Game: Palworld Mobile - Hunger & Stamina System
export const SurvivalSystem = {
    stats: {
        hunger: 100,
        stamina: 100,
        isSprinting: false
    },

    update(delta) {
        // Hunger slowly depletes
        this.stats.hunger -= 0.01;

        // Stamina logic
        if (this.stats.isSprinting && this.stats.stamina > 0) {
            this.stats.stamina -= 0.5;
        } else if (this.stats.stamina < 100) {
            this.stats.stamina += 0.2;
        }

        // Health drain if starving
        if (this.stats.hunger <= 0) {
            this.stats.hunger = 0;
            // logic to reduce player HP...
        }
    }
};
