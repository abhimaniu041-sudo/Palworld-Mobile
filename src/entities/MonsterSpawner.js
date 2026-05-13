// Game: Palworld Mobile - 3D Monster Spawner
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { PalDatabase } from '../data/PalDatabase.js';

export class MonsterSpawner {
    constructor(scene) {
        this.scene = scene;
        this.activeMonsters = [];
    }

    spawnRandom(x, z, biome) {
        // Biome ke hisab se monster filter karna
        const possiblePals = PalDatabase.filter(p => p.work.includes(this.getRequiredWork(biome)));
        const palData = possiblePals[Math.floor(Math.random() * possiblePals.length)];

        // Simple 3D Mesh for Monster
        const geometry = new THREE.DodecagedronGeometry(0.8);
        const material = new THREE.MeshStandardMaterial({ 
            color: this.getTypeColor(palData.type),
            wireframe: false 
        });
        
        const monsterMesh = new THREE.Mesh(geometry, material);
        monsterMesh.position.set(x, 1, z);
        
        this.scene.add(monsterMesh);
        this.activeMonsters.push({ data: palData, mesh: monsterMesh });
    }

    getTypeColor(type) {
        const colors = { Fire: 0xff4500, Water: 0x1e90ff, Grass: 0x32cd32, Ice: 0x00ffff };
        return colors[type] || 0xffffff;
    }

    getRequiredWork(biome) {
        if (biome === "DESERT") return "KINDLING";
        if (biome === "WATERFRONT") return "WATERING";
        return "GATHERING";
    }
}
