// Game: Palworld Mobile - Master Integration (World & Environment Update)
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
        this.isInitialized = false;
    }

    start() {
        // 1. Setup 3D Environment & World
        this.world = new GameRenderer();
        this.terrain = new Terrain(this.world.scene);
        this.envSpawner = new EnvironmentSpawner(this.world.scene);
        this.playerMesh = new PlayerModel(this.world.scene);
        this.spawner = new MonsterSpawner(this.world.scene);
        
        // 2. Setup Controls & Combat UI
        Joystick.init();
        this.initCombatInterface();
        this.initCatchingInput();

        // 3. Initial World Population (Pals & Nature)
        this.populateWorld();

        this.isInitialized = true;
        this.gameLoop();
        console.log("%c [SYSTEM] 4KM World Generated with Biomes", "color: #ff0000; font-weight: bold;");
    }

    populateWorld() {
        // Spawn Monsters
        for(let i=0; i < 20; i++) {
            const rx = (Math.random() - 0.5) * 150;
            const rz = (Math.random() - 0.5) * 150;
            const pal = this.spawner.spawnRandom(rx, rz, "HILLS");
            if(pal) {
                pal.stats = { hp: 100 };
                pal.hpBar = HealthBar.create(100);
            }
        }

        // Spawn Trees & Rocks
        for(let i=0; i < 50; i++) {
            const rx = (Math.random() - 0.5) * 200;
            const rz = (Math.random() - 0.5) * 200;
            if(Math.random() > 0.4) this.envSpawner.spawnTree(rx, rz);
            else this.envSpawner.spawnRock(rx, rz);
        }
    }

    initCombatInterface() {
        const combatContainer = document.createElement('div');
        combatContainer.id = 'combat-ui';
        document.body.appendChild(combatContainer);
        combatContainer.innerHTML = CombatUI.renderCombatButtons();

        document.getElementById('atk-btn')?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handlePlayerAttack();
        });
    }

    handlePlayerAttack() {
        this.spawner.activeMonsters.forEach((pal) => {
            const inRange = CombatSystem.isTargetInRange(this.playerMesh.group.position, pal.mesh.position, 6);
            if (inRange && pal.stats?.hp > 0) {
                const status = CombatSystem.applyDamage(pal, 25);
                MonsterEffects.playHitEffect(pal.mesh);
                if (status === "KILLED") MonsterEffects.playDeathEffect(this.world.scene, pal.mesh);
            }
        });
    }

    initCatchingInput() {
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 2) { 
                const result = CatchingSystem.throwSphere('COMMON', 50);
                console.log("Catching Attempt: " + result);
            }
        });
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // Movement & Follow Cam
        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            this.playerMesh.updatePosition(Joystick.moveData);
            this.world.camera.position.x = this.playerMesh.group.position.x;
            this.world.camera.position.z = this.playerMesh.group.position.z + 12;
            this.world.camera.lookAt(this.playerMesh.group.position);
        }

        // Update Floating Health Bars
        this.spawner.activeMonsters.forEach(pal => {
            if (pal.stats?.hp > 0) {
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
