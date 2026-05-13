// Game: Palworld Mobile - System Tester
import { CatchingSystem } from '../systems/CatchingSystem.js';
import { GameInstance } from './Main.js';

export const DevTools = {
    // 1. Test Catching Mechanic
    testCatch(sphereType) {
        console.log(`%c [SYSTEM] Throwing ${sphereType}...`, 'color: #ff0000; font-weight: bold;');
        const result = CatchingSystem.throwSphere(sphereType, 20); // 20% Monster HP
        console.log(`Result: ${result}`);
    },

    // 2. Add Fake Resources for Building Test
    cheatResources() {
        GameInstance.inventory.addItem('wood', 'Wood', 1, 100);
        GameInstance.inventory.addItem('stone', 'Stone', 2, 50);
        console.table(GameInstance.inventory.items);
    },

    // 3. Check Current Biome
    checkLocation(x, z) {
        const biome = GameInstance.engine.updateEnvironment();
        console.log(`Current State: ${biome} at X:${x} Z:${z}`);
    }
};

// Auto-run test in console
window.DevTools = DevTools;
