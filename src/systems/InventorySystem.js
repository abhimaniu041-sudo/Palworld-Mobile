// Game: Palworld Mobile - Inventory & Weight System

export class InventorySystem {
    constructor(maxWeight) {
        this.items = [];
        this.maxWeight = maxWeight;
        this.currentWeight = 0;
    }

    addItem(itemId, name, weight, quantity) {
        const totalNewWeight = weight * quantity;

        if (this.currentWeight + totalNewWeight > this.maxWeight) {
            return "OVERWEIGHT_CANNOT_CARRY";
        }

        const existingItem = this.items.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.qty += quantity;
        } else {
            this.items.push({ id: itemId, name, weight, qty: quantity });
        }

        this.calculateWeight();
        return "ITEM_ADDED";
    }

    calculateWeight() {
        this.currentWeight = this.items.reduce((sum, item) => sum + (item.weight * item.qty), 0);
    }

    dropItem(itemId) {
        this.items = this.items.filter(i => i.id !== itemId);
        this.calculateWeight();
    }
}
