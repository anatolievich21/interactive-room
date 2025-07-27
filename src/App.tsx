import { useState } from 'react'
import { LoadingScreen } from './components/LoadingScreen'
import { useVideoLoader } from './hooks/useVideoLoader'
import './App.css'

function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)

  const videoUrls = [
    '/videos/start-scene.mp4',
    '/videos/main-scene.mp4'
  ]

  const { progress, error } = useVideoLoader(videoUrls)

  const handleLoadingComplete = () => {
    setIsLoadingComplete(true)
  }

  if (error) {
    return (
      <div className="error-screen">
        <h1>Loading Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!isLoadingComplete) {
    return (
      <LoadingScreen
        progress={progress}
        onComplete={handleLoadingComplete}
      />
    )
  }

  return (
    <div className="App">
      <h1>Cinematic Interface</h1>
      <p>Loading complete! Progress: {progress}%</p>
    </div>
  )
}

export default App
