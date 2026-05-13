// Game: Palworld Mobile - Building System

export const BuildingSystem = {
    structures: {
        FOUNDATION: { health: 500, cost: { wood: 20 } },
        WALL: { health: 300, cost: { wood: 10, stone: 5 } },
        STORAGE_CHEST: { slots: 15, cost: { wood: 15 } },
        PAL_BED: { comfort: 10, cost: { wool: 5, wood: 10 } }
    },

    activeBuildings: [],

    placeStructure(type, position, rotation) {
        const blueprint = this.structures[type];
        
        const newBuilding = {
            instanceId: `build_${Date.now()}`,
            type: type,
            pos: position,
            rot: rotation,
            currentHP: blueprint.health
        };

        this.activeBuildings.push(newBuilding);
        return `Placed ${type} at ${position.x}, ${position.z}`;
    },

    repairStructure(instanceId) {
        const target = this.activeBuildings.find(b => b.instanceId === instanceId);
        if (target) target.currentHP = this.structures[target.type].health;
    }
};
