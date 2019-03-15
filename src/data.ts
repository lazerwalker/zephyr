export interface Media {
  name: string
  bubbles?: UIPosition[]
  noAudio?: boolean
  hasBg?: boolean
  ignore?: boolean
}

export interface UIPosition {
  x: string
  y: string
}

const data: Media[] = [
  {
    name: "observation-table",
    bubbles: [
      { x: "28%", y: "27%" },
      { x: "60%", y: "21%" },
      { x: "44%", y: "15%" }
    ]
  },
  {
    name: "observation-lookout",
    bubbles: [
      { x: "25%", y: "32%" },
      { x: "60%", y: "25%" },
      { x: "40%", y: "23%" }
    ]
  },
  {
    name: "Ben/angry"
  },
  {
    name: "Ben/neutral"
  },
  {
    name: "Ben/wave"
  },
  {
    name: "Ben/towards"
  },
  {
    name: "Ben/behind"
  },
  {
    name: "items/pen"
  }
]

export default data