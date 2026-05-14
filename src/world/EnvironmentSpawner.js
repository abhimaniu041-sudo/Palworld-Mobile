// Game: Palworld Mobile - Biome Master (Visibility & Contrast Fix)
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class EnvironmentSpawner {
    constructor(scene) {
        this.scene = scene;
        this.collidables = []; 
    }

    // --- AMAZON JUNGLE ASSETS ---
    createAmazonGiant(x, z) {
        const group = new THREE.Group();
        const trunkGeo = new THREE.CylinderGeometry(0.8, 1.2, 12, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3b2201 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 6;
        group.add(trunk);

        const leafMat = new THREE.MeshStandardMaterial({ color: 0x0a3d00 });
        for(let i = 0; i < 6; i++) {
            const canopyGeo = new THREE.SphereGeometry(3.5, 8, 8);
            const canopy = new THREE.Mesh(canopyGeo, leafMat);
            canopy.position.set((Math.random()-0.5)*5, 11 + (Math.random()*2), (Math.random()-0.5)*5);
            canopy.scale.y = 0.6;
            group.add(canopy);
        }
        group.position.set(x, 0, z);
        this.scene.add(group);
    }

    // --- SNOW BIOME ASSETS (Contrast Optimized) ---
    createSnowHill(x, z) {
        const group = new THREE.Group();
        const height = 25 + Math.random() * 35;
        const radius = 25 + Math.random() * 20;
        
        // 1. Snow Patch (Thoda darker white/grey taaki floor se alag dikhe)
        const patchGeo = new THREE.CircleGeometry(radius * 1.8, 12);
        const patchMat = new THREE.MeshStandardMaterial({ color: 0xddeeff }); // Light Ice Blue tint
        const patch = new THREE.Mesh(patchGeo, patchMat);
        patch.rotation.x = -Math.PI / 2;
        patch.position.y = 0.05;
        group.add(patch);

        // 2. Main Hill Body (Off-white taaki total wash-out na ho)
        const hillGeo = new THREE.ConeGeometry(radius, height, 8);
        const hillMat = new THREE.MeshStandardMaterial({ 
            color: 0xfafafa, // Not 100% white
            roughness: 0.8 
        });
        const hill = new THREE.Mesh(hillGeo, hillMat);
        hill.position.y = height / 2;
        group.add(hill);

        // 3. Ice Peak (Stronger Blue for visibility)
        const peakGeo = new THREE.ConeGeometry(radius * 0.4, height * 0.4, 8);
        const peakMat = new THREE.MeshStandardMaterial({ 
            color: 0x00aaff, // Bright Blue Ice
            emissive: 0x002244 
        });
        const peak = new THREE.Mesh(peakGeo, peakMat);
        peak.position.set(0, height * 0.8, 0);
        group.add(peak);

        group.position.set(x, 0, z);
        this.scene.add(group);
        this.collidables.push({ x: x, z: z, radius: radius * 0.85 });
    }

    createSnowTree(x, z) {
        const group = new THREE.Group();
        
        // Trunk (Jet Black - Frozen wood look)
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 6, 6);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a }); 
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 3;
        group.add(trunk);

        // Snowy Leaves (Light Grey - Contrast against white hills)
        const snowMat = new THREE.MeshStandardMaterial({ color: 0xcccccc }); 
        for(let i=0; i<4; i++) {
            const snowGeo = new THREE.ConeGeometry(2 - i*0.4, 1.8, 8);
            const snow = new THREE.Mesh(snowGeo, snowMat);
            snow.position.y = 4.5 + (i * 1.3);
            group.add(snow);
        }
        
        group.position.set(x, 0, z);
        this.scene.add(group);
    }

    // --- MASTER SPAWNER ---
    spawnAllBiomes(density = 350) {
        this.collidables = []; 
        for(let i = 0; i < density; i++) {
            const rx = (Math.random() - 0.5) * 800; 
            const rz = (Math.random() - 0.5) * 800;

            if (rz < -60) { 
                if (Math.random() > 0.6) this.createSnowHill(rx, rz);
                else this.createSnowTree(rx, rz);
            } else {
                const rand = Math.random();
                if(rand > 0.7) this.createAmazonGiant(rx, rz);
                else {
                    const bushGeo = new THREE.IcosahedronGeometry(2, 0);
                    const bushMat = new THREE.MeshStandardMaterial({ color: 0x0a3d00 });
                    const bush = new THREE.Mesh(bushGeo, bushMat);
                    bush.position.set(rx, 1, rz);
                    this.scene.add(bush);
                }
            }
        }
    }
}
