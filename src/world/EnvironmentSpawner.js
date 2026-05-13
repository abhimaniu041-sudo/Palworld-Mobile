// Game: Palworld Mobile - Environment Spawner
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class EnvironmentSpawner {
    constructor(scene) {
        this.scene = scene;
    }

    spawnTree(x, z) {
        const group = new THREE.Group();
        
        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.4, 2);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4d2902 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        
        // Leaves
        const leafGeo = new THREE.ConeGeometry(1.5, 3, 8);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x0b3d02 });
        const leaves = new THREE.Mesh(leafGeo, leafMat);
        leaves.position.y = 2;

        group.add(trunk);
        group.add(leaves);
        group.position.set(x, 1, z);
        this.scene.add(group);
    }

    spawnRock(x, z) {
        const geo = new THREE.DodecahedronGeometry(Math.random() + 0.5);
        const mat = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const rock = new THREE.Mesh(geo, mat);
        rock.position.set(x, 0.5, z);
        this.scene.add(rock);
    }
}
