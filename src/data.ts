export interface Media {
  name: string
  playCoord?: { x: number, y: number }
  nextCoord?: { x: number, y: number }
  text?: string
  textPos?: number;
}

const data: Media[] = [
  {
    name: "headphones",
    nextCoord: {
      x: 0, y: 0
    },
    text: "This experience requires sound.<br/>Headphones are recommended.",
    textPos: 10
  },
  {
    name: "bed",
    playCoord: {
      x: 20, y: 60
    },
    nextCoord: {
      x: 70, y: 60
    }
  },
  {
    name: "shower",
    playCoord: {
      x: 40, y: 70
    },
    nextCoord: {
      x: 70, y: 50
    }
  },
  {
    name: "street",
  },
  {
    name: "parks",
  },
  {
    name: "drugdealers",
  },
  {
    name: "turkey",
  },
  {
    name: "keepwalking",
  },
  {
    name: "dolores",
  },
  {
    name: "urethra",
  },
  {
    name: "google",
  },
  {
    name: "fork",
  },
  {
    name: "slide",
  },
  {
    name: "up",
  },
  {
    name: "stumble",
  },
  {
    name: "run",
  },
  {
    name: "canal",
  },
  {
    name: "across",
  },
  {
    name: "slidetop",
  },
]

export default data