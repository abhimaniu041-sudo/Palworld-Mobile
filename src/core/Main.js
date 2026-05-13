// Game: Palworld Mobile - Main Integration Engine
import { PalMobileEngine } from './PalMobileEngine.js';
import { CharacterController } from './CharacterController.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { SaveManager } from './SaveManager.js';
import { DashboardUI } from '../ui/Dashboard.js';

class PalworldMobile {
    constructor() {
        this.engine = new PalMobileEngine();
        this.player = new CharacterController("Abhimaniu");
        this.inventory = new InventorySystem(500); // 500kg Limit
        this.isInitialized = false;
    }

    start() {
        // Load existing save or start new
        const savedData = SaveManager.loadGame();
        if (savedData) {
            console.log("Welcome back to Palworld!");
            // Data loading logic here
        }

        this.isInitialized = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // 1. Update Environment (Day/Night)
        this.engine.updateEnvironment();

        // 2. Refresh UI (Premium Dashboard)
        const uiContainer = document.getElementById('game-ui');
        if (uiContainer) {
            uiContainer.innerHTML = DashboardUI.renderMainDashboard(this.player.stats);
        }

        // 3. Keep loop running at 30 FPS for mobile stability
        setTimeout(() => this.gameLoop(), 1000 / 30);
    }
}

export const GameInstance = new PalworldMobile();
