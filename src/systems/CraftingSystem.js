export const CraftingSystem = {
    recipes: [
        { id: "pal_sphere_basic", name: "Copper Sphere", materials: { wood: 5, stone: 3, fragment: 1 } },
        { id: "incubator", name: "Pal Incubator", materials: { metal: 10, crystal: 5, flame_organ: 2 } },
        { id: "wooden_structure", name: "Foundation", materials: { wood: 20 } }
    ],

    inventory: {
        storage: [],
        maxSlots: 20
    },

    addItem(item, qty) {
        const existing = this.inventory.storage.find(i => i.id === item.id);
        if (existing) {
            existing.qty += qty;
        } else {
            this.inventory.storage.push({ ...item, qty });
        }
    }
};
