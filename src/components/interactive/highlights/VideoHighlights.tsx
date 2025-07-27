import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { highlightStorage } from '../../../utils/highlightStorage'
import './VideoHighlights.css'

interface VideoHighlight {
    id: string
    name: string
    icon: string
    highlightRange: {
        start: number
        end: number
    }
    position: {
        x: number
        y: number
    }
}

const defaultVideoHighlights: VideoHighlight[] = [
    {
        id: 'sofa',
        name: 'Sofa',
        icon: '🛋️',
        highlightRange: { start: 0.01, end: 0.05 },
        position: { x: 25, y: 70 }
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        icon: '🔥',
        highlightRange: { start: 0.15, end: 0.20 },
        position: { x: 75, y: 60 }
    },
    {
        id: 'tv',
        name: 'TV',
        icon: '📺',
        highlightRange: { start: 0.30, end: 0.40 },
        position: { x: 50, y: 30 }
    },
    {
        id: 'bookshelf',
        name: 'Bookshelf',
        icon: '📚',
        highlightRange: { start: 0.60, end: 0.65 },
        position: { x: 20, y: 40 }
    }
]

interface VideoHighlightsProps {
    currentProgress: number
    onObjectClick?: (objectId: string) => void
    isEditMode?: boolean
    onPositionChange?: (highlightId: string, position: { x: number, y: number }) => void
}

export function VideoHighlights({
    currentProgress,
    onObjectClick,
    isEditMode = false,
    onPositionChange
}: VideoHighlightsProps) {
    const highlightsRef = useRef<HTMLDivElement>(null)
    const highlightsMap = useRef<Map<string, HTMLDivElement>>(new Map())
    const [draggedHighlight, setDraggedHighlight] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [videoHighlights, setVideoHighlights] = useState<VideoHighlight[]>(defaultVideoHighlights)

    useEffect(() => {
        const savedPositions = highlightStorage.loadPositions()

        if (savedPositions.length > 0) {
            const updatedHighlights = defaultVideoHighlights.map(highlight => {
                const savedPosition = savedPositions.find(p => p.id === highlight.id)
                return savedPosition
                    ? { ...highlight, position: savedPosition.position }
                    : highlight
            })
            setVideoHighlights(updatedHighlights)
        }
    }, [])

    const handleMouseDown = (e: React.MouseEvent, highlightId: string) => {
        if (!isEditMode) return

        e.preventDefault()
        e.stopPropagation()

        const highlightElement = highlightsMap.current.get(highlightId)
        if (!highlightElement) return

        const rect = highlightElement.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        setDraggedHighlight(highlightId)
        setDragOffset({ x: offsetX, y: offsetY })
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!draggedHighlight || !isEditMode) return

        const highlightElement = highlightsMap.current.get(draggedHighlight)
        if (!highlightElement || !highlightsRef.current) return

        const containerRect = highlightsRef.current.getBoundingClientRect()
        const x = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100
        const y = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100

        const clampedX = Math.max(5, Math.min(95, x))
        const clampedY = Math.max(5, Math.min(95, y))

        highlightElement.style.left = `${clampedX}%`
        highlightElement.style.top = `${clampedY}%`

        const highlight = videoHighlights.find(h => h.id === draggedHighlight)
        if (highlight) {
            const newPosition = { x: clampedX, y: clampedY }

            highlightStorage.updatePosition(draggedHighlight, newPosition)

            setVideoHighlights(prev => prev.map(h =>
                h.id === draggedHighlight
                    ? { ...h, position: newPosition }
                    : h
            ))

            if (onPositionChange) {
                onPositionChange(draggedHighlight, newPosition)
            }
        }
    }

    const handleMouseUp = () => {
        setDraggedHighlight(null)
    }

    useEffect(() => {
        if (isEditMode) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)

            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [draggedHighlight, isEditMode, dragOffset])

    useEffect(() => {
        if (!highlightsRef.current) return

        videoHighlights.forEach(highlight => {
            const isInRange = currentProgress >= highlight.highlightRange.start &&
                currentProgress <= highlight.highlightRange.end

            let highlightElement = highlightsMap.current.get(highlight.id)

            if (isInRange && !highlightElement) {
                highlightElement = document.createElement('div')
                highlightElement.className = `video-highlight ${isEditMode ? 'edit-mode' : ''}`
                highlightElement.style.left = `${highlight.position.x}%`
                highlightElement.style.top = `${highlight.position.y}%`
                highlightElement.innerHTML = `
                        <div class="highlight-icon">${highlight.icon}</div>
                        <div class="highlight-name">${highlight.name}</div>
                        <div class="highlight-pulse-ring"></div>
                        ${isEditMode ? '<div class="highlight-edit-indicator">✏️</div>' : ''}
                    `

                if (onObjectClick && !isEditMode) {
                    highlightElement.style.cursor = 'pointer'
                    highlightElement.addEventListener('click', () => {
                        onObjectClick(highlight.id)
                    })
                }

                if (isEditMode) {
                    highlightElement.style.cursor = 'grab'
                    highlightElement.addEventListener('mousedown', (e) => {
                        handleMouseDown(e as any, highlight.id)
                    })
                }

                highlightsRef.current?.appendChild(highlightElement)
                highlightsMap.current.set(highlight.id, highlightElement)

                gsap.fromTo(highlightElement,
                    {
                        opacity: 0,
                        scale: 0.5,
                        rotation: -10
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        duration: 0.6,
                        ease: 'back.out(1.7)'
                    }
                )
            } else if (!isInRange && highlightElement) {
                gsap.to(highlightElement, {
                    opacity: 0,
                    scale: 0.5,
                    rotation: 10,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        if (highlightElement && highlightElement.parentNode) {
                            highlightElement.parentNode.removeChild(highlightElement)
                            highlightsMap.current.delete(highlight.id)
                        }
                    }
                })
            }
        })
    }, [currentProgress, isEditMode, videoHighlights])

    useEffect(() => {
        return () => {
            highlightsMap.current.clear()
        }
    }, [])

    return (
        <div className="video-highlights" ref={highlightsRef} />
    )
} 