// Game: Palworld Mobile - Final Optimized Integration
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
        console.log("Palworld Booting...");
        try {
            // 1. Core Scene Setup
            this.world = new GameRenderer();
            this.terrain = new Terrain(this.world.scene);
            this.water = new WaterSystem(this.world.scene);
            this.env = new EnvironmentSpawner(this.world.scene);
            this.playerMesh = new PlayerModel(this.world.scene);
            this.spawner = new MonsterSpawner(this.world.scene);
            this.builder = new BuildingManager(this.world.scene);

            // 2. Control & HUD Setup
            Joystick.init();
            this.initSurvivalHUD();
            this.initCombatInterface();
            this.initInventoryInterface();

            // 3. World Population
            this.water.createLake(30, 30, 20);
            this.populateWorld();

            this.isInitialized = true;
            this.gameLoop();
            
            window.GameInstance = this;
            console.log("%c [SYSTEM] Online", "color: #00ff00; font-weight: bold;");
        } catch (err) {
            console.error("Initialization Failed:", err);
        }
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // --- Logic Updates ---
        SurvivalSystem.update();
        this.updateHUD();

        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            if (this.playerMesh) {
                this.playerMesh.updatePosition(Joystick.moveData);
                this.world.camera.position.x = this.playerMesh.group.position.x;
                this.world.camera.position.z = this.playerMesh.group.position.z + 15;
                this.world.camera.lookAt(this.playerMesh.group.position);
            }
        }

        // --- Monster & AI Updates ---
        this.spawner.activeMonsters.forEach(pal => {
            if (pal.stats?.hp > 0) {
                if (pal.isWorking) PalWorkSystem.updateWorkerAI(pal);
                else PalAI.update(pal);

                // Update UI Bars
                const vector = pal.mesh.position.clone().project(this.world.camera);
                HealthBar.update(pal.hpBar, pal.stats.hp, {
                    x: (vector.x * 0.5 + 0.5) * window.innerWidth,
                    y: -(vector.y * 0.5 - 0.5) * window.innerHeight
                });
            }
        });

        // --- Render Frame ---
        this.world.render(this.world.scene, this.world.camera);
        requestAnimationFrame(() => this.gameLoop());
    }

    updateHUD() {
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);
    }

    populateWorld() {
        this.activeResources = [];
        for(let i=0; i < 15; i++) {
            const pal = this.spawner.spawnRandom((Math.random()-0.5)*100, (Math.random()-0.5)*100, "HILLS");
            if(pal) { pal.stats = { hp: 100 }; pal.hpBar = HealthBar.create(100); }
        }
        for(let i=0; i < 40; i++) {
            const rx = (Math.random()-0.5)*200, rz = (Math.random()-0.5)*250;
            let type = Math.random() > 0.4 ? 'TREE' : 'ROCK';
            let mesh = type === 'TREE' ? this.env.spawnTree(rx, rz) : this.env.spawnRock(rx, rz);
            this.activeResources.push({ type, position: {x: rx, z: rz}, mesh });
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
