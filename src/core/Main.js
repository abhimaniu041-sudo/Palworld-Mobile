// Game: Palworld Mobile - Master Integration (Movement Update)
import { PalMobileEngine } from './PalMobileEngine.js';
import { CharacterController } from './CharacterController.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { SaveManager } from './SaveManager.js';
import { DashboardUI } from '../ui/Dashboard.js';
import { GameRenderer } from './Renderer.js';
import { Joystick } from '../ui/Joystick.js';
import { PlayerModel } from '../entities/PlayerModel.js';

class PalworldMobile {
    constructor() {
        this.engine = new PalMobileEngine();
        this.playerLogic = new CharacterController("Abhimaniu");
        this.inventory = new InventorySystem(500);
        this.world = null;
        this.playerMesh = null;
        this.isInitialized = false;
    }

    start() {
        // 1. Initialize 3D World & Character
        this.world = new GameRenderer();
        this.playerMesh = new PlayerModel(this.world.scene);
        
        // 2. Initialize Virtual Joystick
        Joystick.init();

        // 3. Load Save Data
        const savedData = SaveManager.loadGame();
        if (savedData) {
            console.log("%c [SAVE] Data Restored", "color: #00ff00");
        }

        this.isInitialized = true;
        this.gameLoop();
        
        console.log("%c [SYSTEM] 3D World & Controls Ready", "color: #ff0000; font-weight: bold;");
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // --- MOVEMENT LOGIC ---
        // Joystick data ko player mesh ki position mein convert karna
        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            this.playerMesh.updatePosition(Joystick.moveData);
            
            // Camera smoothly follow the player
            this.world.camera.position.x = this.playerMesh.group.position.x;
            this.world.camera.position.z = this.playerMesh.group.position.z + 10;
            this.world.camera.lookAt(this.playerMesh.group.position);
        }

        // --- ENVIRONMENT & UI ---
        this.engine.updateEnvironment();
        const uiContainer = document.getElementById('game-ui');
        if (uiContainer) {
            uiContainer.innerHTML = DashboardUI.renderMainDashboard(this.playerLogic.stats);
        }

        // Render the 3D scene
        this.world.renderer.render(this.world.scene, this.world.camera);

        // High-performance loop for 3D movement
        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
