import { useState } from 'react'
import { LoadingScreen } from './components/LoadingScreen'
import { StartScene } from './components/StartScene'
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

  return (
    <div className="App">
      <h1>Cinematic Interface</h1>
      <p>Main scene will be here!</p>
    </div>
  )
}

export default App
