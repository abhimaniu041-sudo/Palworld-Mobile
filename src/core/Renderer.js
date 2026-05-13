import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class GameRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Sky Blue

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const container = document.getElementById('game-canvas') || document.body;
        container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(5, 10, 7);
        this.scene.add(sunLight);

        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);
    }
}
