// Game: Palworld Mobile - Final Biome Fix & Visibility Optimization
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
        console.log("%c [BOOT] Zenith OS: Biome Optimization Engine...", "color: #00ffff; font-weight: bold;");
        
        try {
            this.world = new GameRenderer();
            const scene = this.world.scene;

            this.terrain = new Terrain(scene);
            this.water = new WaterSystem(scene);
            this.env = new EnvironmentSpawner(scene);
            this.playerMesh = new PlayerModel(scene);
            this.spawner = new MonsterSpawner(scene);

            this.initHUD();
            Joystick.init(); 
            this.initCameraControls();

            if(this.water) this.water.createLake(30, 30, 20);
            this.populateWorld();

            this.isInitialized = true;
            this.gameLoop();
            
            window.GameInstance = this;
            console.log("%c [SYSTEM] Visibility Balanced - World Ready", "color: #00ff00; font-weight: bold;");

        } catch (err) {
            console.error("Boot Error:", err);
            if(this.world) { this.isInitialized = true; this.gameLoop(); }
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

    populateWorld() {
        if (this.env) {
            // Increased density for 4km map
            this.env.spawnAllBiomes(400); 
        }

        if (this.spawner) {
            for(let i=0; i < 30; i++) {
                const rx = (Math.random() - 0.5) * 800;
                const rz = (Math.random() - 0.5) * 800;
                const biomeType = rz < -60 ? "SNOW" : "JUNGLE";
                this.spawner.spawnRandom(rx, rz, biomeType);
            }
        }
    }

    checkCollision(nextX, nextZ) {
        if (!this.env || !this.env.collidables) return false;
        for (let obj of this.env.collidables) {
            const dx = nextX - obj.x;
            const dz = nextZ - obj.z;
            if (Math.sqrt(dx * dx + dz * dz) < obj.radius) return true;
        }
        return false;
    }

    gameLoop() {
        if (!this.isInitialized) return;

        SurvivalSystem.update();
        const hud = document.getElementById('survival-hud');
        if (hud) hud.innerHTML = SurvivalUI.renderHUD(SurvivalSystem.stats);

        // --- Movement & Collision ---
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

        // --- Camera & Biome Sensitivity (Fixed Visibility) ---
        if (this.playerMesh) {
            const pPos = this.playerMesh.group.position;

            if (pPos.z < -60) {
                // Snow Biome: Soft Icy Blue Fog (Preventing Washout)
                this.world.scene.fog = new THREE.Fog(0xcedce0, 15, 130);
                this.world.scene.background = new THREE.Color(0xcedce0);
            } else {
                // Jungle Biome: Deep Green Fog
                this.world.scene.fog = new THREE.Fog(0x1a3d00, 10, 160);
                this.world.scene.background = new THREE.Color(0x87ceeb);
            }

            const orbitDist = 20; // Increased for better view of giants
            this.world.camera.position.x = pPos.x + orbitDist * Math.sin(this.cameraAngle);
            this.world.camera.position.z = pPos.z + orbitDist * Math.cos(this.cameraAngle);
            this.world.camera.position.y = pPos.y + 14; 
            this.world.camera.lookAt
