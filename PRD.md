# Planning Guide

**Experience Qualities**:


  - The app provides interactive globe visualization with zoom, pan, country filtering, and theme switching - making it mo
## Essential Features
### Interactive Globe Visualization

- **Progression**: App loads → Globe renders with all countries visible → Us


- **Trigger**: User c

### Zoom Controls
- **Purpose**: Allow users to see countries more clearly without overwhelming detail
- **Progression**: User scrolls/pinches → Globe smoothly zooms → Countries 

- **Progression**: App loads → Globe renders with all countries visible → User can drag to rotate → User can scroll to zoom
- **Success criteria**: Globe renders smoothly at 60fps, all countries are visible and properly labeled, zoom transitions are smooth

### Country Filtering System
- **Functionality**: Allow users to filter and highlight specific countries or regions from a searchable list
- **Purpose**: Helps users quickly find and focus on countries of interest
- **Trigger**: User clicks filter button in top-left corner
- **Progression**: User opens filter panel → Types country name or selects from list → Globe highlights selected countries → User can clear filters to reset
- **Success criteria**: Filter response is instant (<100ms), highlighted countries are visually distinct, clear affordance for removing filters

### Zoom Controls
- **Functionality**: Smooth zoom in/out on the globe with mouse wheel or touch gestures, limited to country-level detail
- **Purpose**: Allow users to see countries more clearly without overwhelming detail
- **Trigger**: Mouse wheel scroll or pinch gesture
- **Progression**: User scrolls/pinches → Globe smoothly zooms → Countries become more visible → Zoom stops at maximum country-level detail
- **Success criteria**: Zoom feels natural (200-300ms transitions), minimum zoom shows full globe, maximum zoom shows country details clearly

### Day/Night Theme Toggle
- **Zoom limits**: Graceful resistance feedback when reaching min/max zoom levels
- **Purpose**: Provides comfortable viewing in different lighting conditions and personal preference
## Design Direction
- **Progression**: User clicks toggle → Theme smoothly transitions → All UI elements adapt → Preference is saved
- **Success criteria**: Theme transition is smooth (300ms), all elements remain readable, preference persists across sessions

Complementary color scheme
- **Functionality**: Display animated flight paths connecting selected countries with smooth arc trajectories
- **Secondary Colors**: 
- **Trigger**: Automatically appears when 2 or more countries are selected
- **Progression**: User selects multiple countries → Flight paths appear with arc trajectories → Animated markers travel along paths → Paths fade in/out smoothly
- **Success criteria**: Paths follow great circle routes, animations are smooth (60fps), visual hierarchy keeps paths subtle but visible

## Edge Case Handling

- **No countries selected**: Globe shows all countries in neutral state with clear call-to-action in filter panel
## Font Selection
- **Small screens/mobile**: Globe remains interactive with touch gestures, filters adapt to drawer/modal on mobile
- **Zoom limits**: Graceful resistance feedback when reaching min/max zoom levels
- **Fast interactions**: Debounce rapid zoom/pan events to maintain smooth performance

## Design Direction

The design should evoke a sense of exploration and wonder, feeling both modern and timeless. It should balance the richness of geographic data with a clean, uncluttered interface. The globe itself is the hero element, with controls elegantly receding until needed. The aesthetic should feel sophisticated and professional - like a premium digital atlas or geographic intelligence tool.

## Color Selection

Complementary color scheme (opposite colors) with oceanic blues contrasted against warm earth tones for a natural geographic feel.

- **Primary Color**: Deep Ocean Blue (oklch(0.35 0.08 240)) - Communicates exploration, depth, and geographic context as the water/ocean color
  - Micro: Country highl
  - Soft Earth (oklch(0.88 0.02 80)) - Represents land masses with a subtle warm tone
  - Slate Gray (oklch(0.45 0.02 240)) - For UI elements and borders, maintains professional feel
- **Accent Color**: Vibrant Coral (oklch(0.68 0.18 25)) - For interactive elements, CTAs, and highlighted countries - creates energy and draws attention
- **Foreground/Background Pairings**:
  - Background Light (oklch(0.98 0 0)): Foreground Dark Navy (oklch(0.25 0.05 240)) - Ratio 13.8:1 ✓
  - Zoom controls remain bottom-right but slightly larger touch targets (44x44px min)
  - Touch gestures: drag to rotate, pinch to zoom, tap to select country






































































  - Zoom controls remain bottom-right but slightly larger touch targets (44x44px min)
  - Search input becomes full-width in mobile drawer
  - Touch gestures: drag to rotate, pinch to zoom, tap to select country
