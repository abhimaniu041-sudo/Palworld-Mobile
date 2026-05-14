// Game: Palworld Mobile - Biome System (Amazon + Snow Hills)
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class EnvironmentSpawner {
    constructor(scene) {
        this.scene = scene;
    }

    // --- AMAZON JUNGLE BIOME ---
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

    createPalmTree(x, z) {
        const group = new THREE.Group();
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.4, 7, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e4b1f });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 3.5;
        trunk.rotation.z = (Math.random()-0.5)*0.2;
        group.add(trunk);

        const leafMat = new THREE.MeshStandardMaterial({ color: 0x228b22, side: THREE.DoubleSide });
        for(let i = 0; i < 10; i++) {
            const leafGeo = new THREE.BoxGeometry(0.6, 0.05, 3.5);
            const leaf = new THREE.Mesh(leafGeo, leafMat);
            leaf.position.y = 7;
            leaf.rotation.y = (i * Math.PI) / 5;
            leaf.rotation.x = 0.6;
            group.add(leaf);
        }
        group.position.set(x, 0, z);
        this.scene.add(group);
    }

    // --- SNOW BIOME (North Area) ---
    createSnowHill(x, z) {
        const height = 15 + Math.random() * 25;
        const radius = 20 + Math.random() * 15;
        
        // Hill Base (White)
        const hillGeo = new THREE.ConeGeometry(radius, height, 8);
        const hillMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const hill = new THREE.Mesh(hillGeo, hillMat);
        hill.position.set(x, height / 2, z);
        this.scene.add(hill);

        // Ice Peak (Shinier top)
        const peakGeo = new THREE.ConeGeometry(radius * 0.3, height * 0.3, 8);
        const peakMat = new THREE.MeshStandardMaterial({ color: 0xd0f0ff, emissive: 0x001122 });
        const peak = new THREE.Mesh(peakGeo, peakMat);
        peak.position.set(x, height * 0.85, z);
        this.scene.add(peak);
    }

    createSnowTree(x, z) {
        const group = new THREE.Group();
        // Frozen Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 6, 6);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 3;
        group.add(trunk);

        // Snow Blocks on branches
        const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        for(let i=0; i<4; i++) {
            const snowGeo = new THREE.BoxGeometry(1.5 - i*0.2, 0.8, 1.5 - i*0.2);
            const snow = new THREE.Mesh(snowGeo, snowMat);
            snow.position.y = 4 + i;
            group.add(snow);
        }
        group.position.set(x, 0, z);
        this.scene.add(group);
    }

    // --- MASTER SPAWNER ---
    spawnAllBiomes(density = 120) {
        for(let i = 0; i < density; i++) {
            const rx = (Math.random() - 0.5) * 300;
            const rz = (Math.random() - 0.5) * 300;

            if (rz < -50) { 
                // North Side: Snow Biome
                if (Math.random() > 0.6) this.createSnowHill(rx, rz);
                else this.createSnowTree(rx, rz);
            } else {
                // South Side: Amazon Jungle
                const type = Math.random();
                if(type > 0.6) this.createAmazonGiant(rx, rz);
                else this.createPalmTree(rx, rz);
            }
        }
    }
}
