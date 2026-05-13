// Game: Palworld Mobile - 3D Building System
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

export class BuildingManager {
    constructor(scene) {
        this.scene = scene;
        this.previewMesh = null;
        this.placedStructures = [];
        this.isBuildingMode = false;
    }

    // 1. Show Ghost Preview (Transparent structure before placing)
    showPreview(type, position) {
        if (this.previewMesh) this.scene.remove(this.previewMesh);

        const geometry = type === 'foundation' ? new THREE.BoxGeometry(4, 0.5, 4) : new THREE.BoxGeometry(0.5, 4, 4);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.4 
        });

        this.previewMesh = new THREE.Mesh(geometry, material);
        this.previewMesh.position.set(position.x, 0.25, position.z);
        this.scene.add(this.previewMesh);
        this.isBuildingMode = true;
    }

    // 2. Place the actual structure
    placeStructure() {
        if (!this.previewMesh) return;

        const finalMesh = this.previewMesh.clone();
        finalMesh.material = new THREE.MeshStandardMaterial({ color: 0x4d2902 }); // Wooden color
        finalMesh.material.opacity = 1;
        
        this.scene.add(finalMesh);
        this.placedStructures.push(finalMesh);
        
        // Remove preview and exit mode
        this.scene.remove(this.previewMesh);
        this.previewMesh = null;
        this.isBuildingMode = false;
        console.log("%c [BUILD] Structure Placed!", "color: #00ff00");
    }

    updatePreview(pos) {
        if (this.previewMesh) {
            this.previewMesh.position.set(pos.x, this.previewMesh.position.y, pos.z);
        }
    }
}
