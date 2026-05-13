// Game: Palworld Mobile - Premium Inventory & Crafting
export const InventoryMenu = {
    isOpen: false,

    toggle(inventoryData) {
        this.isOpen = !this.isOpen;
        const menu = document.getElementById('inventory-overlay');
        if (this.isOpen) {
            menu.style.display = 'block';
            this.render(inventoryData);
        } else {
            menu.style.display = 'none';
        }
    },

    render(data) {
        const container = document.getElementById('inventory-overlay');
        container.innerHTML = `
            <div style="
                width: 100%; height: 100%; 
                background: rgba(0,0,0,0.9); 
                backdrop-filter: blur(15px);
                color: white; padding: 20px;
                border: 2px solid #ff0000;
            ">
                <h2 style="color: #ff0000; text-shadow: 0 0 10px #ff0000;">ZENITH INVENTORY</h2>
                <hr style="border: 1px solid #333;">
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px;">
                    ${Object.entries(data.items).map(([id, item]) => `
                        <div style="background: #1a1a1a; padding: 10px; border: 1px solid #444; border-radius: 8px; text-align: center;">
                            <div style="font-size: 24px;">📦</div>
                            <div style="font-size: 10px; margin-top: 5px;">${item.name}</div>
                            <div style="color: #ff0000; font-weight: bold;">x${item.quantity}</div>
                        </div>
                    `).join('')}
                </div>

                <button onclick="window.GameInstance.toggleMenu()" style="
                    margin-top: 30px; width: 100%; padding: 15px;
                    background: #ff0000; color: white; border: none; font-weight: bold;
                ">CLOSE MENU</button>
            </div>
        `;
    }
};
