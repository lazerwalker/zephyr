export interface Media {
  name: string
  text?: string
  noAudio?: boolean
  hasBg?: boolean
  ignore?: boolean
}

const data: Media[] = [
  {
    name: "title",
    ignore: true
  },
  {
    name: "headphones",
    text: "this experience requires sound.",
    noAudio: true
  },
  {
    name: "bed",
  },
  {
    name: "shower",
    hasBg: true
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