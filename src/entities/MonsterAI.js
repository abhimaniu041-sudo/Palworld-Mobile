// Game: Palworld Mobile - Monster AI System

export const MonsterAI = {
    // Attack Types & Damage
    attackSkills: {
        FIRE_BREATH: { damage: 45, range: 10, effect: "Burn", cooldown: 5 },
        HYDRO_BLAST: { damage: 40, range: 15, effect: "Slow", cooldown: 4 },
        THUNDER_STRIKE: { damage: 55, range: 8, effect: "Stun", cooldown: 7 },
        GRASS_WHIP: { damage: 30, range: 5, effect: "LifeSteal", cooldown: 3 }
    },

    // AI Behavior Logic
    decideAction(distanceToPlayer, monsterHP) {
        if (monsterHP < 20) return "RETREAT"; // Health kam hone par bhagna
        if (distanceToPlayer < 5) return "MELEE_ATTACK";
        if (distanceToPlayer < 15) return "RANGED_SKILL";
        return "WANDER"; // Default ghumna
    },

    // Skill Execution
    useSkill(skillName, target) {
        const skill = this.attackSkills[skillName];
        console.log(`Using ${skillName}! Damage: ${skill.damage} on ${target}`);
        return { damage: skill.damage, status: skill.effect };
    }
};
