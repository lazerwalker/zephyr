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

  front?: TrainCar
  rear?: TrainCar

  trades: Trade[]

  human: Human
  landscapeName: string

  constructor(type: CarType = CarType.ObservationLookout, trades: Trade[], name: string, landscape: string) {
    this.type = type
    this.trades = trades

    this.human = new Human(name, trades[0])

    this.landscapeName = landscape
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
    return (window as any).cache[this.type.valueOf()]
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
      let type: CarType = (lastType == CarType.ObservationTable ? CarType.ObservationLookout : CarType.ObservationTable)

      if (cars.length > 0 && !usedSoundRoom && _.random(0, cycle.length) === 0) {
        usedSoundRoom = true
        type = CarType.Sleeper
      }

      lastType = type

      const car = new TrainCar(type, [cycle.shift()!], humans[type].shift()!.name, landscapes.shift()!)
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

