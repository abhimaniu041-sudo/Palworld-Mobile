// Game: Palworld Mobile - Main Integration Engine (Updated)
import { PalMobileEngine } from './PalMobileEngine.js';
import { CharacterController } from './CharacterController.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { SaveManager } from './SaveManager.js';
import { DashboardUI } from '../ui/Dashboard.js';
import { GameRenderer } from './Renderer.js';
import { TouchControls } from '../systems/TouchControls.js';

class PalworldMobile {
    constructor() {
        this.engine = new PalMobileEngine();
        this.player = new CharacterController("Abhimaniu");
        this.inventory = new InventorySystem(500); 
        this.renderer = null; // Will be initialized on start
        this.isInitialized = false;
    }

    start() {
        // 1. Initialize 3D World
        this.renderer = new GameRenderer();
        this.renderer.animate();

        // 2. Initialize Mobile Controls
        TouchControls.init();

        // 3. Load Save Data
        const savedData = SaveManager.loadGame();
        if (savedData) {
            console.log("%c [SAVE] Welcome back to Palworld Mobile!", "color: #00ff00");
        }

        this.isInitialized = true;
        this.gameLoop();
        
        console.log("%c [SYSTEM] Engine Started Successfully", "color: #ff0000; font-weight: bold;");
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // Update Environment (Time/Weather)
        this.engine.updateEnvironment();

        // Refresh UI Overlay
        const uiContainer = document.getElementById('game-ui');
        if (uiContainer) {
            uiContainer.innerHTML = DashboardUI.renderMainDashboard(this.player.stats);
        }

        // Logic loop at 30 FPS for mobile thermal stability
        setTimeout(() => this.gameLoop(), 1000 / 30);
    }
}

export const GameInstance = new PalworldMobile();
