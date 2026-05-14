// Game: Palworld Mobile - Professional 3D Renderer (Fix for Black Screen)
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class GameRenderer {
    constructor() {
        // 1. Scene & Sky Setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Bright Sky Blue

        // 2. Camera Setup (Optimized for 4km Map)
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            3000 // Far plane increased to see distant hills
        );

        // 3. WebGL Renderer Initialization
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });

        // Initialize all settings
        this.init();
    }

    init() {
        // Size & Resolution
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 4. Canvas DOM Placement (Crucial Fix)
        const container = document.getElementById('game-canvas') || document.body;
        container.appendChild(this.renderer.domElement);

        // Style fix to ensure it's visible but behind the UI buttons
        Object.assign(this.renderer.domElement.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '1', // Must be 1 to stay above background but below UI (which is 10)
            outline: 'none'
        });

        // 5. Lighting Setup (Balanced for Amazon & Snow)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 0.9);
        sunLight.position.set(50, 100, 50);
        this.scene.add(sunLight);

        // Hemispherical light for natural ground/sky reflections
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x1a3d00, 0.5);
        this.scene.add(hemiLight);

        // 6. Initial Camera Placement (Avoids starting in the dark)
        this.camera.position.set(0, 20, 25);
        this.camera.lookAt(0, 0, 0);

        // Resize Listener
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Main Render Loop call from Main.js
    render(scene, camera) {
        if (this.renderer && scene && camera) {
            this.renderer.render(scene, camera);
        }
    }
}
