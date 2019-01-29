interface VideoSource {
  bgaudio: string
  dialog: string
  name: string
  video: string
}

export interface CacheEntry {
  name: string
  bgaudio: string | void
  dialog: string | void
  video: string | void
}

export default function preloadMedia(names: string[], onProgressUpdate: (percent: number) => void): Promise<{ [name: string]: CacheEntry }> {
  // TODO: This can be more granular than just tracking each level of the game 
  let completedCount = 0
  let totalCount = names.length
  function wrapPromise<T>(promise: Promise<T>): Promise<T> {
    return promise.then(foo => {
      completedCount += 1
      const percent = Math.floor((completedCount / totalCount) * 100)
      onProgressUpdate(percent)
      return foo
    })
  }

  const videoEl = document.createElement('video')
  const supportsWebm = (videoEl.canPlayType('video/webm') != '')
  const videoExtension = (supportsWebm ? "webm" : "mp4")

  let sources: VideoSource[] = names.map((n) => {
    return {
      bgaudio: `bgaudio/${n}.mp3`,
      dialog: `dialog/${n}.mp3`,
      name: n,
      video: `cinemagraphs/${n}.${videoExtension}`
    }
  })

  function fetchURL(url: string): Promise<string | void> {
    return fetch(url, { mode: "cors" })
      .then(r => r.blob())
      .then(URL.createObjectURL)
      .catch(e => console.log(`Couldn't load ${url}, ${e}`))
  }

  let promises: Promise<CacheEntry>[] = sources.map(source => {
    const sources = [source.bgaudio, source.dialog, source.video]
    return Promise.all(sources.map(fetchURL)).then(results => {
      return {
        bgaudio: results[0],
        dialog: results[1],
        name: source.name,
        video: results[2]
      }
    })
  })

  return Promise.all(promises.map(wrapPromise)).then(entries => {
    let map: { [name: string]: CacheEntry } = {}
    entries.forEach(e => {
      map[e.name] = e
    })
    return map
  })
}