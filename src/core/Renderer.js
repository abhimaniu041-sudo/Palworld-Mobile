// Game: Palworld Mobile - Master Renderer (Visibility Guaranteed)
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class GameRenderer {
    constructor() {
        // 1. Scene & World Setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Bright Sky Blue

        // 2. Camera Setup (Wide Angle for Mobile)
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            2500 
        );

        // 3. WebGL Renderer (High Compatibility Mode)
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: false, // Set to false to prevent buffer washout
            preserveDrawingBuffer: true 
        });

        this.init();
    }

    init() {
        // Pixel Ratio & Size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // 4. Force DOM Attachment
        const container = document.getElementById('game-canvas');
        if (container) {
            container.innerHTML = ''; // Clear previous canvas if any
            container.appendChild(this.renderer.domElement);
        } else {
            document.body.appendChild(this.renderer.domElement);
        }

        // Essential Style Fix for Mobile Visibility
        Object.assign(this.renderer.domElement.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '-1', // Stay behind UI layer
            pointerEvents: 'none' // Don't block joystick clicks
        });

        // 5. Bright Lighting Setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Bright base
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(20, 50, 20);
        this.scene.add(sunLight);

        // 6. Emergency View (Taaki black screen na dikhe)
        this.camera.position.set(0, 30, 40);
        this.camera.lookAt(0, 0, 0);

        // Responsive Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    render(scene, camera) {
        if (this.renderer && scene && camera) {
            this.renderer.render(scene, camera);
        }
    }
}
