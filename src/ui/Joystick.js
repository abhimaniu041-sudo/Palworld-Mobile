// Game: Palworld Mobile - Premium Virtual Joystick (Final Optimized)
export const Joystick = {
    manager: null,
    moveData: { x: 0, y: 0 },
    container: null,
    stick: null,

    init() {
        // 1. Create Outer Container (Joystick Base)
        this.container = document.createElement('div');
        this.container.id = 'joystick-container';
        Object.assign(this.container.style, {
            position: 'absolute',
            bottom: '50px',
            left: '50px',
            width: '120px',
            height: '120px',
            background: 'rgba(255, 0, 0, 0.1)', // Transparent red tint
            border: '2px solid #ff0000',
            borderRadius: '50%',
            touchAction: 'none', // Critical: Blocks browser scrolling
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000', // Ensure it's on top of 3D world
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)'
        });

        // 2. Create Inner Stick
        this.stick = document.createElement('div');
        this.stick.id = 'joystick-stick';
        Object.assign(this.stick.style, {
            width: '50px',
            height: '50px',
            background: '#ff0000',
            borderRadius: '50%',
            boxShadow: '0 0 15px #ff0000',
            transition: 'transform 0.1s ease-out'
        });

        this.container.appendChild(this.stick);
        document.body.appendChild(this.container);

        // 3. Touch Event Listeners
        this.container.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
        this.container.addEventListener('touchend', () => this.resetJoystick());
    },

    handleMove(e) {
        e.preventDefault(); // Stop page scrolling while moving joystick
        const touch = e.touches[0];
        const rect = this.container.getBoundingClientRect();
        
        // Calculate Center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate Offset (Normalized -1 to 1)
        const limit = 60; // Max drag radius
        let deltaX = touch.clientX - centerX;
        let deltaY = touch.clientY - centerY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > limit) {
            deltaX = (deltaX / distance) * limit;
            deltaY = (deltaY / distance) * limit;
        }

        // Store Normalized Move Data (-1.0 to 1.0)
        this.moveData.x = deltaX / limit;
        this.moveData.y = deltaY / limit;

        // Visual Update (Moving the red stick)
        this.stick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    },

    resetJoystick() {
        this.moveData = { x: 0, y: 0 };
        this.stick.style.transform = `translate(0, 0)`;
    }
};
