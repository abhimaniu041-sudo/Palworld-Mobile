// Game: Palworld Mobile - Premium 3D Renderer (Black Screen Force-Fix)
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class GameRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        // Background color ko Sky Blue rakhte hain taaki black screen ka doubt na rahe
        this.scene.background = new THREE.Color(0x87ceeb); 

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance" 
        });
        
        this.init();
    }

    init() {
        // 1. Renderer Setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // 2. DOM Attachment (Ensuring it attaches to the right place)
        const container = document.getElementById('game-canvas') || document.body;
        container.appendChild(this.renderer.domElement);
        
        // Canvas positioning fix for mobile
        this.renderer.domElement.style.position = "fixed";
        this.renderer.domElement.style.top = "0";
        this.renderer.domElement.style.left = "0";
        this.renderer.domElement.style.zIndex = "-1"; // UI buttons ke niche rahega

        // 3. Ultra-Bright Lighting (Bina light ke models black dikhte hain)
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); 
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(10, 20, 10);
        this.scene.add(sunLight);

        // 4. Fallback Ground (Agar terrain fail ho jaye toh ye green floor dikhega)
        const testFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshStandardMaterial({ color: 0x228b22 }) // Forest Green
        );
        testFloor.rotation.x = -Math.PI / 2;
        testFloor.position.y = -0.01; 
        this.scene.add(testFloor);

        // 5. Initial Camera Position
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);

        // 6. Handle Resize (Mobile orientation change fix)
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render(scene, camera) {
        if (this.renderer && scene && camera) {
            this.renderer.render(scene, camera);
        }
    }
}
