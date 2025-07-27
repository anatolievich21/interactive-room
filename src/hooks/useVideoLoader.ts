import { useState, useEffect } from 'react'

interface VideoLoaderState {
    isLoading: boolean
    progress: number
    error: string | null
    isReady: boolean
}

export function useVideoLoader(videoUrls: string[]) {
    const [state, setState] = useState<VideoLoaderState>({
        isLoading: true,
        progress: 0,
        error: null,
        isReady: false
    })

    useEffect(() => {
        let loadedCount = 0
        const totalVideos = videoUrls.length

        const loadVideo = (url: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                const video = document.createElement('video')
                video.preload = 'metadata'

                video.onloadedmetadata = () => {
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
                    reject(new Error(`Failed to load video: ${url}`))
                }

                video.src = url
            })
        }

        const loadAllVideos = async () => {
            try {
                await Promise.all(videoUrls.map(loadVideo))
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                }))
            }
        }

        loadAllVideos()
    }, [videoUrls])

    return state
} 