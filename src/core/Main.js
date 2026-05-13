// Game: Palworld Mobile - Master Integration (Fix & Visibility Update)
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
        this.engine = new PalMobileEngine();
        this.playerLogic = new CharacterController("Abhimaniu");
        this.inventory = new InventorySystem(500);
        this.world = null;
        this.playerMesh = null;
        this.spawner = null;
        this.builder = null;
        this.baseWorkers = [];
        this.isInitialized = false;
    }

    start() {
        // 1. Setup 3D Scene First
        this.world = new GameRenderer();
        this.terrain = new Terrain(this.world.scene);
        this.waterSystem = new WaterSystem(this.world.scene);
        this.envSpawner = new EnvironmentSpawner(this.world.scene);
        this.playerMesh = new PlayerModel(this.world.scene);
        this.spawner = new MonsterSpawner(this.world.scene);
        this.builder = new BuildingManager(this.world.scene);
        
        // 2. Interface Setup
        Joystick.init();
        this.initCombatInterface();
        this.initCatchingInput();
        this.initSurvivalHUD();
        this.initInventoryInterface();

        // 3. World Population
        this.waterSystem.createLake(30, 30, 20);
        this.populateWorld();

        this.isInitialized = true;
        this.gameLoop();
        
        window.GameInstance = this; 
        console.log("%c [SYSTEM] Engine Ready & Rendering Started", "color: #00ff00; font-weight: bold;");
    }

    // --- BUILDING & AUTOMATION ---
    startBuilding(type) {
        if (InventoryMenu.isOpen) this.toggleMenu();
        this.builder.showPreview(type, this.playerMesh.group.position);
        
        let buildHUD = document.getElementById('build-container') || document.createElement('div');
        buildHUD.id = 'build-container';
        buildHUD.innerHTML = BuildControls.render();
        document.body.appendChild(buildHUD);
    }

    confirmBuild() {
        const structurePos = this.builder.previewMesh.position.clone();
        this.builder.placeStructure();
        this.assignWorkerToBase(structurePos);
        document.getElementById('build-container')?.remove();
    }

    assignWorkerToBase(position) {
        const workerPal = this.spawner.activeMonsters.find(p => p.stats.hp > 0 && !p.isWorking);
        if (workerPal) {
            workerPal.isWorking = true;
            workerPal.basePos = position;
            this.baseWorkers.push(workerPal);
            console.log(`%c [AUTO] Worker Assigned`, "color: #00ffff");
        }
    }

    cancelBuild() {
        this.builder.cancelBuilding();
        document.getElementById('build-container')?.remove();
    }

    // --- UI METHODS ---
    initInventoryInterface() {
        const btn = document.createElement('button');
        btn.innerHTML = "🎒";
        btn.style = "position: absolute; bottom: 150px; right: 25px; width: 65px; height: 65px; border-radius: 50%; background: rgba(0,0,0,0.8); border: 2px solid #ff0000; color: white; font-size: 28px; z-index: 100;";
        btn.onclick = () => this.toggleMenu();
        document.body.appendChild(btn);

        const overlay = document.createElement('div');
        overlay.id = 'inventory-overlay';
        overlay.style = "position: fixed; top:0; left:0; width:100vw; height:100vh; display:none; z-index: 1000;";
        document.body.appendChild(overlay);
    }

    toggleMenu() { InventoryMenu.toggle(this.inventory); }

    // --- MAIN LOOP ---
    gameLoop() {
        if (!this.isInitialized) return;

        // 1. Systems Update
        SurvivalSystem.update();
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);

        // 2. Player Control
        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            this.playerMesh.updatePosition(Joystick.moveData);
            this.world.camera.position.x = this.playerMesh.group.position.x;
            this.world.camera.position.z = this.playerMesh.group.position.z + 12;
            this.world.camera.lookAt(this.playerMesh.group.position);
        }

        // 3. Building Preview
        if (this.builder.isBuildingMode) {
            const offset = new THREE.Vector3(0, 0, -6).applyQuaternion(this.playerMesh.group.quaternion);
            this.builder.updatePreview({
                x: this.playerMesh.group.position.x + offset.x,
                z: this.playerMesh.group.position.z + offset.z
            });
        }

        // 4. Monsters & Workers AI
        this.spawner.activeMonsters.forEach(pal => {
            if (pal.stats?.hp > 0) {
                if (pal.isWorking) PalWorkSystem.updateWorkerAI(pal);
                else PalAI.update(pal);

                // Update Health Bar Position
                const vector = pal.mesh.position.clone().project(this.world.camera);
                HealthBar.update(pal.hpBar, pal.stats.hp, {
                    x: (vector.x * 0.5 + 0.5) * window.innerWidth,
                    y: -(vector.y * 0.5 - 0.5) * window.innerHeight
                });
            }
        });

        // 5. CRITICAL: Render the scene
        this.world.render(this.world.scene, this.world.camera);
        requestAnimationFrame(() => this.gameLoop());
    }

    populateWorld() {
        this.activeResources = []; 
        for(let i=0; i < 15; i++) {
            const pal = this.spawner.spawnRandom((Math.random()-0.5)*100, (Math.random()-0.5)*100, "HILLS");
            if(pal) { pal.stats = { hp: 100 }; pal.hpBar = HealthBar.create(100); }
        }
        for(let i=0; i < 40; i++) {
            const rx = (Math.random()-0.5)*200, rz = (Math.random()-0.5)*200;
            let type = Math.random() > 0.4 ? 'TREE' : 'ROCK';
            let mesh = type === 'TREE' ? this.envSpawner.spawnTree(rx, rz) : this.envSpawner.spawnRock(rx, rz);
            this.activeResources.push({ type, position: {x: rx, z: rz}, mesh });
        }
    }

    initCombatInterface() {
        const container = document.createElement('div');
        container.id = 'combat-ui';
        document.body.appendChild(container);
        container.innerHTML = CombatUI.renderCombatButtons();
    }

    initSurvivalHUD() {
        const hud = document.createElement('div');
        hud.id = 'survival-hud';
        document.body.appendChild(hud);
    }

    initCatchingInput() {
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 2) { 
                const result = CatchingSystem.throwSphere('COMMON', 50);
                console.log("Catch Attempt: " + result);
            }
        });
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
