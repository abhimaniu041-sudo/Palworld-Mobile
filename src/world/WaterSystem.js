// Game: Palworld Mobile - Water & Lakes
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class WaterSystem {
    constructor(scene) {
        this.scene = scene;
    }

    createLake(x, z, radius) {
        const geometry = new THREE.CircleGeometry(radius, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x0077be, 
            transparent: true, 
            opacity: 0.8,
            roughness: 0.1
        });

        const lake = new THREE.Mesh(geometry, material);
        lake.rotation.x = -Math.PI / 2;
        lake.position.set(x, 0.05, z); // Slightly above ground to avoid flickering
        this.scene.add(lake);
    }
}
