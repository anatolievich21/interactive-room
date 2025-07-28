import { useState } from 'react'
import { LoadingScreen } from './components/scenes/LoadingScreen'
import { StartScene } from './components/scenes/StartScene'
import { MainScene } from './components/scenes/MainScene'
import { useVideoPreloader } from './hooks/useVideoPreloader'
import './App.css'

const RESOURCE_CONFIG = {
  videos: [
    '/videos/start-scene.mp4',
    '/videos/main-scene.mp4'
  ],
  images: [
    '/images/start-scene-blur.png'
  ],
  css: []
}

function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [isStartSceneComplete, setIsStartSceneComplete] = useState(false)
  const { progress, isReady } = useVideoPreloader(RESOURCE_CONFIG)

  const handleLoadingComplete = () => {
    if (isReady) {
      setIsLoadingComplete(true)
    }
  }

  const handleStartSceneComplete = () => {
    setIsStartSceneComplete(true)
  }

  if (!isLoadingComplete || !isReady) {
    return (
      <LoadingScreen
        progress={progress}
        onComplete={handleLoadingComplete}
      />
    )
  }

  if (!isStartSceneComplete) {
    return (
      <StartScene onStart={handleStartSceneComplete} />
    )
  }

  return <MainScene />
}

export default App
