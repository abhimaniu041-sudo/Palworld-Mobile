// Game: Palworld Mobile - Combat & Damage System

export const CombatSystem = {
    // Check if player is in range of a monster
    isTargetInRange(entityA, entityB, range) {
        const dx = entityA.position.x - entityB.position.x;
        const dz = entityA.position.z - entityB.position.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        return distance <= range;
    },

    // Apply Damage with a Red Flash effect logic
    applyDamage(target, amount) {
        target.stats.hp -= amount;
        console.log(`%c Damage! ${amount} HP lost.`, "color: #ff0000");
        
        if (target.stats.hp <= 0) {
            target.stats.hp = 0;
            return "KILLED";
        }
        return "ALIVE";
    }
};
