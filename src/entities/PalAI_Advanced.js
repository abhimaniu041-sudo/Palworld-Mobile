// Game: Palworld Mobile - Smart Pal AI
export const PalAI = {
    update(pal, delta) {
        if (!pal.stats || pal.stats.hp <= 0) return;

        // Simple State Machine
        if (!pal.aiState) pal.aiState = 'WANDER';

        if (pal.aiState === 'WANDER') {
            this.wander(pal);
        }
    },

    wander(pal) {
        // Agar target nahi hai ya pahunch gaye, toh naya target lo
        if (!pal.targetPos || pal.mesh.position.distanceTo(pal.targetPos) < 1) {
            pal.targetPos = {
                x: pal.mesh.position.x + (Math.random() - 0.5) * 20,
                z: pal.mesh.position.z + (Math.random() - 0.5) * 20
            };
        }

        // Move towards target
        const dx = pal.targetPos.x - pal.mesh.position.x;
        const dz = pal.targetPos.z - pal.mesh.position.z;
        pal.mesh.position.x += dx * 0.01;
        pal.mesh.position.z += dz * 0.01;
        
        // Face the direction of movement
        pal.mesh.lookAt(pal.targetPos.x, 1, pal.targetPos.z);
    }
};
