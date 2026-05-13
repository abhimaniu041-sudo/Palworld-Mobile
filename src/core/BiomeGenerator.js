// Game: Palworld Mobile - Biome Generation

export const BiomeGenerator = {
    regions: {
        HILLS: { height: 50, foliage: "Dense Grass", monsters: ["Grass", "Normal"] },
        DESERT: { height: 5, foliage: "Cactus", monsters: ["Fire", "Ground"], hazard: "Heat" },
        SNOW: { height: 120, foliage: "Pine Trees", monsters: ["Ice"], hazard: "Cold" },
        WATERFRONT: { height: 0, foliage: "Reeds", monsters: ["Water"] }
    },

    // Logic to place a Waterfall or River
    generateWaterFeature(mapX, mapZ) {
        if (mapX > 1500 && mapX < 1800) {
            return { type: "RIVER", flow: "North-South", depth: 5 };
        }
        if (mapX === 2000 && mapZ === 2000) {
            return { type: "WATERFALL", height: 40, effect: "Mist" };
        }
        return null;
    },

    getBiomeAt(x, z) {
        // Simple logic to divide 4000x4000 map into quadrants
        if (x < 2000 && z < 2000) return this.regions.HILLS;
        if (x >= 2000 && z < 2000) return this.regions.DESERT;
        if (x < 2000 && z >= 2000) return this.regions.SNOW;
        return this.regions.WATERFRONT;
    }
};
