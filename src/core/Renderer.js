// Game: Palworld Mobile - 3D Rendering Engine (Visibility Fix)
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class GameRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        // Background color sky blue rakhte hain taaki black screen na lage
        this.scene.background = new THREE.Color(0x87ceeb); 

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const container = document.getElementById('game-canvas');
        if (container) {
            container.appendChild(this.renderer.domElement);
        } else {
            document.body.appendChild(this.renderer.domElement);
        }

        // --- ZAROORI: Bright Lighting Setup ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // White Ambient Light
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2); // Strong Sun Light
        sunLight.position.set(10, 20, 10);
        this.scene.add(sunLight);

        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);
    }
}
