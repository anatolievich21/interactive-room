import { useState } from 'react'
import { LoadingScreen } from './components/scenes/LoadingScreen'
import { StartScene } from './components/scenes/StartScene'
import { MainScene } from './components/scenes/MainScene'
import { useVideoPreloader } from './hooks/useVideoPreloader'
import './App.css'

const VIDEO_URLS = [
  '/videos/start-scene.mp4',
  '/videos/main-scene.mp4'
]

function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [isStartSceneComplete, setIsStartSceneComplete] = useState(false)
  const { progress } = useVideoPreloader(VIDEO_URLS)

  const handleLoadingComplete = () => {
    setIsLoadingComplete(true)
  }

  const handleStartSceneComplete = () => {
    setIsStartSceneComplete(true)
  }

  if (!isLoadingComplete) {
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
