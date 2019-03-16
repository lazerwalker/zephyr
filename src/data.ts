import { CarType } from "./train";

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
  },
  {
    name: "sound-room",
    bubbles: [
      { x: "30%", y: "24%" },
      { x: "56%", y: "24%" },
      { x: "13%", y: "20%" }
    ]
  }
]

interface PersonRoom {
  name: string,
  room: CarType
}

export const people: PersonRoom[] = [
  {
    name: "Adina",
    room: CarType.ObservationLookout
  },
  {
    name: "Alexei",
    room: CarType.ObservationLookout
  },
  {
    name: "Ali",
    room: CarType.Sound
  },
  {
    name: "Ben",
    room: CarType.ObservationTable
  },
  {
    name: "ChrisSmith",
    room: CarType.ObservationTable
  },
  {
    name: "Jerry",
    room: CarType.ObservationTable
  },
  {
    name: "JoeBunda",
    room: CarType.ObservationLookout
  },
  {
    name: "Josie",
    room: CarType.ObservationLookout
  },
  {
    name: "Keir",
    room: CarType.ObservationLookout
  },
  {
    name: "Kristi",
    room: CarType.ObservationTable
  },
  {
    name: "Lenn",
    room: CarType.ObservationLookout
  },
  {
    name: "Maize",
    room: CarType.Sound
  },
  {
    name: "Miguel",
    room: CarType.ObservationTable
  },
  {
    name: "Plum",
    room: CarType.Sound
  },
  {
    name: "Robin",
    room: CarType.ObservationTable
  },
  {
    name: "Sergio",
    room: CarType.ObservationTable
  }
]

export const emotes = [
  "behind",
  "towards",
  "happy",
  "wave",
  "neutral",
  "angry"
]

people.forEach(p => {
  emotes.forEach(e => {
    data.push({
      name: `${p.name}-${e}`
    })
  })
})

export default data