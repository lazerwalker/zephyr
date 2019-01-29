export interface Media {
  name: string
  text?: string
  textPos?: number;
  noAudio?: boolean
}

const data: Media[] = [
  {
    name: "headphones",
    text: "This experience requires sound.<br/>Headphones are recommended.",
    textPos: 10,
    noAudio: true
  },
  {
    name: "bed",
  },
  {
    name: "shower",
  },
  {
    name: "street",
  },
  {
    name: "parks",
  },
  {
    name: "plaque",
  },
  {
    name: "garbagedump"
  },
  {
    name: "slide",
  },
  {
    name: "bench",
  },
  {
    name: "fountain",
  },
  {
    name: "drugdealers",
  },
  {
    name: "dolores",
  },
  {
    name: "urethra",
  },
  {
    name: "forest",
  },
  {
    name: "forest2",
  },
  {
    name: "canal",
  },
  {
    name: "slidetop",
  },
  {
    name: "poem",
  }
]

export default data