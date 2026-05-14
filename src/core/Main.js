// Game: Palworld Mobile - Final Robust Integration
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
import { CombatUI } from '../ui/CombatUI.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { HealthBar } from '../ui/HealthBar.js';
import { MonsterEffects } from '../entities/MonsterEffects.js';
import { Terrain } from '../world/Terrain.js';
import { EnvironmentSpawner } from '../world/EnvironmentSpawner.js';
import { WaterSystem } from '../world/WaterSystem.js';
import { HarvestSystem } from '../systems/HarvestSystem.js';
import { PalAI } from '../entities/PalAI_Advanced.js';
import { SurvivalSystem } from '../systems/SurvivalSystem.js';
import { SurvivalUI } from '../ui/SurvivalUI.js';
import { InventoryMenu } from '../ui/InventoryMenu.js';
import { CraftingSystem } from '../systems/CraftingSystem.js';
import { BuildingManager } from '../world/BuildingManager.js';
import { BuildControls } from '../ui/BuildControls.js';
import { PalWorkSystem } from '../entities/PalAI_Work.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class PalworldMobile {
    constructor() {
        this.world = null;
        this.playerMesh = null;
        this.isInitialized = false;
        this.inventory = new InventorySystem(500);
        this.baseWorkers = [];
    }

    async start() {
        console.log("%c [BOOT] Palworld Engine Start...", "color: #ff0000; font-weight: bold;");
        
        try {
            // 1. Initialize Renderer (Critical: This must not fail)
            this.world = new GameRenderer();

            // 2. Load World Assets with Guards (Agar ek fail ho toh doosra chalta rahe)
            const scene = this.world.scene;
            
            try { this.terrain = new Terrain(scene); } catch(e) { console.error("Terrain Load Fail", e); }
            try { this.water = new WaterSystem(scene); } catch(e) { console.error("Water Load Fail", e); }
            try { this.env = new EnvironmentSpawner(scene); } catch(e) { console.error("Env Load Fail", e); }
            try { this.playerMesh = new PlayerModel(scene); } catch(e) { console.error("Player Load Fail", e); }
            try { this.spawner = new MonsterSpawner(scene); } catch(e) { console.error("Spawner Load Fail", e); }
            try { this.builder = new BuildingManager(scene); } catch(e) { console.error("Builder Load Fail", e); }

            // 3. UI Setup
            Joystick.init();
            this.initSurvivalHUD();
            this.initCombatInterface();
            this.initInventoryInterface();

            // 4. Game Population
            if(this.water) this.water.createLake(30, 30, 20);
            this.populateWorld();

            this.isInitialized = true;
            this.gameLoop();
            
            window.GameInstance = this;
            console.log("%c [SYSTEM] Engine Live", "color: #00ff00; font-weight: bold;");

        } catch (err) {
            console.error("CRITICAL BOOT ERROR:", err);
            alert("Engine Error: Check Console");
        }
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // 1. Logic Updates
        SurvivalSystem.update();
        this.updateHUD();

        // 2. Player Movement Logic
        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            if (this.playerMesh && this.playerMesh.group) {
                this.playerMesh.updatePosition(Joystick.moveData);
                this.world.camera.position.x = this.playerMesh.group.position.x;
                this.world.camera.position.z = this.playerMesh.group.position.z + 15;
                this.world.camera.lookAt(this.playerMesh.group.position);
            }
        }

        // 3. Building Preview Update
        if (this.builder && this.builder.isBuildingMode) {
            const offset = new THREE.Vector3(0, 0, -6).applyQuaternion(this.playerMesh.group.quaternion);
            this.builder.updatePreview({
                x: this.playerMesh.group.position.x + offset.x,
                z: this.playerMesh.group.position.z + offset.z
            });
        }

        // 4. Monsters/Workers Update
        if (this.spawner) {
            this.spawner.activeMonsters.forEach(pal => {
                if (pal.stats?.hp > 0) {
                    if (pal.isWorking) PalWorkSystem.updateWorkerAI(pal);
                    else PalAI.update(pal);

                    const vector = pal.mesh.position.clone().project(this.world.camera);
                    HealthBar.update(pal.hpBar, pal.stats.hp, {
                        x: (vector.x * 0.5 + 0.5) * window.innerWidth,
                        y: -(vector.y * 0.5 - 0.5) * window.innerHeight
                    });
                }
            });
        }

        // 5. Final Render Call (The most important part)
        this.world.render(this.world.scene, this.world.camera);
        requestAnimationFrame(() => this.gameLoop());
    }

    updateHUD() {
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);
    }

    populateWorld() {
        if (!this.spawner) return;
        this.activeResources = [];
        for(let i=0; i < 15; i++) {
            const pal = this.spawner.spawnRandom((Math.random()-0.5)*100, (Math.random()-0.5)*100, "HILLS");
            if(pal) { pal.stats = { hp: 100 }; pal.hpBar = HealthBar.create(100); }
        }
    }

    initInventoryInterface() {
        const btn = document.createElement('button');
        btn.innerHTML = "🎒";
        btn.style = "position: absolute; bottom: 150px; right: 25px; width: 65px; height: 65px; border-radius: 50%; background: rgba(0,0,0,0.8); border: 2px solid #ff0000; color: white; font-size: 28px; z-index: 100; pointer-events: auto;";
        btn.onclick = () => InventoryMenu.toggle(this.inventory);
        document.body.appendChild(btn);
    }

    initCombatInterface() {
        const container = document.getElementById('game-ui') || document.body;
        const combatDiv = document.createElement('div');
        combatDiv.innerHTML = CombatUI.renderCombatButtons();
        container.appendChild(combatDiv);
    }

    initSurvivalHUD() {
        const hud = document.createElement('div');
        hud.id = 'survival-hud';
        document.body.appendChild(hud);
    }
}

export const GameInstance = new PalworldMobile();
