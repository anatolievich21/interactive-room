import { useEffect, useRef, useState, useCallback } from 'react'
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

import { useNavigationData } from '../../../hooks/useNavigationData'

interface VideoHighlightsProps {
    currentProgress: number
    onObjectClick?: (objectId: string) => void
    isEditMode?: boolean
    onPositionChange?: (highlightId: string, position: { x: number, y: number }) => void
    isNavigating?: boolean
    navigationTarget?: number | null
}

export function VideoHighlights({
    currentProgress,
    onObjectClick,
    isEditMode = false,
    onPositionChange,
    isNavigating = false,
    navigationTarget = null
}: VideoHighlightsProps) {
    const highlightsRef = useRef<HTMLDivElement>(null)
    const highlightsMap = useRef<Map<string, HTMLDivElement>>(new Map())
    const [draggedHighlight, setDraggedHighlight] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const { videoHighlights: defaultHighlights, navigationPoints } = useNavigationData()
    const [videoHighlights, setVideoHighlights] = useState<VideoHighlight[]>(defaultHighlights)
    const containerRectRef = useRef<DOMRect | null>(null)

    useEffect(() => {
        setVideoHighlights(defaultHighlights)
    }, [defaultHighlights])

    const handleMouseDown = useCallback((e: React.MouseEvent, highlightId: string) => {
        if (!isEditMode) return

        e.preventDefault()
        e.stopPropagation()

        const highlightElement = highlightsMap.current.get(highlightId)
        if (!highlightElement || !highlightsRef.current) return

        containerRectRef.current = highlightsRef.current.getBoundingClientRect()

        const rect = highlightElement.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        setDraggedHighlight(highlightId)
        setDragOffset({ x: offsetX, y: offsetY })
    }, [isEditMode])

    const handleTouchStart = useCallback((e: React.TouchEvent, highlightId: string) => {
        if (!isEditMode) return

        e.preventDefault()
        e.stopPropagation()

        const highlightElement = highlightsMap.current.get(highlightId)
        if (!highlightElement || !highlightsRef.current) return

        containerRectRef.current = highlightsRef.current.getBoundingClientRect()

        const touch = e.touches[0]
        const rect = highlightElement.getBoundingClientRect()
        const offsetX = touch.clientX - rect.left
        const offsetY = touch.clientY - rect.top

        setDraggedHighlight(highlightId)
        setDragOffset({ x: offsetX, y: offsetY })
    }, [isEditMode])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!draggedHighlight || !isEditMode || !containerRectRef.current) return

        const highlightElement = highlightsMap.current.get(draggedHighlight)
        if (!highlightElement) return

        const containerRect = containerRectRef.current

        const x = e.clientX - containerRect.left - dragOffset.x
        const y = e.clientY - containerRect.top - dragOffset.y

        const clampedX = Math.max(0, Math.min(containerRect.width - 50, x))
        const clampedY = Math.max(0, Math.min(containerRect.height - 50, y))

        highlightElement.style.left = `${clampedX}px`
        highlightElement.style.top = `${clampedY}px`
    }, [draggedHighlight, isEditMode, dragOffset.x, dragOffset.y])

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!draggedHighlight || !isEditMode || !containerRectRef.current) return

        e.preventDefault()

        const highlightElement = highlightsMap.current.get(draggedHighlight)
        if (!highlightElement) return

        const touch = e.touches[0]
        const containerRect = containerRectRef.current

        const x = touch.clientX - containerRect.left - dragOffset.x
        const y = touch.clientY - containerRect.top - dragOffset.y

        const clampedX = Math.max(0, Math.min(containerRect.width - 50, x))
        const clampedY = Math.max(0, Math.min(containerRect.height - 50, y))

        highlightElement.style.left = `${clampedX}px`
        highlightElement.style.top = `${clampedY}px`
    }, [draggedHighlight, isEditMode, dragOffset.x, dragOffset.y])

    const handleMouseUp = useCallback(() => {
        if (draggedHighlight && containerRectRef.current) {
            const highlightElement = highlightsMap.current.get(draggedHighlight)
            if (highlightElement) {
                const left = parseFloat(highlightElement.style.left)
                const top = parseFloat(highlightElement.style.top)
                const containerRect = containerRectRef.current
                const xPercent = (left / containerRect.width) * 100
                const yPercent = (top / containerRect.height) * 100
                const newPosition = { x: xPercent, y: yPercent }

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

        setDraggedHighlight(null)
        containerRectRef.current = null
    }, [draggedHighlight, onPositionChange])

    useEffect(() => {
        if (isEditMode) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.addEventListener('touchmove', handleTouchMove)
            document.addEventListener('touchend', handleMouseUp)

            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
                document.removeEventListener('touchmove', handleTouchMove)
                document.removeEventListener('touchend', handleMouseUp)
            }
        }
    }, [isEditMode, handleMouseMove, handleMouseUp, handleTouchMove])

    useEffect(() => {
        if (!highlightsRef.current) return

        videoHighlights.forEach(highlight => {
            let isInRange = currentProgress >= highlight.highlightRange.start &&
                currentProgress <= highlight.highlightRange.end

            // При навігації показуємо тільки цільовий хайлайт
            if (isNavigating && navigationTarget !== null) {
                const targetPoint = navigationPoints.find(point =>
                    Math.abs(navigationTarget - point.scrollPosition) < 0.01
                )
                isInRange = targetPoint?.id === highlight.id
            }

            let highlightElement = highlightsMap.current.get(highlight.id)

            if (isNavigating && isInRange && !highlightElement) {

                const tl = gsap.timeline()
                tl.to({}, {
                    duration: 0.8,
                    onComplete: () => {
                        if (highlightsRef.current && !highlightsMap.current.get(highlight.id)) {
                            const newHighlightElement = document.createElement('div')
                            newHighlightElement.className = `video-highlight ${isEditMode ? 'edit-mode' : ''}`
                            newHighlightElement.style.left = `${highlight.position.x}%`
                            newHighlightElement.style.top = `${highlight.position.y}%`
                            newHighlightElement.innerHTML = `
                                <div class="highlight-icon">${highlight.icon}</div>
                                <div class="highlight-name">${highlight.name}</div>
                                <div class="highlight-pulse-ring"></div>
                                ${isEditMode ? '<div class="highlight-edit-indicator">✏️</div>' : ''}
                            `

                            if (onObjectClick && !isEditMode) {
                                newHighlightElement.style.cursor = 'pointer'
                                newHighlightElement.addEventListener('click', () => {
                                    onObjectClick(highlight.id)
                                })
                            }

                            if (isEditMode) {
                                newHighlightElement.style.cursor = 'grab'
                                newHighlightElement.addEventListener('mousedown', (e) => {
                                    handleMouseDown(e as unknown as React.MouseEvent, highlight.id)
                                })
                                newHighlightElement.addEventListener('touchstart', (e) => {
                                    handleTouchStart(e as unknown as React.TouchEvent, highlight.id)
                                })
                            }

                            highlightsRef.current.appendChild(newHighlightElement)
                            highlightsMap.current.set(highlight.id, newHighlightElement)

                            gsap.set(newHighlightElement, {
                                opacity: 0,
                                scale: 0.5,
                                rotation: -10
                            })

                            gsap.to(newHighlightElement, {
                                opacity: 1,
                                scale: 1,
                                rotation: 0,
                                duration: 1.2,
                                ease: 'back.out(1.7)',

                            })
                        }
                    }
                })
                return
            }

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
                        handleMouseDown(e as unknown as React.MouseEvent, highlight.id)
                    })
                    highlightElement.addEventListener('touchstart', (e) => {
                        handleTouchStart(e as unknown as React.TouchEvent, highlight.id)
                    })
                }

                highlightsRef.current?.appendChild(highlightElement)
                highlightsMap.current.set(highlight.id, highlightElement)

                gsap.set(highlightElement, {
                    opacity: 0,
                    scale: 0.5,
                    rotation: -10
                })

                gsap.to(highlightElement, {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: isNavigating ? 1.2 : 0.6,
                    ease: 'back.out(1.7)',
                    delay: isNavigating ? 0.8 : 0
                })
            } else if (!isInRange && highlightElement) {
                // При навігації приховуємо всі хайлайти крім цільового
                if (isNavigating && navigationTarget !== null) {
                    const targetPoint = navigationPoints.find(point =>
                        Math.abs(navigationTarget - point.scrollPosition) < 0.01
                    )
                    const isTarget = targetPoint?.id === highlight.id

                    if (!isTarget) {
                        gsap.to(highlightElement, {
                            opacity: 0,
                            scale: 0.5,
                            rotation: 10,
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => {
                                if (highlightElement && highlightElement.parentNode) {
                                    highlightElement.parentNode.removeChild(highlightElement)
                                    highlightsMap.current.delete(highlight.id)
                                }
                            }
                        })
                    }
                } else if (!isNavigating) {
                    // Звичайне видалення коли не навігуємо
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
            }
        })
    }, [currentProgress, isEditMode, videoHighlights, onObjectClick, handleMouseDown, isNavigating, navigationTarget, navigationPoints])

    useEffect(() => {
        highlightsMap.current.forEach((highlightElement, highlightId) => {
            highlightElement.className = `video-highlight ${isEditMode ? 'edit-mode' : ''}`

            const highlight = videoHighlights.find(h => h.id === highlightId)
            if (highlight) {
                highlightElement.innerHTML = `
                    <div class="highlight-icon">${highlight.icon}</div>
                    <div class="highlight-name">${highlight.name}</div>
                    <div class="highlight-pulse-ring"></div>
                    ${isEditMode ? '<div class="highlight-edit-indicator">✏️</div>' : ''}
                `
            }

            if (isEditMode) {
                highlightElement.style.cursor = 'grab'
                const newElement = highlightElement.cloneNode(true) as HTMLDivElement
                highlightElement.parentNode?.replaceChild(newElement, highlightElement)
                highlightsMap.current.set(highlightId, newElement)

                newElement.addEventListener('mousedown', (e) => {
                    handleMouseDown(e as unknown as React.MouseEvent, highlightId)
                })
            } else {
                highlightElement.style.cursor = onObjectClick ? 'pointer' : 'default'
                const newElement = highlightElement.cloneNode(true) as HTMLDivElement
                highlightElement.parentNode?.replaceChild(newElement, highlightElement)
                highlightsMap.current.set(highlightId, newElement)

                if (onObjectClick) {
                    newElement.addEventListener('click', () => {
                        onObjectClick(highlightId)
                    })
                }
            }
        })
    }, [isEditMode, onObjectClick, handleMouseDown, videoHighlights])

    useEffect(() => {
        const highlightsMapRef = highlightsMap.current
        return () => {
            highlightsMapRef.clear()
        }
    }, [])

    return (
        <div className="video-highlights" ref={highlightsRef} />
    )
} 