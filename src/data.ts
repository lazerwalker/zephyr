export interface Media {
  name: string
  text?: string
  noAudio?: boolean
  hasBg?: boolean
  ignore?: boolean
}

const data: Media[] = [
  {
    name: "observation-table"
  },
  {
    name: "observation-lookout"
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
]

export default data