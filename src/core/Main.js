// Game: Palworld Mobile - Final Optimized Integration (UI & Control Restore)
import { GameRenderer } from './Renderer.js';
import { Joystick } from '../ui/Joystick.js';
import { PlayerModel } from '../entities/PlayerModel.js';
import { MonsterSpawner } from '../entities/MonsterSpawner.js';
import { Terrain } from '../world/Terrain.js';
import { WaterSystem } from '../world/WaterSystem.js';
import { EnvironmentSpawner } from '../world/EnvironmentSpawner.js';
import { SurvivalSystem } from '../systems/SurvivalSystem.js';
import { SurvivalUI } from '../ui/SurvivalUI.js';
import { CombatUI } from '../ui/CombatUI.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

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
            // 1. Initialize 3D Renderer
            this.world = new GameRenderer();
            const scene = this.world.scene;

            // 2. Load World Assets & Player
            this.terrain = new Terrain(scene);
            this.water = new WaterSystem(scene);
            this.env = new EnvironmentSpawner(scene);
            this.playerMesh = new PlayerModel(scene);
            this.spawner = new MonsterSpawner(scene);

            // 3. UI Layer Setup (Z-Index check)
            this.initHUD();
            Joystick.init(); // Joystick ko hamesha initHUD ke baad ya sath rakhein

            // 4. Populate Map
            if(this.water) this.water.createLake(30, 30, 20);
            this.populateWorld();

            this.isInitialized = true;
            this.gameLoop();
            
            window.GameInstance = this;
            console.log("%c [SYSTEM] Engine Online - Controls Active", "color: #00ff00; font-weight: bold;");

        } catch (err) {
            console.error("Critical Start Error:", err);
            // Error ke bawajood failsafe rendering
            if(this.world) {
                this.isInitialized = true;
                this.gameLoop();
            }
        }
    }

    initHUD() {
        // Ensure UI container exists
        const uiContainer = document.getElementById('game-ui') || document.body;
        
        // 1. Survival HUD
        const survivalDiv = document.getElementById('survival-hud') || document.createElement('div');
        survivalDiv.id = 'survival-hud';
        survivalDiv.style.pointerEvents = "none";
        uiContainer.appendChild(survivalDiv);
        
        // 2. Combat Buttons (ATK/DODGE)
        const combatDiv = document.createElement('div');
        combatDiv.id = 'combat-ui';
        combatDiv.style.pointerEvents = "auto"; 
        combatDiv.innerHTML = CombatUI.renderCombatButtons();
        uiContainer.appendChild(combatDiv);
    }

    populateWorld() {
        if (!this.spawner) return;
        // Spawn 10 Pals around starting area
        for(let i=0; i < 10; i++) {
            const rx = (Math.random() - 0.5) * 100;
            const rz = (Math.random() - 0.5) * 100;
            this.spawner.spawnRandom(rx, rz, "HILLS");
        }
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // --- Logic Updates ---
        SurvivalSystem.update();
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);

        // --- Player Movement & Camera ---
        // Joystick data check karein (0.1 deadzone ke sath)
        if (Math.abs(Joystick.moveData.x) > 0.01 || Math.abs(Joystick.moveData.y) > 0.01) {
            if (this.playerMesh && this.playerMesh.group) {
                // Character Update
                this.playerMesh.updatePosition(Joystick.moveData);

                // Camera Follow Logic
                const pPos = this.playerMesh.group.position;
                this.world.camera.position.x = pPos.x;
                this.world.camera.position.z = pPos.z + 18; // Thoda piche
                this.world.camera.position.y = pPos.y + 12; // Thoda upar
                this.world.camera.lookAt(pPos.x, pPos.y, pPos.z);
            }
        }

        // --- Final Frame Render ---
        if (this.world) {
            this.world.render(this.world.scene, this.world.camera);
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
