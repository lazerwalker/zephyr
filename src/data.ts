import { CarType } from "./train";

export interface Media {
  name: string
  bubbles?: UIPosition[]
  eye?: UIPosition
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
      { x: "65%", y: "21%" },
    ],
    eye: {
      x: "8%", y: "23%"
    }
  },
  {
    name: "observation-lookout",
    bubbles: [
      { x: "27%", y: "27%" },
    ],
    eye: {
      x: "80%", y: "30%"
    }
  },
  {
    name: "sleeper",
    bubbles: [
      { x: "75%", y: "27%" },
    ],
    eye: {
      x: "5%", y: "45%"
    }
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
    room: CarType.Sleeper
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
    room: CarType.Sleeper
  },
  {
    name: "Miguel",
    room: CarType.ObservationTable
  },
  {
    name: "Plum",
    room: CarType.Sleeper
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

for (let i = 1; i <= 16; i++) {
  data.push({
    name: `landscape${i}`
  })
}

export default data