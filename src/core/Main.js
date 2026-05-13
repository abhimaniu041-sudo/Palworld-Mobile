// Game: Palworld Mobile - Master Integration (Spawning & Catching Update)
import { PalMobileEngine } from './PalMobileEngine.js';
import { CharacterController } from './CharacterController.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { SaveManager } from './SaveManager.js';
import { DashboardUI } from '../ui/Dashboard.js';
import { GameRenderer } from './Renderer.js';
import { Joystick } from '../ui/Joystick.js';
import { PlayerModel } from '../entities/PlayerModel.js';
import { MonsterSpawner } from '../entities/MonsterSpawner.js';
import { CatchingSystem } from '../systems/CatchingSystem.js';

class PalworldMobile {
    constructor() {
        this.engine = new PalMobileEngine();
        this.playerLogic = new CharacterController("Abhimaniu");
        this.inventory = new InventorySystem(500);
        this.world = null;
        this.playerMesh = null;
        this.spawner = null;
        this.isInitialized = false;
    }

    start() {
        // 1. Setup 3D Environment
        this.world = new GameRenderer();
        this.playerMesh = new PlayerModel(this.world.scene);
        this.spawner = new MonsterSpawner(this.world.scene);
        
        // 2. Setup Controls
        Joystick.init();
        this.initCatchingInput();

        // 3. Initial Spawn (4km Map testing)
        for(let i=0; i < 15; i++) {
            const rx = (Math.random() - 0.5) * 50;
            const rz = (Math.random() - 0.5) * 50;
            this.spawner.spawnRandom(rx, rz, "HILLS");
        }

        this.isInitialized = true;
        this.gameLoop();
        console.log("%c [SYSTEM] World Populated with Pals", "color: #ff0000; font-weight: bold;");
    }

    initCatchingInput() {
        // Double tap on screen to throw Pal Sphere
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) { 
                const result = CatchingSystem.throwSphere('COMMON', 50); // Testing with 50% HP
                alert("Sphere Thrown! Result: " + result);
            }
        });
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // Player Movement & Camera Follow
        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            this.playerMesh.updatePosition(Joystick.moveData);
            this.world.camera.position.x = this.playerMesh.group.position.x;
            this.world.camera.position.z = this.playerMesh.group.position.z + 10;
            this.world.camera.lookAt(this.playerMesh.group.position);
        }

        // UI Update
        this.engine.updateEnvironment();
        const uiContainer = document.getElementById('game-ui');
        if (uiContainer) {
            uiContainer.innerHTML = DashboardUI.renderMainDashboard(this.playerLogic.stats);
        }

        // Render Frame
        this.world.renderer.render(this.world.scene, this.world.camera);
        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
