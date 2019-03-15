import { CacheEntry } from "./preloadMedia";

enum CarType {
  ObservationTable = "observation-table",
  ObservationLookout = "observation-lookout",
  Cafe = "cafe",
  Dining = "dining",
  Sleeper = "sleeper"
}

export class TrainCar {
  type: CarType

  front?: TrainCar
  rear?: TrainCar

  constructor(type: CarType) {
    this.type = type
    console.log(type.valueOf())
  }

  media(): CacheEntry {
    return (window as any).cache[this.type.valueOf()]
  }
}

export class Train {
  cars: TrainCar[] = []

  static generate() {
    const addCarToRear = (cars: TrainCar[], car: TrainCar) => {
      if (cars.length > 0) {
        cars[cars.length - 1].rear = car;
        car.front = cars[cars.length - 1];
      }
      cars.push(car)
    }

    var cars: TrainCar[] = []
    for (let i = 0; i < 5; i++) {
      addCarToRear(cars, new TrainCar(CarType.ObservationTable))
    }

    return new Train(cars)
  }

  constructor(cars: TrainCar[]) {
    this.cars = cars
  }
}

