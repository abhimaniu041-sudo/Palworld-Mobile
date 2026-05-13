// Game: Palworld Mobile - Master Integration (Combat & UI Update)
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
        
        // 2. Setup Controls & Combat UI
        Joystick.init();
        this.initCombatInterface();
        this.initCatchingInput();

        // 3. Initial Spawn
        for(let i=0; i < 15; i++) {
            const rx = (Math.random() - 0.5) * 60;
            const rz = (Math.random() - 0.5) * 60;
            this.spawner.spawnRandom(rx, rz, "HILLS");
        }

        this.isInitialized = true;
        this.gameLoop();
        console.log("%c [SYSTEM] Combat Engine & World Ready", "color: #ff0000; font-weight: bold;");
    }

    initCombatInterface() {
        const combatContainer = document.createElement('div');
        combatContainer.id = 'combat-ui';
        document.body.appendChild(combatContainer);
        combatContainer.innerHTML = CombatUI.renderCombatButtons();

        // Attack Event Listener
        document.getElementById('atk-btn')?.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handlePlayerAttack();
        });
    }

    handlePlayerAttack() {
        console.log("Attacking nearest Pal...");
        this.spawner.activeMonsters.forEach(pal => {
            const inRange = CombatSystem.isTargetInRange(
                this.playerMesh.group.position, 
                pal.mesh.position, 
                5 // Attack Range
            );
            
            if (inRange) {
                CombatSystem.applyDamage(pal, 20); // Deal 20 DMG
                // Visual feedback: Shrink monster slightly on hit
                pal.mesh.scale.set(0.8, 0.8, 0.8);
                setTimeout(() => pal.mesh.scale.set(1, 1, 1), 100);
            }
        });
    }

    initCatchingInput() {
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) { 
                const result = CatchingSystem.throwSphere('COMMON', 50);
                console.log("Catch Result: " + result);
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

        // Render Frame
        this.world.renderer.render(this.world.scene, this.world.camera);
        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
