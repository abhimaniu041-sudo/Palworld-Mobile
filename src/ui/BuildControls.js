// Game: Palworld Mobile - Building HUD
export const BuildControls = {
    render() {
        return `
            <div id="build-hud" style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); display: flex; gap: 20px;">
                <button onclick="window.GameInstance.confirmBuild()" style="width: 80px; height: 80px; border-radius: 50%; background: #00ff00; border: none; color: black; font-weight: bold; box-shadow: 0 0 15px #00ff00;">PLACE</button>
                <button onclick="window.GameInstance.cancelBuild()" style="width: 80px; height: 80px; border-radius: 50%; background: #ff0000; border: none; color: white; font-weight: bold; box-shadow: 0 0 15px #ff0000;">CANCEL</button>
            </div>
        `;
    }
};
