import { useState, useEffect, useRef } from 'react'

interface PreloaderState {
    isLoading: boolean
    progress: number
    isReady: boolean
    loadedResources: string[]
}

interface ResourceConfig {
    videos: string[]
    images: string[]
    css: string[]
}

export function useVideoPreloader(resourceConfig: ResourceConfig) {
    const [state, setState] = useState<PreloaderState>({
        isLoading: true,
        progress: 0,
        isReady: false,
        loadedResources: []
    })

    const hasLoaded = useRef(false)

    useEffect(() => {
        if (hasLoaded.current) return

        hasLoaded.current = true
        let loadedCount = 0
        const totalResources = resourceConfig.videos.length + resourceConfig.images.length + resourceConfig.css.length

        const preloadVideo = (url: string): Promise<void> => {
            return new Promise((resolve) => {
                const video = document.createElement('video')
                video.preload = 'auto'
                video.muted = true

                video.oncanplaythrough = () => {
                    loadedCount++
                    const progress = (loadedCount / totalResources) * 100

                    setState(prev => ({
                        ...prev,
                        progress,
                        loadedResources: [...prev.loadedResources, url]
                    }))

                    if (loadedCount === totalResources) {
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
                    const progress = (loadedCount / totalResources) * 100

                    setState(prev => ({
                        ...prev,
                        progress,
                        loadedResources: [...prev.loadedResources, url]
                    }))

                    if (loadedCount === totalResources) {
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

        const preloadImage = (url: string): Promise<void> => {
            return new Promise((resolve) => {
                const img = new Image()

                img.onload = () => {
                    loadedCount++
                    const progress = (loadedCount / totalResources) * 100

                    setState(prev => ({
                        ...prev,
                        progress,
                        loadedResources: [...prev.loadedResources, url]
                    }))

                    if (loadedCount === totalResources) {
                        setState(prev => ({
                            ...prev,
                            isLoading: false,
                            isReady: true
                        }))
                    }

                    resolve()
                }

                img.onerror = () => {
                    loadedCount++
                    const progress = (loadedCount / totalResources) * 100

                    setState(prev => ({
                        ...prev,
                        progress,
                        loadedResources: [...prev.loadedResources, url]
                    }))

                    if (loadedCount === totalResources) {
                        setState(prev => ({
                            ...prev,
                            isLoading: false,
                            isReady: true
                        }))
                    }

                    resolve()
                }

                img.src = url
            })
        }

        const preloadCSS = (url: string): Promise<void> => {
            return new Promise((resolve) => {
                const link = document.createElement('link')
                link.rel = 'stylesheet'
                link.href = url

                link.onload = () => {
                    loadedCount++
                    const progress = (loadedCount / totalResources) * 100

                    setState(prev => ({
                        ...prev,
                        progress,
                        loadedResources: [...prev.loadedResources, url]
                    }))

                    if (loadedCount === totalResources) {
                        setState(prev => ({
                            ...prev,
                            isLoading: false,
                            isReady: true
                        }))
                    }

                    resolve()
                }

                link.onerror = () => {
                    loadedCount++
                    const progress = (loadedCount / totalResources) * 100

                    setState(prev => ({
                        ...prev,
                        progress,
                        loadedResources: [...prev.loadedResources, url]
                    }))

                    if (loadedCount === totalResources) {
                        setState(prev => ({
                            ...prev,
                            isLoading: false,
                            isReady: true
                        }))
                    }

                    resolve()
                }

                document.head.appendChild(link)
            })
        }

        const preloadAllResources = async () => {
            const videoPromises = resourceConfig.videos.map(preloadVideo)
            const imagePromises = resourceConfig.images.map(preloadImage)
            const cssPromises = resourceConfig.css.map(preloadCSS)

            await Promise.all([...videoPromises, ...imagePromises, ...cssPromises])
        }

        preloadAllResources()
    }, [resourceConfig])

    return state
} 