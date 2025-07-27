export interface NavigationPoint {
    id: string
    name: string
    icon: string
    scrollPosition: number
    description: string
    highlightRange: {
        start: number
        end: number
    }
}

export const navigationPoints: NavigationPoint[] = [
    {
        id: 'sofa',
        name: 'Sofa',
        icon: '🛋️',
        scrollPosition: 0.03,
        description: 'Comfort zone',
        highlightRange: { start: 0.01, end: 0.05 }
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        icon: '🔥',
        scrollPosition: 0.175,
        description: 'Warm and cozy',
        highlightRange: { start: 0.15, end: 0.20 }
    },
    {
        id: 'tv',
        name: 'TV',
        icon: '📺',
        scrollPosition: 0.35,
        description: 'Entertainment hub',
        highlightRange: { start: 0.30, end: 0.40 }
    },
    {
        id: 'bookshelf',
        name: 'Bookshelf',
        icon: '📚',
        scrollPosition: 0.625,
        description: 'Knowledge corner',
        highlightRange: { start: 0.60, end: 0.65 }
    }
] 