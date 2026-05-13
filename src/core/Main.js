// Game: Palworld Mobile - Master Integration (Visuals & Health Update)
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
        this.world = new GameRenderer();
        this.playerMesh = new PlayerModel(this.world.scene);
        this.spawner = new MonsterSpawner(this.world.scene);
        
        Joystick.init();
        this.initCombatInterface();
        this.initCatchingInput();

        // Initial Spawn with Health Bars
        for(let i=0; i < 15; i++) {
            const rx = (Math.random() - 0.5) * 80;
            const rz = (Math.random() - 0.5) * 80;
            this.spawner.spawnRandom(rx, rz, "HILLS");
        }

        // Assign Health Bars to all spawned monsters
        this.spawner.activeMonsters.forEach(pal => {
            pal.stats = { hp: 100 }; // Ensure stats exist
            pal.hpBar = HealthBar.create(100);
        });

        this.isInitialized = true;
        this.gameLoop();
        console.log("%c [SYSTEM] Visual Effects & Health Bars Active", "color: #ff0000; font-weight: bold;");
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
        this.spawner.activeMonsters.forEach((pal, index) => {
            const inRange = CombatSystem.isTargetInRange(this.playerMesh.group.position, pal.mesh.position, 6);
            
            if (inRange && pal.stats.hp > 0) {
                const status = CombatSystem.applyDamage(pal, 25);
                MonsterEffects.playHitEffect(pal.mesh);
                
                if (status === "KILLED") {
                    MonsterEffects.playDeathEffect(this.world.scene, pal.mesh);
                }
            }
        });
    }

    initCatchingInput() {
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 2) { // 3 fingers to catch
                const result = CatchingSystem.throwSphere('COMMON', 50);
                console.log("Catching: " + result);
            }
        });
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // Player Movement
        if (Joystick.moveData.x !== 0 || Joystick.moveData.y !== 0) {
            this.playerMesh.updatePosition(Joystick.moveData);
            this.world.camera.position.x = this.playerMesh.group.position.x;
            this.world.camera.position.z = this.playerMesh.group.position.z + 10;
            this.world.camera.lookAt(this.playerMesh.group.position);
        }

        // Update Floating Health Bars
        this.spawner.activeMonsters.forEach(pal => {
            if (pal.stats.hp > 0) {
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
