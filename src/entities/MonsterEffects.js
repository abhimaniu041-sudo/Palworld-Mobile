// Game: Palworld Mobile - Visual Effects

export const MonsterEffects = {
    playHitEffect(mesh) {
        mesh.material.emissive.setHex(0xff0000);
        setTimeout(() => {
            mesh.material.emissive.setHex(0x000000);
        }, 150);
    },

    playDeathEffect(scene, mesh) {
        // Shrink and disappear animation
        const interval = setInterval(() => {
            mesh.scale.x -= 0.1;
            mesh.scale.y -= 0.1;
            mesh.scale.z -= 0.1;
            
            if (mesh.scale.x <= 0) {
                scene.remove(mesh);
                clearInterval(interval);
            }
        }, 50);
    }
};
