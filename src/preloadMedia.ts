import { Media } from "./data";

interface VideoSource {
  dialog: string
  name: string
  video: string
  videoType: string
}

export interface CacheEntry {
  name: string
  dialog: string | void
  video: string | void
  videoType: string
}

export default function preloadMedia(media: Media[], onProgressUpdate: (percent: number) => void): Promise<{ [name: string]: CacheEntry }> {
  // TODO: This can be more granular than just tracking each level of the game 
  let completedCount = 0
  let totalCount = media.length
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
  const videoType = `video/${videoExtension}`

  let sources: VideoSource[] = media.map((m) => {
    return {
      dialog: `dialog/${m.name}.mp3`,
      name: m.name,
      video: `cinemagraphs/${m.name}.${videoExtension}`,
      videoType
    }
  })

  function fetchURL(url: string): Promise<string | void> {
    return fetch(url, { mode: "cors" })
      .then(f => { console.log('fetched!', f); return f })
      .then(r => r.blob())
      .then(URL.createObjectURL)
      .catch(e => console.log(`Couldn't load ${url}, ${e}`))
  }

  let promises: Promise<CacheEntry>[] = sources.map(source => {
    const sources = [source.dialog, source.video]
    return Promise.all(sources.map(fetchURL)).then(results => {
      return {
        dialog: results[0],
        name: source.name,
        video: results[1],
        videoType: source.videoType
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