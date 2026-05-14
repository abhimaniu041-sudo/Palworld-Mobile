import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class PlayerModel {
    constructor(scene) {
        // 1. Group to hold all parts
        this.group = new THREE.Group();
        this.group.position.y = 1; // Zameen se thoda upar taaki floor me na dhasse

        // 2. Body (Dark Gray Suit)
        const bodyGeo = new THREE.BoxGeometry(1, 2, 0.5);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        this.group.add(body);

        // 3. Head (Skin Tone)
        const headGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.3;
        head.castShadow = true;
        this.group.add(head);

        // 4. Eyes (Taaki pata chale player kis taraf dekh raha hai)
        const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.15, 1.4, 0.35);
        
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.15, 1.4, 0.35);
        
        this.group.add(leftEye, rightEye);

        scene.add(this.group);
    }

    updatePosition(moveData) {
        const speed = 0.25; // Movement speed
        
        // 1. Update Position
        this.group.position.x += moveData.x * speed;
        this.group.position.z += moveData.y * speed;

        // 2. Update Rotation (Player ko movement ki taraf face karwana)
        if (Math.abs(moveData.x) > 0.1 || Math.abs(moveData.y) > 0.1) {
            // Angle calculate karna based on joystick input
            const angle = Math.atan2(moveData.x, moveData.y);
            this.group.rotation.y = angle;
        }
    }
}
