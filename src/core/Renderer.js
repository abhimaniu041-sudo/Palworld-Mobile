// Game: Palworld Mobile - 3D Rendering Engine
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class GameRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Mobile optimization
        document.getElementById('game-canvas').appendChild(this.renderer.domElement);
        
        // Premium Dark/Red Ambient Light
        const ambientLight = new THREE.AmbientLight(0xff0000, 0.5);
        this.scene.add(ambientLight);

        this.camera.position.set(0, 5, 10);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
