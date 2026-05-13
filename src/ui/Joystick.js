// Game: Palworld Mobile - Virtual Joystick
export const Joystick = {
    manager: null,
    moveData: { x: 0, y: 0 },

    init() {
        const container = document.createElement('div');
        container.id = 'joystick-container';
        container.style = `
            position: absolute; bottom: 50px; left: 50px;
            width: 120px; height: 120px;
            background: rgba(255, 0, 0, 0.1);
            border: 2px solid #ff0000;
            border-radius: 50%;
            touch-action: none;
            display: flex; align-items: center; justify-content: center;
        `;
        
        const stick = document.createElement('div');
        stick.style = `
            width: 50px; height: 50px;
            background: #ff0000;
            border-radius: 50%;
            box-shadow: 0 0 15px #ff0000;
        `;

        container.appendChild(stick);
        document.body.appendChild(container);

        // Simple Touch Logic for Movement
        container.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            this.moveData.x = (touch.clientX - centerX) / 60;
            this.moveData.y = (touch.clientY - centerY) / 60;

            // Limit vector to 1.0
            const dist = Math.sqrt(this.moveData.x**2 + this.moveData.y**2);
            if (dist > 1) {
                this.moveData.x /= dist;
                this.moveData.y /= dist;
            }
            
            stick.style.transform = `translate(${this.moveData.x * 30}px, ${this.moveData.y * 30}px)`;
        });

        container.addEventListener('touchend', () => {
            this.moveData = { x: 0, y: 0 };
            stick.style.transform = `translate(0,0)`;
        });
    }
};
