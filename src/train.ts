import { CacheEntry } from "./preloadMedia";
import _ from 'lodash';
import { UIPosition, people } from "./data";
import { Human } from "./Human";
import Language from "./language";

export enum CarType {
  ObservationTable = "observation-table",
  ObservationLookout = "observation-lookout",
  Sound = "sound-room",
  Cafe = "cafe",
  Dining = "dining",
  Sleeper = "sleeper"
}

export interface Item {
  name: string
  color: string
}

export interface Trade {
  has: Item
  wants: Item
}

export class TrainCar {
  type: CarType
  mediaName: string

  front?: TrainCar
  rear?: TrainCar

  trades: Trade[]

  human: Human
  landscapeName: string

  constructor(type: CarType = CarType.ObservationLookout, trades: Trade[], name: string, landscape: string, mediaName: string) {
    this.type = type
    this.trades = trades

    this.human = new Human(name, trades[0])

    this.landscapeName = landscape
    this.mediaName = mediaName
  }

  hasTrade(item: Item): boolean {
    return !!this.trades.find(t => t.wants === item)
  }

  bubbles(): UIPosition[] {
    const data = this.media()
    return data.bubbles || []
  }

  eye(): UIPosition | undefined {
    const data = this.media()
    return data.eye || undefined
  }

  media(): CacheEntry {
    return (window as any).cache[this.mediaName]
  }

  landscape(): CacheEntry {
    return (window as any).cache[this.landscapeName]
  }
}

export class Train {
  cars: TrainCar[] = []

  static generate(language: Language) {
    const addCarToFront = (cars: TrainCar[], car: TrainCar) => {
      if (cars.length > 0) {
        cars[cars.length - 1].front = car;
        car.rear = cars[cars.length - 1];
      }
      cars.push(car)
    }

    const cycle = this.generateTradeCycle(language)
    var cars: TrainCar[] = []

    let landscapes: string[] = []
    for (let i = 1; i <= 16; i++) {
      landscapes.push("landscape" + i)
    }
    landscapes = _.shuffle(landscapes)

    const humans = _.groupBy(_.shuffle(people), _.property("room"))

    let lastType: CarType | undefined
    let usedSoundRoom = false

    while (cycle.length > 0) {
      let type: CarType
      do {
        type = _.sample([CarType.ObservationLookout, CarType.ObservationTable, CarType.Sleeper])!
      } while (type === lastType)

      lastType = type

      let lookoutKey = CarType.ObservationLookout.valueOf()
      let tableKey = CarType.ObservationTable.valueOf()
      let sleeperKey = CarType.Sleeper.valueOf()

      const carCounts = {
        [lookoutKey]: 5,
        [tableKey]: 3,
        [sleeperKey]: 5
      }

      const carMediaBuckets: { [name: string]: string[] } = {}
      carMediaBuckets[lookoutKey] = []
      carMediaBuckets[tableKey] = []
      carMediaBuckets[sleeperKey] = []

      for (let i = 1; i < 6; i++) {
        if (i < carCounts[lookoutKey]) {
          carMediaBuckets[lookoutKey].push("observation-lookout" + i)
        }

        if (i < carCounts[tableKey]) {
          carMediaBuckets[tableKey].push("observation-table" + i)
        }

        if (i < carCounts[sleeperKey]) {
          carMediaBuckets[sleeperKey].push("sleeper" + i)
        }
      }

      const bucketCopies = {
        [lookoutKey]: _.shuffle(carMediaBuckets[lookoutKey]),
        [tableKey]: _.shuffle(carMediaBuckets[tableKey]),
        [sleeperKey]: _.shuffle(carMediaBuckets[sleeperKey])
      }

      let mediaName = bucketCopies[type.valueOf()].shift()
      if (!mediaName) {
        bucketCopies[type.valueOf()] = _.shuffle(carMediaBuckets[type.valueOf()])
        mediaName = bucketCopies[type.valueOf()].shift()
      }

      const car = new TrainCar(
        type,
        [cycle.shift()!],
        humans[type].shift()!.name,
        landscapes.shift()!,
        mediaName!
      )

      addCarToFront(cars, car)
    }

    return new Train(cars)
  }

  static generateTradeCycle(language: Language): (Trade[]) {
    let rooms = _.random(5, 8)

    let items: Item[] = []
    for (let i = 0; i < rooms; i++) {
      items.push(language.item())
    }

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

