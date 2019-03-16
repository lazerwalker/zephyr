import { CacheEntry } from "./preloadMedia";
import { Item, Trade } from "./train";
import _ from "lodash";

enum Animation {
  Angry = "angry",
  Behind = "towards",
  Towards = "behind",
  Neutral = "neutral",
  Wave = "wave",
  Happy = "happy"
}

export class Human {
  name: string
  voice: string

  desiredTrade: Trade

  canTrade: Boolean = true

  constructor(name: string, trade: Trade) {
    this.desiredTrade = trade
    this.name = name

    this.voice = _.sample(["Char3", "Char6"])!
  }

  trade(): Item | undefined {
    this.canTrade = false
    return this.desiredTrade.has
  }

  wave(): CacheEntry {
    return (window as any).cache[`${this.name}-${Animation.Wave.valueOf()}`]
  }

  angry(): CacheEntry {
    return (window as any).cache[`${this.name}-${Animation.Angry.valueOf()}`]
  }

  happy(): CacheEntry {
    return (window as any).cache[`${this.name}-${Animation.Happy.valueOf()}`]
  }

  behind(): CacheEntry {
    return (window as any).cache[`${this.name}-${Animation.Behind.valueOf()}`]
  }

  neutral(): CacheEntry {
    return (window as any).cache[`${this.name}-${Animation.Neutral.valueOf()}`]
  }

  towards(): CacheEntry {
    return (window as any).cache[`${this.name}-${Animation.Towards.valueOf()}`]
  }

}