import { CacheEntry } from "./preloadMedia";

enum Animation {
  Angry = "angry",
  Behind = "behind",
  Towards = "towards",
  Neutral = "neutral",
  Wave = "wave"
}

export class Human {
  name: string
  wants: string
  has: string

  canTrade: Boolean = true

  constructor(name: string, has: string, wants: string) {
    this.name = name
    this.wants = wants
    this.has = has
  }

  trade(): string | undefined {
    this.canTrade = false
    return this.has
  }

  wave(): CacheEntry {
    return (window as any).cache[`${this.name}/${Animation.Wave.valueOf()}`]
  }

  angry(): CacheEntry {
    return (window as any).cache[`${this.name}/${Animation.Angry.valueOf()}`]
  }

  behind(): CacheEntry {
    return (window as any).cache[`${this.name}/${Animation.Behind.valueOf()}`]
  }

  neutral(): CacheEntry {
    return (window as any).cache[`${this.name}/${Animation.Neutral.valueOf()}`]
  }

  towards(): CacheEntry {
    return (window as any).cache[`${this.name}/${Animation.Towards.valueOf()}`]
  }

}