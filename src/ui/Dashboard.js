// Game: Palworld Mobile - Premium Dashboard

export const DashboardUI = {
    renderMainDashboard(playerStats) {
        return `
            <div style="
                background: #000; 
                color: #fff; 
                padding: 20px; 
                font-family: 'Segoe UI', sans-serif;
                border: 2px solid #ff0000;
                box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
                border-radius: 15px;
            ">
                <h1 style="color: #ff0000; text-transform: uppercase; letter-spacing: 2px;">Palworld Mobile</h1>
                <hr style="border: 0.5px solid #333;">
                
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <div>
                        <p style="margin: 0; font-size: 12px; color: #888;">PLAYER HEALTH</p>
                        <div style="width: 150px; height: 8px; background: #222; border-radius: 4px;">
                            <div style="width: ${playerStats.hp}%; height: 100%; background: #ff0000;"></div>
                        </div>
                    </div>
                    <div>
                        <p style="margin: 0; font-size: 12px; color: #888;">STAMINA</p>
                        <div style="width: 150px; height: 8px; background: #222; border-radius: 4px;">
                            <div style="width: ${playerStats.stamina}%; height: 100%; background: #00ff00;"></div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button style="background: #111; color: #fff; border: 1px solid #ff0000; padding: 10px; border-radius: 5px;">INVENTORY</button>
                    <button style="background: #111; color: #fff; border: 1px solid #ff0000; padding: 10px; border-radius: 5px;">PALDECK</button>
                    <button style="background: #111; color: #fff; border: 1px solid #ff0000; padding: 10px; border-radius: 5px;">CRAFTING</button>
                    <button style="background: #ff0000; color: #000; border: none; padding: 10px; border-radius: 5px; font-weight: bold;">SAVE GAME</button>
                </div>
            </div>
        `;
    }
};
