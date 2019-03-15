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

  // This default exists because this is a jam game and I'm too lazy to make TypeScript properly happy
  constructor(type: CarType = CarType.ObservationLookout) {
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
    const addCarToFront = (cars: TrainCar[], car: TrainCar) => {
      if (cars.length > 0) {
        cars[cars.length - 1].front = car;
        car.rear = cars[cars.length - 1];
      }
      cars.push(car)
    }

    var cars: TrainCar[] = []
    addCarToFront(cars, new TrainCar(CarType.ObservationLookout))
    addCarToFront(cars, new TrainCar(CarType.ObservationTable))

    return new Train(cars)
  }

  constructor(cars: TrainCar[]) {
    this.cars = cars
  }
}

