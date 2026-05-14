// Game: Palworld Mobile - Master Integration (Ultimate Visibility Fix)
import { GameRenderer } from './Renderer.js';
import { Joystick } from '../ui/Joystick.js';

// --- Try-Catch Modules (Inme se koi missing ho toh game crash nahi hoga) ---
let Terrain, WaterSystem, EnvironmentSpawner, PlayerModel, MonsterSpawner, BuildingManager;
let SurvivalSystem, SurvivalUI, CombatUI, InventoryMenu, HealthBar, PalAI, PalWorkSystem;

async function loadModules() {
    try { Terrain = (await import('../world/Terrain.js')).Terrain; } catch(e) {}
    try { WaterSystem = (await import('../world/WaterSystem.js')).WaterSystem; } catch(e) {}
    try { EnvironmentSpawner = (await import('../world/EnvironmentSpawner.js')).EnvironmentSpawner; } catch(e) {}
    try { PlayerModel = (await import('../entities/PlayerModel.js')).PlayerModel; } catch(e) {}
    try { MonsterSpawner = (await import('../entities/MonsterSpawner.js')).MonsterSpawner; } catch(e) {}
    try { BuildingManager = (await import('../world/BuildingManager.js')).BuildingManager; } catch(e) {}
    try { SurvivalSystem = (await import('../systems/SurvivalSystem.js')).SurvivalSystem; } catch(e) {}
    try { SurvivalUI = (await import('../ui/SurvivalUI.js')).SurvivalUI; } catch(e) {}
    try { CombatUI = (await import('../ui/CombatUI.js')).CombatUI; } catch(e) {}
    try { InventoryMenu = (await import('../ui/InventoryMenu.js')).InventoryMenu; } catch(e) {}
    try { HealthBar = (await import('../ui/HealthBar.js')).HealthBar; } catch(e) {}
    try { PalAI = (await import('../entities/PalAI_Advanced.js')).PalAI; } catch(e) {}
    try { PalWorkSystem = (await import('../entities/PalAI_Work.js')).PalWorkSystem; } catch(e) {}
}

class PalworldMobile {
    constructor() {
        this.world = null;
        this.playerMesh = null;
        this.isInitialized = false;
    }

    async start() {
        console.log("%c [BOOT] Engine Starting...", "color: #ff0000; font-weight: bold;");
        
        try {
            // 1. Core Rendering Setup (Must Work)
            this.world = new GameRenderer();
            
            // 2. Load other modules asynchronously
            await loadModules();

            // 3. Initialize World Objects if modules loaded
            const scene = this.world.scene;
            if (Terrain) this.terrain = new Terrain(scene);
            if (WaterSystem) {
                this.water = new WaterSystem(scene);
                this.water.createLake(30, 30, 20);
            }
            if (EnvironmentSpawner) this.env = new EnvironmentSpawner(scene);
            if (PlayerModel) this.playerMesh = new PlayerModel(scene);
            if (MonsterSpawner) this.spawner = new MonsterSpawner(scene);
            if (BuildingManager) this.builder = new BuildingManager(scene);

            // 4. UI Setup
            Joystick.init();
            this.initHUD();

            this.isInitialized = true;
            this.gameLoop();
            
            window.GameInstance = this;
            console.log("%c [SYSTEM] Engine Online - Visuals Forced", "color: #00ff00; font-weight: bold;");

        } catch (err) {
            console.error("Critical Start Error:", err);
            // Engine failsafe: even on error, try to start loop if renderer exists
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
        
        // Combat UI check
        if (CombatUI) {
            const container = document.getElementById('game-ui') || document.body;
            const combatDiv = document.createElement('div');
            combatDiv.innerHTML = CombatUI.renderCombatButtons();
            container.appendChild(combatDiv);
        }
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // 1. Logic Updates (Survival)
        if (SurvivalSystem && SurvivalUI) {
            SurvivalSystem.update();
            const hud = document.getElementById('survival-hud');
            if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);
        }

        // 2. Player Movement
        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            if (this.playerMesh && this.playerMesh.group) {
                this.playerMesh.updatePosition(Joystick.moveData);
                this.world.camera.position.x = this.playerMesh.group.position.x;
                this.world.camera.position.z = this.playerMesh.group.position.z + 15;
                this.world.camera.lookAt(this.playerMesh.group.position);
            }
        }

        // 3. AI & Render Call
        if (this.world) {
            this.world.render(this.world.scene, this.world.camera);
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
