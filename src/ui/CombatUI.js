// Game: Palworld Mobile - Premium Combat UI

export const CombatUI = {
    renderCombatButtons() {
        return `
            <div style="position: absolute; bottom: 50px; right: 50px; display: flex; flex-direction: column; gap: 15px;">
                <button id="atk-btn" style="
                    width: 70px; height: 70px; 
                    background: rgba(255, 0, 0, 0.2); 
                    border: 2px solid #ff0000; 
                    border-radius: 50%; 
                    color: white; font-weight: bold;
                    box-shadow: 0 0 10px #ff0000;
                    pointer-events: auto;
                ">ATK</button>
                
                <button id="dodge-btn" style="
                    width: 60px; height: 60px; 
                    background: rgba(255, 255, 255, 0.1); 
                    border: 2px solid #fff; 
                    border-radius: 50%; 
                    color: white; font-size: 10px;
                    pointer-events: auto;
                ">DODGE</button>
            </div>
        `;
    }
};
