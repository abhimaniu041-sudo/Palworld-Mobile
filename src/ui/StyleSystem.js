// Game: Palworld Mobile - Premium Style Engine

export const StyleSystem = {
    colors: {
        background: "#050505",
        surface: "#121212",
        primary: "#FF0000", // Glowing Red
        secondary: "#333333",
        text: "#FFFFFF",
        stamina: "#00FF41"
    },
    
    effects: {
        glass: "backdrop-filter: blur(12px); background: rgba(20, 20, 20, 0.7);",
        glow: "box-shadow: 0 0 10px rgba(255, 0, 0, 0.6);",
        border: "1px solid rgba(255, 0, 0, 0.3);"
    },

    applyGlobalStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .premium-card {
                ${this.effects.glass}
                border: ${this.effects.border}
                color: ${this.colors.text};
                padding: 15px;
                border-radius: 12px;
            }
            .glow-text {
                color: ${this.colors.primary};
                text-shadow: 0 0 5px ${this.colors.primary};
            }
            button:active {
                transform: scale(0.95);
                filter: brightness(1.2);
            }
        `;
        document.head.appendChild(style);
    }
};
