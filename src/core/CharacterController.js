// Game: Palworld Mobile - Character Controller

export class CharacterController {
    constructor(name) {
        this.name = name;
        this.stats = {
            hp: 100,
            stamina: 100,
            hunger: 100,
            speed: 5.0
        };
        this.position = { x: 0, y: 0, z: 0 };
    }

    // Movement with Stamina consumption
    move(direction, isSprinting) {
        let currentSpeed = this.stats.speed;
        
        if (isSprinting && this.stats.stamina > 0) {
            currentSpeed *= 2; // Sprint speed
            this.stats.stamina -= 5;
        } else {
            this.stats.stamina = Math.min(100, this.stats.stamina + 2); // Recover stamina
        }

        // Simulating 3D movement logic
        this.position.x += direction.x * currentSpeed;
        this.position.z += direction.z * currentSpeed;
        
        return `Position: ${this.position.x}, ${this.position.z} | Stamina: ${this.stats.stamina}`;
    }

    takeDamage(amount) {
        this.stats.hp -= amount;
        if (this.stats.hp <= 0) return "PLAYER_KNOCKED_OUT";
        return `HP: ${this.stats.hp}`;
    }
}
