// Game: Palworld Mobile - Final Movement & Entity Integration
import { GameRenderer } from './Renderer.js';
import { Joystick } from '../ui/Joystick.js';

// --- Direct Imports (Safe version for Vercel/GitHub) ---
import { PlayerModel } from '../entities/PlayerModel.js';
import { MonsterSpawner } from '../entities/MonsterSpawner.js';
import { Terrain } from '../world/Terrain.js';
import { WaterSystem } from '../world/WaterSystem.js';
import { EnvironmentSpawner } from '../world/EnvironmentSpawner.js';
import { SurvivalSystem } from '../systems/SurvivalSystem.js';
import { SurvivalUI } from '../ui/SurvivalUI.js';
import { CombatUI } from '../ui/CombatUI.js';

class PalworldMobile {
    constructor() {
        this.world = null;
        this.playerMesh = null;
        this.spawner = null;
        this.isInitialized = false;
    }

    async start() {
        console.log("%c [BOOT] Starting Game Engine...", "color: #ff0000; font-weight: bold;");
        
        try {
            // 1. Initialize Renderer (Sky/Floor)
            this.world = new GameRenderer();
            const scene = this.world.scene;

            // 2. Load World & Entities (Directly)
            this.terrain = new Terrain(scene);
            this.water = new WaterSystem(scene);
            this.env = new EnvironmentSpawner(scene);
            this.playerMesh = new PlayerModel(scene);
            this.spawner = new MonsterSpawner(scene);

            // 3. UI Setup
            Joystick.init();
            this.initHUD();

            // 4. World Population
            this.water.createLake(30, 30, 20);
            this.populateWorld();

            this.isInitialized = true;
            this.gameLoop();
            
            window.GameInstance = this;
            console.log("%c [SYSTEM] Engine Online - Entities Loaded", "color: #00ff00; font-weight: bold;");

        } catch (err) {
            console.error("Critical Start Error:", err);
            // Engine failsafe
            if(this.world) {
                this.isInitialized = true;
                this.gameLoop();
            }
        }
    }

    initHUD() {
        const hud = document.getElementById('survival-hud') || document.createElement('div');
        hud.id = 'survival-hud';
        document.body.appendChild(hud);
        
        const container = document.getElementById('game-ui') || document.body;
        const combatDiv = document.createElement('div');
        combatDiv.innerHTML = CombatUI.renderCombatButtons();
        container.appendChild(combatDiv);
    }

    populateWorld() {
        if (!this.spawner) return;
        // Spawn 10 Pals initially
        for(let i=0; i < 10; i++) {
            const rx = (Math.random() - 0.5) * 80;
            const rz = (Math.random() - 0.5) * 80;
            this.spawner.spawnRandom(rx, rz, "HILLS");
        }
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // 1. Logic Updates
        SurvivalSystem.update();
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);

        // 2. Player Movement & Camera Follow
        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            if (this.playerMesh && this.playerMesh.group) {
                // Move Player
                this.playerMesh.updatePosition(Joystick.moveData);

                // Update Camera to follow player
                const pPos = this.playerMesh.group.position;
                this.world.camera.position.x = pPos.x;
                this.world.camera.position.z = pPos.z + 15;
                this.world.camera.position.y = pPos.y + 10;
                this.world.camera.lookAt(pPos);
            }
        }

        // 3. Render Call
        this.world.render(this.world.scene, this.world.camera);

        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
