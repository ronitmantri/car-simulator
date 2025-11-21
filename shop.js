import { CONSTANTS } from './constants.js';
import * as Storage from './storage.js';
import * as UI from './ui.js';

export class Shop {
    constructor() {
        this.cars = CONSTANTS.CAR_MODELS;
        this.coins = Storage.getCoins();
        this.unlockedCars = new Set(Storage.getUnlockedCars());
        this.selectedCar = Storage.getSelectedCar();

        this.onShopClose = null;
        this.onCarSelected = null;

        UI.initShopCloseButton(() => {
            if (this.onShopClose) this.onShopClose();
        });
    }

    renderShop() {
        this.coins = Storage.getCoins();
        this.unlockedCars = new Set(Storage.getUnlockedCars());
        this.selectedCar = Storage.getSelectedCar();

        UI.renderCarGrid(
            this.cars,
            this.unlockedCars,
            this.selectedCar,
            this.handlePurchase.bind(this),
            this.selectCar.bind(this)
        );
    }

    handlePurchase(carId) {
        const car = this.cars.find((c) => c.id === carId);
        if (!car) return;
        if (this.unlockedCars.has(carId)) return; // already unlocked
        if (this.coins < car.price) {
            alert('Not enough coins to buy this car.');
            return;
        }
        this.coins -= car.price;
        this.unlockedCars.add(carId);
        Storage.setCoins(this.coins);
        Storage.setUnlockedCars(Array.from(this.unlockedCars));
        this.renderShop();
    }

    selectCar(carId) {
        if (!this.unlockedCars.has(carId)) {
            alert('Car is locked. Please buy it first.');
            return;
        }
        this.selectedCar = carId;
        Storage.setSelectedCar(carId);
        this.renderShop();
        if (this.onCarSelected) this.onCarSelected(carId);
    }

    saveState() {
        Storage.setCoins(this.coins);
        Storage.setUnlockedCars(Array.from(this.unlockedCars));
        Storage.setSelectedCar(this.selectedCar);
    }
}
