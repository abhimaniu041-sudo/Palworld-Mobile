// Game: Palworld Mobile - Advanced Pal Work & AI System
export const PalWorkSystem = {
    // Work types and required suitability
    workCategories: {
        KINDLING: { skill: "Fire", task: "Cooking/Smelting" },
        WATERING: { skill: "Water", task: "Farming" },
        MINING: { skill: "Rock", task: "Breaking Ores" },
        HANDIWORK: { skill: "Normal", task: "Building/Crafting" }
    },

    // 1. Logic to update Pal movement at Base
    updateWorkerAI(pal, delta) {
        if (!pal.basePos || pal.sanity < 10) return;

        // Base ke charo taraf circular motion (Visual Work)
        const time = Date.now() * 0.001;
        const radius = 4;
        
        pal.mesh.position.x = pal.basePos.x + Math.cos(time) * radius;
        pal.mesh.position.z = pal.basePos.z + Math.sin(time) * radius;
        
        // Structure ki taraf dekhna
        pal.mesh.lookAt(pal.basePos.x, 1, pal.basePos.z);

        // Sanity drain while working
        this.updatePalSanity(pal);
    },

    // 2. Assigning a Pal to a Base Structure
    assignPalToWork(pal, structure) {
        const suitability = pal.workSuitability || []; // e.g., ["KINDLING", "HANDIWORK"]

        if (structure.requiredWork && suitability.includes(structure.requiredWork)) {
            pal.basePos = structure.position;
            return {
                status: "WORKING",
                efficiency: (pal.level || 1) * 1.5,
                message: `${pal.name} is now performing ${structure.requiredWork}`
            };
        }
        return { status: "IDLE", message: "Pal not suited for this task" };
    },

    // 3. Energy drain logic
    updatePalSanity(pal) {
        if (!pal.sanity) pal.sanity = 100;
        
        // Har frame thoda sanity kam karna
        pal.sanity -= 0.02; 
        
        if (pal.sanity < 20) {
            console.log(`${pal.name} is exhausted and needs rest!`);
            return "NEED_REST";
        }
        return "STABLE";
    }
};
