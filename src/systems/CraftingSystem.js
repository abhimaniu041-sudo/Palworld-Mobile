// Game: Palworld Mobile - Master Crafting & Recipe Logic
export const CraftingSystem = {
    recipes: [
        { 
            id: "pal_sphere_basic", 
            name: "Copper Sphere", 
            materials: { wood: 5, stone: 3, fragment: 1 },
            type: "ITEM"
        },
        { 
            id: "wooden_foundation", 
            name: "Wooden Foundation", 
            materials: { wood: 20 },
            type: "STRUCTURE"
        },
        { 
            id: "workbench", 
            name: "Pal Workbench", 
            materials: { wood: 15, stone: 10 },
            type: "STRUCTURE"
        }
    ],

    // Check if player has enough materials
    canCraft(recipeId, playerInventory) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return false;

        for (let [material, amount] of Object.entries(recipe.materials)) {
            const currentQty = playerInventory.items[material]?.quantity || 0;
            if (currentQty < amount) return false;
        }
        return true;
    },

    // Execute Crafting: Deduct materials and add item
    craft(recipeId, playerInventory) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        
        if (this.canCraft(recipeId, playerInventory)) {
            // 1. Deduct Materials
            for (let [material, amount] of Object.entries(recipe.materials)) {
                playerInventory.items[material].quantity -= amount;
            }

            // 2. Add Crafted Item/Structure to Inventory
            if (recipe.type === "ITEM") {
                playerInventory.addItem(recipe.id, recipe.name, 0.2, 1);
            }

            console.log(`%c [CRAFT] Successfully created ${recipe.name}`, "color: #00ff00; font-weight: bold;");
            return { success: true, name: recipe.name };
        }
        
        console.log(`%c [CRAFT] Insufficient materials for ${recipe.name}`, "color: #ff0000;");
        return { success: false };
    }
};
