export const GameUI = {
    styles: {
        mainColor: "#FF0000",
        bgColor: "#0A0A0A",
        glass: "backdrop-filter: blur(15px); background: rgba(255, 0, 0, 0.1);"
    },

    getHatcheryOverlay(eggInfo) {
        return `
            <div style="border: 2px solid ${this.styles.mainColor}; padding: 20px; color: white; background: ${this.styles.bgColor};">
                <h2 style="color: ${this.styles.mainColor};">HATCHING...</h2>
                <p>Type: ${eggInfo.type}</p>
                <div style="width: 100%; height: 10px; background: #333;">
                    <div style="width: 45%; height: 100%; background: ${this.styles.mainColor};"></div>
                </div>
            </div>
        `;
    }
};
