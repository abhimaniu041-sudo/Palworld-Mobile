import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class GameRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Sky Blue (Ensures no black screen)

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Find container or fallback to body
        const container = document.getElementById('game-canvas') || document.body;
        container.appendChild(this.renderer.domElement);

        // --- Strong Lighting (Critical for visibility) ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);

        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);
    }

    render(scene, camera) {
        if (this.renderer) {
            this.renderer.render(scene, camera);
        }
    }
}
