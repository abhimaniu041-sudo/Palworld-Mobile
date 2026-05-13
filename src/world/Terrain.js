// Game: Palworld Mobile - 3D Terrain System
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class Terrain {
    constructor(scene) {
        this.scene = scene;
        this.size = 4000; // 4km
        this.createGround();
    }

    createGround() {
        const geometry = new THREE.PlaneGeometry(this.size, this.size, 10, 10);
        
        // Simple Vertex Coloring for Biomes (Green for Plains, Yellow for Desert)
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x2d5a27, // Base Grass Green
            side: THREE.DoubleSide 
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2; // Flat on floor
        this.mesh.position.y = 0;
        this.scene.add(this.mesh);

        // Add a Grid for depth (Optional: Professional look ke liye)
        const grid = new THREE.GridHelper(this.size, 100, 0xff0000, 0x222222);
        this.scene.add(grid);
    }
}
