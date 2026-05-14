// Game: Palworld Mobile - Final Optimized Integration (Anti-Black Screen Edition)
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
        this.env = null;
        this.isInitialized = false;

        // Camera & Rotation Logic
        this.cameraAngle = 0; 
        this.touchX = 0;
        this.isSwiping = false;
    }

    async start() {
        console.log("%c [BOOT] Zenith OS: Starting 3D Engine...", "color: #00ffff; font-weight: bold;");
        
        try {
            // 1. Core Scene Setup
            this.world = new GameRenderer();
            const scene = this.world.scene;

            // 2. Load World Assets (With Individual Failsafes)
            try { this.terrain = new Terrain(scene); } catch(e) { console.warn("Terrain Init Failed"); }
            try { this.water = new WaterSystem(scene); } catch(e) { console.warn("Water Init Failed"); }
            try { this.env = new EnvironmentSpawner(scene); } catch(e) { console.warn("Env Init Failed"); }
            try { this.playerMesh = new PlayerModel(scene); } catch(e) { console.warn("Player Init Failed"); }
            try { this.spawner = new MonsterSpawner(scene); } catch(e) { console.warn("Spawner Init Failed"); }

            // 3. UI & Control Setup
            this.initHUD();
            Joystick.init(); 
            this.initCameraControls();

            // 4. World Spawning
            if (this.env && typeof this.env.spawnAllBiomes === 'function') {
                this.env.spawnAllBiomes(400); 
            }
            this.populateMonsters();

            // 5. Final Engine Ready Check
            this.isInitialized = true;
            this.gameLoop();
            
            // Remove Loading Screen
            this.removeLoader();
            window.GameInstance = this;
            
            console.log("%c [SYSTEM] World Ready - Navigation Active", "color: #00ff00; font-weight: bold;");

        } catch (err) {
            console.error("CRITICAL ENGINE ERROR:", err);
            this.removeLoader();
        }
    }

    removeLoader() {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }

    populateMonsters() {
        if (!this.spawner) return;
        for(let i=0; i < 25; i++) {
            const rx = (Math.random() - 0.5) * 800;
            const rz = (Math.random() - 0.5) * 800;
            const biome = rz < -60 ? "SNOW" : "JUNGLE";
            this.spawner.spawnRandom(rx, rz, biome);
        }
    }

    initCameraControls() {
        window.addEventListener('touchstart', (e) => {
            if (e.touches[0].clientX > window.innerWidth / 2) {
                this.isSwiping = true;
                this.touchX = e.touches[0].clientX;
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (this.isSwiping) {
                const deltaX = e.touches[0].clientX - this.touchX;
                this.cameraAngle -= deltaX * 0.007; 
                this.touchX = e.touches[0].clientX;
            }
        }, { passive: false });

        window.addEventListener('touchend', () => { this.isSwiping = false; });
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

    checkCollision(nextX, nextZ) {
        if (!this.env || !this.env.collidables) return false;
        for (let obj of this.env.collidables) {
            const dx = nextX - obj.x;
            const dz = nextZ - obj.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < (obj.radius || 5)) return true;
        }
        return false;
    }

    gameLoop() {
        if (!this.isInitialized) return;

        SurvivalSystem.update();
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);

        // --- Movement Logic ---
        if (Math.abs(Joystick.moveData.x) > 0.01 || Math.abs(Joystick.moveData.y) > 0.01) {
            if (this.playerMesh && this.playerMesh.group) {
                const moveX = Joystick.moveData.x * Math.cos(this.cameraAngle) - Joystick.moveData.y * Math.sin(this.cameraAngle);
                const moveZ = Joystick.moveData.x * Math.sin(this.cameraAngle) + Joystick.moveData.y * Math.cos(this.cameraAngle);
                
                const nextX = this.playerMesh.group.position.x + moveX * 0.3;
                const nextZ = this.playerMesh.group.position.z + moveZ * 0.3;

                if (!this.checkCollision(nextX, nextZ)) {
                    this.playerMesh.updatePosition({ x: moveX, y: moveZ });
                    this.playerMesh.group.rotation.y = Math.atan2(moveX, moveZ);
                }
            }
        }

        // --- Camera Orbit & Biome Sensing ---
        if (this.playerMesh && this.playerMesh.group) {
            const pPos = this.playerMesh.group.position;

            // Fog & Lighting Transitions
            if (pPos.z < -60) {
                this.world.scene.fog = new THREE.Fog(0xcedce0, 15, 140);
                this.world.scene.background = new THREE.Color(0xcedce0);
            } else {
                this.world.scene.fog = new THREE.Fog(0x1a3d00, 10, 160);
                this.world.scene.background = new THREE.Color(0x87ceeb);
            }

            const orbitDist = 20;
            const camX = pPos.x + orbitDist * Math.sin(this.cameraAngle);
            const camZ = pPos.z + orbitDist * Math.cos(this.cameraAngle);
            const camY = pPos.y + 14;

            // Update camera position smoothly
            this.world.camera.position.set(camX, camY, camZ);
            this.world.camera.lookAt(pPos.x, pPos.y + 2, pPos.z);
        }

        // Final Rendering
        if (this.world) {
            this.world.render(this.world.scene, this.world.camera);
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
