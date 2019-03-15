import { CacheEntry } from "./preloadMedia";
import * as _ from 'lodash'

enum CarType {
  ObservationTable = "observation-table",
  ObservationLookout = "observation-lookout",
  Cafe = "cafe",
  Dining = "dining",
  Sleeper = "sleeper"
}

export interface Trade {
  has: string
  wants: string
}

export class TrainCar {
  type: CarType

  front?: TrainCar
  rear?: TrainCar

  trades: Trade[]

  constructor(type: CarType = CarType.ObservationLookout, trades: Trade[]) {
    this.type = type
    this.trades = trades
  }

  hasTrade(item: String): boolean {
    return !!this.trades.find(t => t.wants === item)
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

    const cycle = this.generateTradeCycle()
    const backupCycle = this.generateTradeCycle()

    let tradeBuckets: Trade[][] = []
    var cars: TrainCar[] = []

    for (let i = 0; i < 4; i++) {
      let trades = [cycle.shift()]

      for (let j = 0; j < _.random(0, 2); j++) {
        trades.push(backupCycle.shift())
      }

      tradeBuckets.push((trades.filter(t => !_.isUndefined(t)) as Trade[]))
    }

    while (cycle.length > 0) {
      const next = cycle.shift()
      if (!next) { continue }
      tradeBuckets[_.random(0, tradeBuckets.length)].push(next)
    }

    for (let i = 0; i < 4; i++) {
      let type = (i % 2 === 0 ? CarType.ObservationLookout : CarType.ObservationTable)
      let bucket = tradeBuckets.shift()
      if (!bucket) { console.log("OOPS ran out of buckets"); continue; }
      addCarToFront(cars, new TrainCar(type, bucket))
    }

    return new Train(cars)
  }

  static generateTradeCycle(): (Trade[]) {
    const items = [
      "optimism",
      "a Unity programmer",
      "a USB key",
      "coffee",
      "a healthy snack"
    ]

    let complete = false

    let trades: Trade[] = []

    let shuffled = _.shuffle(items)
    for (let i = 0; i < shuffled.length; i++) {
      let has = shuffled[i]
      let wants = (i === shuffled.length - 1 ? shuffled[0] : shuffled[i + 1])
      trades.push({ has, wants })
    }

    return _.shuffle(trades)
  }

  constructor(cars: TrainCar[]) {
    this.cars = cars
  }
}

