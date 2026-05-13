// Game: Palworld Mobile - Master Integration (The Architect Update)
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
        this.isInitialized = false;
    }

    start() {
        // 1. Setup 3D World & Systems
        this.world = new GameRenderer();
        this.terrain = new Terrain(this.world.scene);
        this.waterSystem = new WaterSystem(this.world.scene);
        this.envSpawner = new EnvironmentSpawner(this.world.scene);
        this.playerMesh = new PlayerModel(this.world.scene);
        this.spawner = new MonsterSpawner(this.world.scene);
        this.builder = new BuildingManager(this.world.scene);
        
        // 2. Setup All Interfaces
        Joystick.init();
        this.initCombatInterface();
        this.initCatchingInput();
        this.initSurvivalHUD();
        this.initInventoryInterface();

        // 3. World Generation
        this.waterSystem.createLake(30, 30, 20);
        this.populateWorld();

        this.isInitialized = true;
        this.gameLoop();
        
        window.GameInstance = this; 
        console.log("%c [SYSTEM] Building Engine & 4KM World Live", "color: #ff0000; font-weight: bold;");
    }

    // --- BUILDING METHODS ---
    startBuilding(type) {
        if (InventoryMenu.isOpen) this.toggleMenu();
        this.builder.showPreview(type, this.playerMesh.group.position);
        
        const buildHUD = document.getElementById('build-container') || document.createElement('div');
        buildHUD.id = 'build-container';
        buildHUD.innerHTML = BuildControls.render();
        document.body.appendChild(buildHUD);
    }

    confirmBuild() {
        this.builder.placeStructure();
        document.getElementById('build-container')?.remove();
    }

    cancelBuild() {
        this.builder.cancelBuilding();
        document.getElementById('build-container')?.remove();
    }

    // --- UI & INVENTORY METHODS ---
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

    handleCraft(recipeId) {
        const result = CraftingSystem.craft(recipeId, this.inventory);
        if(result.success) { this.toggleMenu(); this.toggleMenu(); }
    }

    // --- LOGIC & LOOPS ---
    populateWorld() {
        this.activeResources = []; 
        for(let i=0; i < 20; i++) {
            const pal = this.spawner.spawnRandom((Math.random()-0.5)*150, (Math.random()-0.5)*150, "HILLS");
            if(pal) { pal.stats = { hp: 100 }; pal.hpBar = HealthBar.create(100); }
        }
        for(let i=0; i < 60; i++) {
            const rx = (Math.random()-0.5)*250, rz = (Math.random()-0.5)*250;
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
        document.getElementById('atk-btn')?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handlePlayerAction();
        });
    }

    initSurvivalHUD() {
        const hud = document.createElement('div');
        hud.id = 'survival-hud';
        document.body.appendChild(hud);
    }

    handlePlayerAction() {
        this.spawner.activeMonsters.forEach((pal) => {
            const inRange = CombatSystem.isTargetInRange(this.playerMesh.group.position, pal.mesh.position, 6);
            if (inRange && pal.stats?.hp > 0) {
                const status = CombatSystem.applyDamage(pal, 25);
                MonsterEffects.playHitEffect(pal.mesh);
                if (status === "KILLED") MonsterEffects.playDeathEffect(this.world.scene, pal.mesh);
            }
        });
        HarvestSystem.checkHarvest(this.playerMesh.group.position, this.activeResources);
    }

    initCatchingInput() {
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 2) { 
                const result = CatchingSystem.throwSphere('COMMON', 50);
                console.log("Catch: " + result);
            }
        });
    }

    gameLoop() {
        if (!this.isInitialized) return;

        SurvivalSystem.update();
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);

        // Player Move & Cam
        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            this.playerMesh.updatePosition(Joystick.moveData);
            this.world.camera.position.x = this.playerMesh.group.position.x;
            this.world.camera.position.z = this.playerMesh.group.position.z + 12;
            this.world.camera.lookAt(this.playerMesh.group.position);
        }

        // --- Building Mode Preview Update ---
        if (this.builder.isBuildingMode) {
            const offset = new THREE.Vector3(0, 0, -6).applyQuaternion(this.playerMesh.group.quaternion);
            this.builder.updatePreview({
                x: this.playerMesh.group.position.x + offset.x,
                z: this.playerMesh.group.position.z + offset.z
            });
        }

        // Monsters AI & HP
        this.spawner.activeMonsters.forEach(pal => {
            if (pal.stats?.hp > 0) {
                PalAI.update(pal);
                const vector = pal.mesh.position.clone().project(this.world.camera);
                HealthBar.update(pal.hpBar, pal.stats.hp, {
                    x: (vector.x * 0.5 + 0.5) * window.innerWidth,
                    y: -(vector.y * 0.5 - 0.5) * window.innerHeight
                });
            }
        });

        this.world.renderer.render(this.world.scene, this.world.camera);
        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
