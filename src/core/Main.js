// Game: Palworld Mobile - Final Landscape & 360° Camera Update
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

        // Camera Rotation Logic
        this.cameraAngle = 0; 
        this.touchX = 0;
        this.isSwiping = false;
    }

    async start() {
        console.log("%c [BOOT] Switching to Landscape Mode...", "color: #ff0000; font-weight: bold;");
        
        try {
            this.world = new GameRenderer();
            const scene = this.world.scene;

            this.terrain = new Terrain(scene);
            this.water = new WaterSystem(scene);
            this.env = new EnvironmentSpawner(scene);
            this.playerMesh = new PlayerModel(scene);
            this.spawner = new MonsterSpawner(scene);

            // UI & Controls
            this.initHUD();
            Joystick.init(); 
            this.initCameraControls(); // Rotation enable karein

            if(this.water) this.water.createLake(30, 30, 20);
            this.populateWorld();

            this.isInitialized = true;
            this.gameLoop();
            
            window.GameInstance = this;
            console.log("%c [SYSTEM] 360 Camera & Landscape Active", "color: #00ff00; font-weight: bold;");

        } catch (err) {
            console.error("Critical Start Error:", err);
            if(this.world) {
                this.isInitialized = true;
                this.gameLoop();
            }
        }
    }

    initCameraControls() {
        // Screen ke right side par swipe karne se camera ghumega
        window.addEventListener('touchstart', (e) => {
            if (e.touches[0].clientX > window.innerWidth / 2) {
                this.isSwiping = true;
                this.touchX = e.touches[0].clientX;
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (this.isSwiping) {
                const deltaX = e.touches[0].clientX - this.touchX;
                this.cameraAngle -= deltaX * 0.007; // Camera rotation sensitivity
                this.touchX = e.touches[0].clientX;
            }
        }, { passive: false });

        window.addEventListener('touchend', () => {
            this.isSwiping = false;
        });
    }

    initHUD() {
        const uiContainer = document.getElementById('game-ui') || document.body;
        
        const survivalDiv = document.getElementById('survival-hud') || document.createElement('div');
        survivalDiv.id = 'survival-hud';
        uiContainer.appendChild(survivalDiv);
        
        const combatDiv = document.createElement('div');
        combatDiv.id = 'combat-ui';
        combatDiv.innerHTML = CombatUI.renderCombatButtons();
        uiContainer.appendChild(combatDiv);
    }

    populateWorld() {
        if (!this.spawner) return;
        for(let i=0; i < 12; i++) {
            const rx = (Math.random() - 0.5) * 120;
            const rz = (Math.random() - 0.5) * 120;
            this.spawner.spawnRandom(rx, rz, "HILLS");
        }
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // 1. HUD Updates
        SurvivalSystem.update();
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);

        // 2. Movement relative to Camera Angle
        if (Math.abs(Joystick.moveData.x) > 0.01 || Math.abs(Joystick.moveData.y) > 0.01) {
            if (this.playerMesh && this.playerMesh.group) {
                
                // Camera angle ke mutabiq movement calculate karein
                const moveX = Joystick.moveData.x * Math.cos(this.cameraAngle) - Joystick.moveData.y * Math.sin(this.cameraAngle);
                const moveZ = Joystick.moveData.x * Math.sin(this.cameraAngle) + Joystick.moveData.y * Math.cos(this.cameraAngle);
                
                this.playerMesh.updatePosition({ x: moveX, y: moveZ });

                // Character face rotation
                this.playerMesh.group.rotation.y = Math.atan2(moveX, moveZ);
            }
        }

        // 3. Smooth Camera Orbit (Landscape Optimized)
        if (this.playerMesh) {
            const pPos = this.playerMesh.group.position;
            const orbitDistance = 16; // Camera distance
            
            this.world.camera.position.x = pPos.x + orbitDistance * Math.sin(this.cameraAngle);
            this.world.camera.position.z = pPos.z + orbitDistance * Math.cos(this.cameraAngle);
            this.world.camera.position.y = pPos.y + 10; // Height
            
            this.world.camera.lookAt(pPos.x, pPos.y + 2, pPos.z);
        }

        if (this.world) {
            this.world.render(this.world.scene, this.world.camera);
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
