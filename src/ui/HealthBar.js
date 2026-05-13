// Game: Palworld Mobile - Monster Health Bars

export const HealthBar = {
    create(initialHP) {
        const container = document.createElement('div');
        container.style = `
            position: absolute; width: 50px; height: 6px;
            background: #333; border: 1px solid #000;
            display: none; pointer-events: none;
        `;
        
        const fill = document.createElement('div');
        fill.style = `
            width: 100%; height: 100%;
            background: #ff0000; transition: width 0.2s;
        `;
        
        container.appendChild(fill);
        document.body.appendChild(container);
        
        return { container, fill, max: initialHP };
    },

    update(bar, currentHP, screenPos) {
        if (currentHP <= 0) {
            bar.container.style.display = 'none';
            return;
        }

        const percentage = (currentHP / bar.max) * 100;
        bar.fill.style.width = `${percentage}%`;
        
        // Positioning the bar over the monster's 3D position
        bar.container.style.display = 'block';
        bar.container.style.left = `${screenPos.x}px`;
        bar.container.style.top = `${screenPos.y - 40}px`; // Above the head
    }
};
