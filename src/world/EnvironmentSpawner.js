// Game: Palworld Mobile - Master Biome Spawner (Collision & Colors Fixed)
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class EnvironmentSpawner {
    constructor(scene) {
        this.scene = scene;
        // Collision detection ke liye pahaadon ka data yahan save hoga
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

    // --- SNOW BIOME ASSETS ---
    createSnowHill(x, z) {
        const group = new THREE.Group();
        const height = 25 + Math.random() * 35; // Increased height for hills
        const radius = 25 + Math.random() * 20;
        
        // 1. Snow Patch (Zameen ko white cover dene ke liye)
        const patchGeo = new THREE.CircleGeometry(radius * 1.8, 12);
        const patchMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const patch = new THREE.Mesh(patchGeo, patchMat);
        patch.rotation.x = -Math.PI / 2;
        patch.position.y = 0.1;
        group.add(patch);

        // 2. Main Hill Body
        const hillGeo = new THREE.ConeGeometry(radius, height, 8);
        const hillMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
        const hill = new THREE.Mesh(hillGeo, hillMat);
        hill.position.y = height / 2;
        group.add(hill);

        // 3. Ice Peak (Shinier top layer)
        const peakGeo = new THREE.ConeGeometry(radius * 0.4, height * 0.4, 8);
        const peakMat = new THREE.MeshStandardMaterial({ color: 0xe0ffff, emissive: 0x112222 });
        const peak = new THREE.Mesh(peakGeo, peakMat);
        peak.position.set(0, height * 0.8, 0);
        group.add(peak);

        group.position.set(x, 0, z);
        this.scene.add(group);

        // --- COLLISION DATA ---
        // Pahaad ke radius ko collision array mein add karein
        this.collidables.push({
            x: x,
            z: z,
            radius: radius * 0.85 // Base se thoda kam area solid rahega
        });
    }

    createSnowTree(x, z) {
        const group = new THREE.Group();
        // Frozen Dark Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 6, 6);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a }); // Dark almost black
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 3;
        group.add(trunk);

        // Snow-covered Cone Layers (White instead of Green)
        const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
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
    spawnAllBiomes(density = 250) {
        // Purane objects clear karna zaroori hai agar re-spawn ho
        this.collidables = []; 
        
        for(let i = 0; i < density; i++) {
            const rx = (Math.random() - 0.5) * 600; 
            const rz = (Math.random() - 0.5) * 600;

            if (rz < -60) { 
                // NORTH SIDE: SNOW BIOME
                if (Math.random() > 0.6) {
                    this.createSnowHill(rx, rz);
                } else {
                    this.createSnowTree(rx, rz);
                }
            } else {
                // SOUTH SIDE: AMAZON JUNGLE
                const rand = Math.random();
                if(rand > 0.7) {
                    this.createAmazonGiant(rx, rz);
                } else if(rand > 0.4) {
                    // Small Jungle Bush
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
