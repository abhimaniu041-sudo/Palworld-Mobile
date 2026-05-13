export const EggSystem = {
    eggTypes: {
        SCORCHING: { temp: 40, time: 300, rarity: "Common" },
        FROZEN: { temp: -5, time: 600, rarity: "Rare" },
        ROCKY: { temp: 20, time: 150, rarity: "Common" }
    },

    processHatching(eggType, currentTemp, incubatorActive) {
        const target = this.eggTypes[eggType];
        if (!incubatorActive) return "Incubator Required";
        
        if (currentTemp >= target.temp - 5 && currentTemp <= target.temp + 5) {
            return "Hatching Speed: 100% (Optimal)";
        } else {
            return "Hatching Speed: 50% (Temperature Mismatch)";
        }
    }
};
