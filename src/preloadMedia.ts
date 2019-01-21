interface VideoSource {
  name: string
  webm: string
  mp4: string
  dialog: string
  bgaudio: string
}

export interface CacheEntry {
  name: string
  webm: string
  mp4: string
  dialog: string
  bgaudio: string
}

export default function preloadMedia(names: string[]): Promise<{ [name: string]: CacheEntry }> {
  let sources: VideoSource[] = names.map((n) => {
    return {
      name: n,
      bgaudio: `bgaudio/${n}.mp3`,
      dialog: `dialog/${n}.mp3`,
      webm: `cinemagraphs/${n}.webm`,
      mp4: `cinemagraphs/${n}.mp4`
    }
  })

  function fetchURL(url: string): Promise<string> {
    return fetch(url, { mode: "cors" })
      .then(r => r.blob())
      .then(URL.createObjectURL)
  }

  let promises: Promise<CacheEntry>[] = sources.map(source => {
    const sources = [source.bgaudio, source.dialog, source.mp4, source.webm]
    return Promise.all(sources.map(fetchURL)).then(results => {
      return {
        name: source.name,
        bgaudio: results[0],
        dialog: results[1],
        mp4: results[2],
        webm: results[3]
      }
    })
  })

  return Promise.all(promises).then(entries => {
    let map: { [name: string]: CacheEntry } = {}
    entries.forEach(e => {
      map[e.name] = e
    })
    return map
  })
}