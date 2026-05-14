// Game: Palworld Mobile - Final Biome & 4km Map Integration
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
        console.log("%c [BOOT] Initializing Multi-Biome 4km Map...", "color: #00ffff; font-weight: bold;");
        
        try {
            // 1. Scene & Renderer Setup
            this.world = new GameRenderer();
            const scene = this.world.scene;

            // 2. Load Core Assets
            this.terrain = new Terrain(scene);
            this.water = new WaterSystem(scene);
            this.env = new EnvironmentSpawner(scene);
            this.playerMesh = new PlayerModel(scene);
            this.spawner = new MonsterSpawner(scene);

            // 3. UI & Control Setup
            this.initHUD();
            Joystick.init(); 
            this.initCameraControls();

            // 4. Map Population
            if(this.water) this.water.createLake(30, 30, 20);
            this.populateWorld();

            this.isInitialized = true;
            this.gameLoop();
            
            window.GameInstance = this;
            console.log("%c [SYSTEM] World Ready: Amazon & Snow Regions Active", "color: #00ff00; font-weight: bold;");

        } catch (err) {
            console.error("Boot Error:", err);
            if(this.world) {
                this.isInitialized = true;
                this.gameLoop();
            }
        }
    }

    initCameraControls() {
        // Handle Camera Swipe on Right Half of Screen
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
        // --- High Density Spawning for 4km Map ---
        if (this.env) {
            // Increased density to 350 to fill the large area
            this.env.spawnAllBiomes(350); 
        }

        // --- Monster Spawning with Biome Logic ---
        if (this.spawner) {
            for(let i=0; i < 25; i++) {
                const rx = (Math.random() - 0.5) * 500;
                const rz = (Math.random() - 0.5) * 500;
                // Z < -60 corresponds to Snow Biome in EnvironmentSpawner
                const biomeType = rz < -60 ? "SNOW" : "JUNGLE";
                this.spawner.spawnRandom(rx, rz, biomeType);
            }
        }
    }

    gameLoop() {
        if (!this.isInitialized) return;

        // 1. HUD & Survival Stats
        SurvivalSystem.update();
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);

        // 2. Relative Movement (Joystick + Camera Angle)
        if (Math.abs(Joystick.moveData.x) > 0.01 || Math.abs(Joystick.moveData.y) > 0.01) {
            if (this.playerMesh && this.playerMesh.group) {
                const moveX = Joystick.moveData.x * Math.cos(this.cameraAngle) - Joystick.moveData.y * Math.sin(this.cameraAngle);
                const moveZ = Joystick.moveData.x * Math.sin(this.cameraAngle) + Joystick.moveData.y * Math.cos(this.cameraAngle);
                
                this.playerMesh.updatePosition({ x: moveX, y: moveZ });
                this.playerMesh.group.rotation.y = Math.atan2(moveX, moveZ);
            }
        }

        // 3. Biome Sensitivity & Camera Follow
        if (this.playerMesh) {
            const pPos = this.playerMesh.group.position;

            // Biome Sensing: Apply Snow/Jungle visual effects
            if (pPos.z < -60) {
                // Snow Biome: White Fog & Bright Atmosphere
                this.world.scene.fog = new THREE.Fog(0xffffff, 10, 100);
            } else {
                // Jungle Biome: Dense Green Fog
                this.world.scene.fog = new THREE.Fog(0x1a3d00, 10, 150);
            }

            // Smooth Orbit Camera
            const orbitDist = 18;
            this.world.camera.position.x = pPos.x + orbitDist * Math.sin(this.cameraAngle);
            this.world.camera.position.z = pPos.z + orbitDist * Math.cos(this.cameraAngle);
            this.world.camera.position.y = pPos.y + 12; 
            this.world.camera.lookAt(pPos.x, pPos.y + 2, pPos.z);
        }

        // 4. Final Rendering
        if (this.world) {
            this.world.render(this.world.scene, this.world.camera);
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

export const GameInstance = new PalworldMobile();
window.addEventListener('load', () => GameInstance.start());
