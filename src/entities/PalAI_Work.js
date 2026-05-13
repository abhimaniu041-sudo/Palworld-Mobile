// Game: Palworld Mobile - Pal Work Automation

export const PalWorkSystem = {
    // Work types and required suitability
    workCategories: {
        KINDLING: { skill: "Fire", task: "Cooking/Smelting" },
        WATERING: { skill: "Water", task: "Farming" },
        MINING: { skill: "Rock", task: "Breaking Ores" },
        HANDIWORK: { skill: "Normal", task: "Building/Crafting" }
    },

    // Assigning a Pal to a Base Structure
    assignPalToWork(pal, structure) {
        const suitability = pal.workSuitability; // e.g., ["KINDLING", "HANDIWORK"]
        
        if (structure.requiredWork && suitability.includes(structure.requiredWork)) {
            return {
                status: "WORKING",
                efficiency: pal.level * 1.5,
                message: `${pal.name} is now performing ${structure.requiredWork}`
            };
        }
        return { status: "IDLE", message: "Pal not suited for this task" };
    },

    // Energy drain logic while working
    updatePalSanity(pal) {
        pal.sanity -= 5; // Working reduces sanity
        if (pal.sanity < 20) return "NEED_REST";
        return "STABLE";
    }
};
