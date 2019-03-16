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

let data: Media[] = [
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
  }
]

export const names = [
  "Adina",
  "Alexei",
  "Ali",
  "Ben",
  "ChrisSmith",
  "Jerry",
  "JoeBunda",
  "Josie",
  "Keir",
  "Kristi",
  "Lenn",
  "Maize",
  "Miguel",
  "Plum",
  "Robin",
  "Sergio"
]

export const emotes = [
  "behind",
  "towards",
  "happy",
  "wave",
  "neutral",
  "angry"
]

names.forEach(p => {
  emotes.forEach(e => {
    data.push({
      name: `${p}-${e}`
    })
  })
})

export default data