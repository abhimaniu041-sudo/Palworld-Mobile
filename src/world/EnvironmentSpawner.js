// Game: Palworld Mobile - Amazon Rainforest Environment
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class EnvironmentSpawner {
    constructor(scene) {
        this.scene = scene;
    }

    // 1. Amazon Giant (Kapok style) - Sabse unche aur ghane trees
    createAmazonGiant(x, z) {
        const group = new THREE.Group();

        // Thick Dark Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.8, 1.2, 12, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3b2201 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 6;
        group.add(trunk);

        // Huge Layered Canopy (Top chhatri jaisa hissa)
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x0a3d00 }); // Deep Jungle Green
        for(let i = 0; i < 6; i++) {
            const canopyGeo = new THREE.SphereGeometry(3.5, 8, 8);
            const canopy = new THREE.Mesh(canopyGeo, leafMat);
            // Randomly placing spheres at the top to create a massive crown
            canopy.position.set(
                (Math.random() - 0.5) * 5, 
                11 + (Math.random() * 2), 
                (Math.random() - 0.5) * 5
            );
            canopy.scale.y = 0.6; // Flattened look for Amazon canopy
            group.add(canopy);
        }

        group.position.set(x, 0, z);
        this.scene.add(group);
    }

    // 2. Tropical Palm Tree (Nariyal jaisa tree)
    createPalmTree(x, z) {
        const group = new THREE.Group();

        // Slender Curved Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.4, 7, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e4b1f });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 3.5;
        trunk.rotation.z = (Math.random() - 0.5) * 0.2; // Slight lean
        group.add(trunk);

        // Long Palm Leaves
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x228b22, side: THREE.DoubleSide });
        for(let i = 0; i < 10; i++) {
            const leafGeo = new THREE.BoxGeometry(0.6, 0.05, 3.5);
            const leaf = new THREE.Mesh(leafGeo, leafMat);
            leaf.position.y = 7;
            leaf.rotation.y = (i * Math.PI) / 5;
            leaf.rotation.x = 0.6; // Downward curve
            group.add(leaf);
        }

        group.position.set(x, 0, z);
        this.scene.add(group);
    }

    // 3. Dense Undergrowth (Jungle Bush)
    spawnBush(x, z) {
        const bushGeo = new THREE.DodecahedronGeometry(1.5, 0);
        const bushMat = new THREE.MeshStandardMaterial({ color: 0x145200 });
        const bush = new THREE.Mesh(bushGeo, bushMat);
        bush.position.set(x, 0.5, z);
        bush.scale.set(1.5, 0.7, 1.5);
        this.scene.add(bush);
    }

    // Main Method: Pura jungle ek saath spawn karne ke liye
    spawnAmazonJungle(density = 80) {
        for(let i = 0; i < density; i++) {
            const rx = (Math.random() - 0.5) * 250;
            const rz = (Math.random() - 0.5) * 250;
            
            const type = Math.random();
            if(type > 0.7) {
                this.createAmazonGiant(rx, rz);
            } else if(type > 0.3) {
                this.createPalmTree(rx, rz);
            } else {
                this.spawnBush(rx, rz);
            }
        }
    }
}
