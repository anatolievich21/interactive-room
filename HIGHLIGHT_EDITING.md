# Highlight Position Editing

## How to use edit mode

### Switching modes
- Click the **edit icon** (✏️) next to the help button (?) in the top left corner
- Edit mode indicators will appear when enabled

### Moving highlights
1. Enable edit mode (edit icon)
2. Highlights will become draggable (cursor changes to grab)
3. Drag the highlight to the desired position
4. Position will be saved automatically in localStorage

### Visual indicators
- **Edit mode**: highlights have dashed borders and ✏️ icon
- **Dragging**: cursor changes to grabbing
- **Tooltip**: "Drag to move" appears on hover
- **Edit button**: active button has highlighting

### Edit mode indicators
- **Top left**: "Edit mode enabled" badge with pulse animation
- **Bottom center**: "Save" and "Reset" buttons
- All elements styled consistently with the project design

### Saving and resetting
- **Save**: positions are saved automatically (button for visual feedback)
- **Reset**: restores all highlights to their original positions and reloads the page

### Data saving
- Positions are automatically saved in browser's localStorage
- Saved positions are restored when the page is reloaded
- Data is stored locally for each browser

## Technical details

### Data structure
```typescript
interface VideoHighlight {
    id: string
    name: string
    icon: string
    highlightRange: { start: number, end: number }
    position: { x: number, y: number } // in percentages
}
```

### Components
- **EditModeToggle** - button to toggle edit mode
- **EditModeIndicators** - status badge and control buttons
- **VideoHighlights** - main highlight logic with edit support

### Limitations
- Highlights cannot go outside the screen bounds (5-95% of size)
- Positions are only saved locally
- Editing is only available on desktop

## Development

### Adding new highlights
1. Add an object to the `defaultVideoHighlights` array in `VideoHighlights.tsx`
2. Specify unique `id`, `name`, `icon` and time ranges
3. Set initial `position` coordinates

### Style customization
- Edit mode: `.video-highlight.edit-mode`
- Edit indicator: `.highlight-edit-indicator`
- Toggle button: `.edit-mode-toggle`
- Status badge: `.edit-mode-badge`
- Control buttons: `.edit-control-btn` 