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

export interface Trade {
  has: string
  wants: string
}

export class TrainCar {
  type: CarType

  front?: TrainCar
  rear?: TrainCar

  trades: Trade[]

  human: Human

  constructor(type: CarType = CarType.ObservationLookout, trades: Trade[], name: string) {
    this.type = type
    this.trades = trades

    this.human = new Human(name, trades[0])
  }

  hasTrade(item: String): boolean {
    return !!this.trades.find(t => t.wants === item)
  }

  bubbles(): UIPosition[] {
    const data = this.media()
    return data.bubbles || []
  }

  media(): CacheEntry {
    return (window as any).cache[this.type.valueOf()]
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
    const backupCycle = this.generateTradeCycle(language)
    cycle.concat(backupCycle.slice(0, 2))

    var cars: TrainCar[] = []

    const humans = _.groupBy(_.shuffle(people), _.property("room"))

    let lastType: CarType | undefined
    let usedSoundRoom = false

    while (cycle.length > 0) {
      let type: CarType = (lastType == CarType.ObservationTable ? CarType.ObservationLookout : CarType.ObservationTable)

      if (cars.length > 0 && !usedSoundRoom && _.random(0, cycle.length) === 0) {
        usedSoundRoom = true
        type = CarType.Sound
      }

      lastType = type

      const car = new TrainCar(type, [cycle.shift()!], humans[type].shift()!.name)
      addCarToFront(cars, car)
    }

    return new Train(cars)
  }

  static generateTradeCycle(language: Language): (Trade[]) {
    let rooms = _.random(5, 8)

    let items: string[] = []
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

