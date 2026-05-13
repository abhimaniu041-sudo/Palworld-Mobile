import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class PlayerModel {
    constructor(scene) {
        // Simple Humanoid Shape: Head + Body
        this.group = new THREE.Group();
        
        const bodyGeo = new THREE.BoxGeometry(1, 2, 0.5);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark Gray suit
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        
        const headGeo = new THREE.SphereGeometry(0.4);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac }); // Skin tone
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.3;

        this.group.add(body);
        this.group.add(head);
        scene.add(this.group);
    }

    updatePosition(moveData) {
        this.group.position.x += moveData.x * 0.2;
        this.group.position.z += moveData.y * 0.2;
    }
}
