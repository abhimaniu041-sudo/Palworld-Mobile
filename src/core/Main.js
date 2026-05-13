// Game: Palworld Mobile - Master Integration (Inventory & Crafting Update)
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

class PalworldMobile {
    constructor() {
        this.engine = new PalMobileEngine();
        this.playerLogic = new CharacterController("Abhimaniu");
        this.inventory = new InventorySystem(500);
        this.world = null;
        this.playerMesh = null;
        this.spawner = null;
        this.terrain = null;
        this.envSpawner = null;
        this.waterSystem = null;
        this.isInitialized = false;
    }

    start() {
        // 1. Setup 3D Environment & World
        this.world = new GameRenderer();
        this.terrain = new Terrain(this.world.scene);
        this.waterSystem = new WaterSystem(this.world.scene);
        this.envSpawner = new EnvironmentSpawner(this.world.scene);
        this.playerMesh = new PlayerModel(this.world.scene);
        this.spawner = new MonsterSpawner(this.world.scene);
        
        // 2. Setup Controls, UI & Menus
        Joystick.init();
        this.initCombatInterface();
        this.initCatchingInput();
        this.initSurvivalHUD();
        this.initInventoryInterface();

        // 3. Populate World
        this.waterSystem.createLake(30, 30, 20);
        this.waterSystem.createLake(-40, -50, 15);
        this.populateWorld();

        this.isInitialized = true;
        this.gameLoop();
        
        window.GameInstance = this; // Global access for UI buttons
        console.log("%c [SYSTEM] Inventory & Crafting Engine Online", "color: #ff0000; font-weight: bold;");
    }

    initInventoryInterface() {
        // Create Menu Button (Backpack)
        const btn = document.createElement('button');
        btn.innerHTML = "🎒";
        btn.style = "position: absolute; bottom: 150px; right: 25px; width: 65px; height: 65px; border-radius: 50%; background: rgba(0,0,0,0.7); border: 2px solid #ff0000; color: white; font-size: 28px; z-index: 100; box-shadow: 0 0 15px rgba(255,0,0,0.5);";
        btn.onclick = () => this.toggleMenu();
        document.body.appendChild(btn);

        // Create Menu Overlay
        const overlay = document.createElement('div');
        overlay.id = 'inventory-overlay';
        overlay.style = "position: fixed; top:0; left:0; width:100vw; height:100vh; display:none; z-index: 1000;";
        document.body.appendChild(overlay);
    }

    toggleMenu() {
        InventoryMenu.toggle(this.inventory);
    }

    handleCraft(recipeId) {
        const result = CraftingSystem.craft(recipeId, this.inventory);
        if(result.success) {
            this.toggleMenu(); // Refresh UI by toggling
            this.toggleMenu();
        }
    }

    populateWorld() {
        this.activeResources = []; 
        for(let i=0; i < 20; i++) {
            const rx = (Math.random() - 0.5) * 160;
            const rz = (Math.random() - 0.5) * 160;
            const pal = this.spawner.spawnRandom(rx, rz, "HILLS");
            if(pal) {
                pal.stats = { hp: 100 };
                pal.hpBar = HealthBar.create(100);
            }
        }
        for(let i=0; i < 60; i++) {
            const rx = (Math.random() - 0.5) * 250;
            const rz = (Math.random() - 0.5) * 250;
            let type = Math.random() > 0.4 ? 'TREE' : 'ROCK';
            let mesh = type === 'TREE' ? this.envSpawner.spawnTree(rx, rz) : this.envSpawner.spawnRock(rx, rz);
            this.activeResources.push({ type, position: {x: rx, z: rz}, mesh });
        }
    }

    initCombatInterface() {
        const combatContainer = document.createElement('div');
        combatContainer.id = 'combat-ui';
        document.body.appendChild(combatContainer);
        combatContainer.innerHTML = CombatUI.renderCombatButtons();
        document.getElementById('atk-btn')?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handlePlayerAction();
        });
    }

    initSurvivalHUD() {
        const hudContainer = document.createElement('div');
        hudContainer.id = 'survival-hud';
        document.body.appendChild(hudContainer);
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

        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            this.playerMesh.updatePosition(Joystick.moveData);
            this.world.camera.position.x = this.playerMesh.group.position.x;
            this.world.camera.position.z = this.playerMesh.group.position.z + 12;
            this.world.camera.lookAt(this.playerMesh.group.position);
        }

        this.spawner.activeMonsters.forEach(pal => {
            if (pal.stats?.hp > 0) {
                PalAI.update(pal);
                const vector = pal.mesh.position.clone();
                vector.project(this.world.camera);
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
                HealthBar.update(pal.hpBar, pal.stats.hp, { x, y });
            }
        });

        this.world.renderer.render(this.world.scene, this.world.camera);
        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
