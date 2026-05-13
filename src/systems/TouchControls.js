export const TouchControls = {
    handleTouch(event) {
        // Mobile tap detection
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        
        console.log(`Input at: ${touchX}, ${touchY}`);
        // Yahan se hum Monster selection logic trigger karenge
    },
    
    init() {
        window.addEventListener('touchstart', this.handleTouch);
    }
};
