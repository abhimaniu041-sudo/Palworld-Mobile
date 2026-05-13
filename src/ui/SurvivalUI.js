// Game: Palworld Mobile - Survival HUD
export const SurvivalUI = {
    renderHUD(stats) {
        return `
            <div style="position: absolute; top: 20px; left: 20px; display: flex; gap: 15px;">
                <div class="stat-circle" style="
                    width: 50px; height: 50px; 
                    border-radius: 50%; 
                    background: conic-gradient(#ffa500 ${stats.hunger}%, #222 0);
                    border: 2px solid #ffa500;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 10px #ffa500;
                ">
                    <span style="color: white; font-size: 10px; font-weight: bold;">HUN</span>
                </div>

                <div class="stat-circle" style="
                    width: 50px; height: 50px; 
                    border-radius: 50%; 
                    background: conic-gradient(#00ff41 ${stats.stamina}%, #222 0);
                    border: 2px solid #00ff41;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 10px #00ff41;
                ">
                    <span style="color: white; font-size: 10px; font-weight: bold;">STA</span>
                </div>
            </div>
        `;
    }
};
