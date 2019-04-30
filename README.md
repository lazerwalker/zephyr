# ｚｅｐｈｙｒ


<a href="readme.mp4"><img src="readme.gif" height="500" /></a>

<a href="https://lzrwlkr.me/zephyr"><img width="200" src="appstore.png" alt="Download on the iOS App Store"></a>

ｚｅｐｈｙｒ is a about the joy of exploring and getting lost in incomprehensible systems. The game's goal, and the written language it uses, are procedurally generated for each playthrough.

It was made in (more or less) 52 hours on [Train Jam 2019](http://trainjam.com). All game art is processed FMV (full-motion video) captured on the train. Sound design by [Ali Cedroni](https://twitter.com/AliCedroni), music by [Maize Wallin](https://twitter.com/MaizeWallin). A list of actors can be found in `src/components/CreditView.tsx`

This repository contains the whole game! This means a few things:

**The game itself** is a React app written in TypeScript, managed via [create-react-app](https://www.github.com/facebook/create-react-app). All game source lives in `/src`

**The iOS app** is a Swift app that renders a locally-stored copy of the game bundle within a full-screen web view, with some boilerplate to handle things like properly wiring up audio to native APIs. It's sort of a minimalist home-rolled version of something like [PhoneGap](https://phonegap.com).

**The Android app** doesn't really exist yet, but the `/android` folder contains some WIP jamming on an Android web view wrapper that mimics the iOS app's functionality.

## Web App

As mentioned, the bulk of the game is built in React and TypeScript, via create-react-app.

After cloning this repo, run `yarn install`. From there, `yarn start` will spin up a local server that live-compiles and updates the app. 

`yarn build` generates a production-ready copy of the game within the `public` folder.

**As a warning**: This game was made on a 52-hour game jam on a train. Other than help with audio and music, I made it entirely myself, which meant spending most of those 52 hours capturing and processing video footage. So the codebase is a bit of a mess, cobbled together on top of the bones of a [previous jam game](https://github.com/lazerwalker/gorli) made under similar time constrants. 

The majority of logic lives in App.tsx, with a few other procedural generation systems split out into their own files (train.ts, language.ts, etc). There's also a lot of fiddliness with components that trigger audio and video, since figuring out more stateless React-y ways to trigger rich media content was a bit of a problem without Internet access.

Which is to say: feel free to study and learn from this repo, but I'm not going to stake my reputation on it being the cleanest code I've ever written :)

## Video processing

In my local copy of this repo, I have a sibling folder that contains my raw unedited video files. `yarn convert` takes those and recompresses them into webm files and smaller mp4s. Webm files are in general smaller / more easily compressible, but aren't supported in Safari; as a native app, this project exclusively uses the mp4 copies of the videos, but the webm conversion is left in as an artifact from a [previous project](https://github.com/lazerwalker/gorli) that targetted desktop web as well.

## iOS App

If you run `yarn build` to generate a production copy of the web app, and then build the `TrainJam.xcodeproj` Xcode project within the `ios` folder, it'll automatically pull in that latest production build. Future improvements might include triggering a web build as part of the Xcode build step.

I use Fastlane to deploy this to Apple and to manage iTunes Connect metadata. `fastlane ios release` ships the latest version to Apple. The screenshots were manually created; I'd love to hear it if you have good suggestions for how to do automated UI testing / screenshot-taking when the UI elements are within an embedded WKWebView.

## Licensing

All of the media content (in the `public/audio` and `public/cinemagraphs` folders) is licensed under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0). More information is available at https://creativecommons.org/licenses/by-nc/4.0/.

All of the source code (read: everything else) is licensed under the MIT license. See the LICENSE file in this repo for more information.