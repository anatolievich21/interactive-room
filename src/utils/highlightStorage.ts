export interface HighlightPosition {
    id: string
    position: {
        x: number
        y: number
    }
}

const STORAGE_KEY = 'video_highlights_positions'

export const highlightStorage = {
    savePositions: (positions: HighlightPosition[]): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
        } catch (error) {
            console.error('Failed to save highlight positions:', error)
        }
    },

    loadPositions: (): HighlightPosition[] => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                return JSON.parse(saved)
            }
        } catch (error) {
            console.error('Failed to load highlight positions:', error)
        }
        return []
    },

    updatePosition: (highlightId: string, position: { x: number, y: number }): void => {
        try {
            const positions = highlightStorage.loadPositions()
            const existingIndex = positions.findIndex(p => p.id === highlightId)

            if (existingIndex >= 0) {
                positions[existingIndex].position = position
            } else {
                positions.push({ id: highlightId, position })
            }

            highlightStorage.savePositions(positions)
        } catch (error) {
            console.error('Failed to update highlight position:', error)
        }
    },

    getPosition: (highlightId: string): { x: number, y: number } | null => {
        try {
            const positions = highlightStorage.loadPositions()
            const found = positions.find(p => p.id === highlightId)
            return found ? found.position : null
        } catch (error) {
            console.error('Failed to get highlight position:', error)
            return null
        }
    },

    resetPositions: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (error) {
            console.error('Failed to reset highlight positions:', error)
        }
    }
} 