import { useState, useEffect, useRef } from 'react'

interface VideoPreloaderState {
    isLoading: boolean
    progress: number
    isReady: boolean
}

export function useVideoPreloader(videoUrls: string[]) {
    const [state, setState] = useState<VideoPreloaderState>({
        isLoading: true,
        progress: 0,
        isReady: false
    })

    const hasLoaded = useRef(false)

    useEffect(() => {
        if (hasLoaded.current) return

        hasLoaded.current = true
        let loadedCount = 0
        const totalVideos = videoUrls.length

        const preloadVideo = (url: string): Promise<void> => {
            return new Promise((resolve) => {
                const video = document.createElement('video')
                video.preload = 'auto'

                video.oncanplaythrough = () => {
                    loadedCount++
                    const progress = (loadedCount / totalVideos) * 100

                    setState(prev => ({
                        ...prev,
                        progress
                    }))

                    if (loadedCount === totalVideos) {
                        setState(prev => ({
                            ...prev,
                            isLoading: false,
                            isReady: true
                        }))
                    }

                    resolve()
                }

                video.onerror = () => {
                    loadedCount++
                    const progress = (loadedCount / totalVideos) * 100

                    setState(prev => ({
                        ...prev,
                        progress
                    }))

                    if (loadedCount === totalVideos) {
                        setState(prev => ({
                            ...prev,
                            isLoading: false,
                            isReady: true
                        }))
                    }

                    resolve()
                }

                video.src = url
            })
        }

        const preloadAllVideos = async () => {
            await Promise.all(videoUrls.map(preloadVideo))
        }

        preloadAllVideos()
    }, [videoUrls])

    return state
} 