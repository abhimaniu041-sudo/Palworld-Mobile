// Game: Palworld Mobile - Harvesting Logic
import { GameInstance } from '../core/Main.js';

export const HarvestSystem = {
    checkHarvest(playerPosition, environmentObjects) {
        environmentObjects.forEach((obj, index) => {
            const dx = playerPosition.x - obj.position.x;
            const dz = playerPosition.z - obj.position.z;
            const distance = Math.sqrt(dx*dx + dz*dz);

            if (distance < 4) { // Harvesting Range
                this.giveResources(obj.type);
                // Visual Feedback: Shake the object
                obj.mesh.rotation.z += 0.1;
                setTimeout(() => obj.mesh.rotation.z -= 0.1, 100);
            }
        });
    },

    giveResources(type) {
        const item = type === 'TREE' ? 'Wood' : 'Stone';
        console.log(`%c +1 ${item} gathered!`, "color: #e67e22; font-weight: bold;");
        // Integration with Inventory
        GameInstance.inventory.addItem(item.toLowerCase(), item, 0.5, 1);
    }
};
