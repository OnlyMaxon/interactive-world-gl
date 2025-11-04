# Globe Explorer - Product Requirements Document

An interactive 3D globe visualization application that allows users to explore countries, filter locations, and view animated flight paths between selected destinations.

**Experience Qualities**:

1. **Fluid & Responsive** - Every interaction feels immediate and natural, with smooth 60fps animations and seamless transitions that guide the user's attention.
2. **Exploratory & Delightful** - The globe invites curiosity with auto-rotation, elegant flight path animations, and thoughtful micro-interactions that reward engagement.
3. **Clean & Focused** - Interface elements gracefully recede, letting the globe take center stage while providing powerful controls exactly when needed.

**Complexity Level**: Light Application (multiple features with optimized state management)
- Moderate feature set with country filtering, theme switching, zoom controls, and flight path animations
- Optimized architecture with separated concerns, custom hooks, and memoized components
- Persistent state management using Spark KV storage

## Essential Features

### Interactive Globe Visualization
- **Functionality**: 3D orthographic projection of Earth with country boundaries, auto-rotation, and direct manipulation
- **Purpose**: Provides an engaging, intuitive way to explore geographic data
- **Trigger**: Automatically loads on app start
- **Progression**: App loads → World data fetches → Globe renders with smooth fade-in → Auto-rotation begins → User can drag to manually rotate
- **Success criteria**: Globe renders smoothly at 60fps, all countries properly labeled, transitions feel natural, no jank during rotation or zoom

### Country Filtering System
- **Functionality**: Searchable country selector with multi-select capability and visual feedback
- **Purpose**: Helps users focus on specific regions and highlight countries of interest
- **Trigger**: Click filter button (mobile) or use sidebar panel (desktop)
- **Progression**: User opens filter → Types to search → Selects countries → Globe highlights selected countries → Labels adjust → Flight paths appear for 2+ selections
- **Success criteria**: Search is instant (<100ms), selections persist across sessions, visual distinction is clear, easy removal via badges

### Flight Path Animations
- **Functionality**: Animated arcs connecting selected countries along great circle routes with moving markers
- **Purpose**: Visualizes connections and distances between locations in an engaging way
- **Trigger**: Automatically appears when 2 or more countries are selected
- **Progression**: User selects multiple countries → Paths calculate great circle routes → Arcs fade in with dash animation → Markers travel along paths continuously → Paths update smoothly as globe rotates
- **Success criteria**: Paths follow geodesic curves accurately, animations are smooth (60fps), markers remain visible on front hemisphere, no performance degradation with multiple paths

### Zoom Controls
- **Functionality**: Programmatic and scroll-based zoom with scale limits and smooth transitions
- **Purpose**: Allows detailed country viewing without overwhelming interface
- **Trigger**: Mouse wheel, pinch gesture, or zoom buttons
- **Progression**: User scrolls/clicks → Globe smoothly scales → Labels adjust size → Zoom limits provide gentle resistance
- **Success criteria**: Zoom transitions are smooth (300ms), scale limits prevent over-zoom, labels remain readable at all scales

### Theme Toggle
- **Functionality**: Seamless dark/light mode switching with system preference detection
- **Purpose**: Comfortable viewing in any lighting condition
- **Trigger**: Click sun/moon icon in top-right
- **Progression**: User clicks toggle → Icon rotates → Theme transitions smoothly → All UI elements adapt → Preference persists in localStorage
- **Success criteria**: Transition is smooth (300ms), no flash of wrong theme, preference loads on app start, all colors remain accessible

### View Reset
- **Functionality**: Returns globe to initial rotation and zoom state
- **Purpose**: Provides quick way to return to starting view
- **Trigger**: Click reset button in zoom controls
- **Progression**: User clicks reset → Globe smoothly rotates to [0,0] → Scale returns to default → Auto-rotation resumes
- **Success criteria**: Animation is smooth (800ms), feels natural, doesn't disorient user

## Edge Case Handling

- **No countries selected**: Globe shows all countries in neutral color, filter panel prompts selection
- **Single country selected**: Country highlights, no flight paths, counter shows singular form
- **Many countries selected** (10+): Flight paths render efficiently using requestAnimationFrame, performance remains smooth
- **Small screens/mobile**: Filter panel becomes bottom sheet drawer, touch gestures work flawlessly
- **Slow network**: Loading skeleton displays while world data fetches, graceful error handling
- **Rapid interactions**: Throttled dimension updates (100ms), debounced search (150ms), stable event handlers prevent race conditions, animations queue properly
- **Zoom limits**: Gentle resistance feedback at min/max zoom levels (0.8x-2.5x radius)
- **Globe rotation during selection**: Paths update in real-time as globe rotates (60fps target)

## Design Direction

The design evokes premium geographic intelligence tools - sophisticated, modern, and professional. It balances rich data visualization with a minimalist interface where the globe is the undisputed hero element. Controls are present but unobtrusive, appearing with glassmorphic effects that suggest depth without cluttering the view. The aesthetic draws inspiration from NASA mission control interfaces and high-end mapping applications, feeling both cutting-edge and timeless.

## Color Selection

**Complementary color scheme** (oceanic blues contrasted with warm earth tones) that creates natural geographic context.

- **Primary Color**: Deep Ocean Blue `oklch(0.35 0.08 240)` - Represents water bodies and provides grounding context for landmasses
- **Secondary Colors**: 
  - Soft Earth `oklch(0.88 0.02 80)` - Warm neutral for land masses
  - Slate Gray `oklch(0.45 0.02 240)` - Professional tone for UI chrome
- **Accent Color**: Vibrant Coral `oklch(0.68 0.18 25)` - Draws attention to selected countries, flight paths, and interactive elements
- **Foreground/Background Pairings**:
  - Background Light `oklch(0.98 0 0)`: Foreground Dark Navy `oklch(0.25 0.05 240)` - Ratio 13.8:1 ✓
  - Card White `oklch(1 0 0)`: Text Dark Navy `oklch(0.25 0.05 240)` - Ratio 14.2:1 ✓
  - Primary Blue `oklch(0.35 0.08 240)`: White text `oklch(1 0 0)` - Ratio 8.1:1 ✓
  - Accent Coral `oklch(0.68 0.18 25)`: Dark Navy text `oklch(0.25 0.05 240)` - Ratio 6.2:1 ✓
  - Muted Gray `oklch(0.94 0.01 240)`: Muted text `oklch(0.55 0.03 240)` - Ratio 4.8:1 ✓

## Font Selection

**Inter** for its geometric precision and excellent legibility at all scales, with a professional, modern character that suits geographic visualization.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold / 24px / -0.02em letter spacing / line-height 1.2
  - Body (UI Labels): Inter Medium / 14px / normal spacing / line-height 1.5
  - Small (Counts, Meta): Inter Medium / 12px / normal spacing / line-height 1.4
  - Country Labels (Dynamic): Inter Medium-SemiBold / 8-16px (scale-dependent) / tight spacing
  - Button Text: Inter SemiBold / 14px / normal spacing

## Animations

Animations serve functional purposes while adding moments of delight. Motion follows physics-inspired easing for natural feel.

- **Purposeful Meaning**: Auto-rotation suggests exploration, flight path animations show movement and connection, UI transitions provide spatial continuity
- **Hierarchy of Movement**: 
  1. Globe rotation (continuous, gentle)
  2. Flight path markers (rhythmic, eye-catching)
  3. Country highlights (immediate, responsive)
  4. UI panel transitions (smooth, unobtrusive)
  5. Theme transitions (elegant, comprehensive)

**Key Animations**:
- **Auto-rotation**: 0.3° per 40ms (optimized for 60fps), infinite loop, stops on user interaction
- **Zoom transitions**: Immediate feedback with direct scale manipulation
- **View reset**: 800ms, smooth D3 tween interpolation
- **Flight path draw**: 2000ms, easeQuadInOut
- **Marker movement**: 3s loop per path, staggered by 300ms
- **Panel entry**: 400ms, easeOut with stagger
- **Theme switch**: 300ms, all elements
- **Counter animation**: Spring physics, stiffness: 100, damping: 30

## Component Selection

**Architecture**: Separation of concerns with custom hooks, memoized components, and optimized D3 integration

- **Custom Hooks**:
  - `useGlobeData` - Fetches and caches world topology data
  - `useDimensions` - ResizeObserver-based responsive sizing
  - `useKV` - Persistent state for selected countries
  - `useIsMobile` - Responsive layout detection

- **Core Components**:
  - `Globe` (forwardRef) - D3-powered SVG globe with imperative handle
  - `FilterPanel` (memo) - Searchable country selector with badges
  - `ZoomControls` (memo) - Grouped zoom buttons with reset
  - `ThemeToggle` (memo) - Animated theme switcher
  - `AnimatedCounter` (framer-motion) - Spring-based number animations
  - `GlobeLoader` - Skeleton loader for data fetch

- **shadcn Components Used**:
  - `Card` - Filter panel container
  - `Button` - All interactive controls  
  - `Input` - Country search field
  - `Badge` - Selected country chips
  - `ScrollArea` - Country list scrolling
  - `Sheet` - Mobile filter drawer
  - `Skeleton` - Loading states

- **Utility Functions**:
  - `globe-utils.ts` - D3 helpers (interpolation, path generation, visibility)
  - `constants.ts` - Country list data

- **Component States**:
  - Buttons: default, hover (scale 1.05), active, disabled
  - Countries: neutral, hover (accent), selected (bright accent)
  - Filter items: default, hover (accent/10), selected (accent/20)
  - Flight paths: hidden, animating-in, visible, pulsing markers

- **Icons**: Phosphor Icons with bold weight
  - `GlobeHemisphereWest` (rotating) - App branding
  - `FunnelSimple` - Filter trigger
  - `Plus/Minus` - Zoom controls
  - `ArrowsClockwise` - Reset view
  - `Sun/Moon` - Theme toggle
  - `MagnifyingGlass` - Search indicator
  - `X` - Remove badges

- **Spacing**: Tailwind spacing scale
  - Container padding: `p-4` (16px)
  - Component gaps: `gap-4` (16px)
  - UI element gaps: `gap-2` to `gap-3` (8-12px)
  - Page margins: `6` (24px) from edges
  - Touch targets: minimum 44x44px

- **Mobile Adaptations**:
  - Filter panel → Sheet drawer from left
  - Larger touch targets for all buttons (44x44px minimum)
  - Stacked layout for controls in constrained space
  - Optimized performance for touch interactions

## Performance Optimizations

- **React.memo** on FilterPanel, ZoomControls, ThemeToggle, CountryButton to prevent unnecessary re-renders
- **useCallback** for all event handlers to stabilize references
- **useMemo** for expensive computations (country filtering, GeoJSON conversion, radius calculations)
- **Debounced search** (150ms) in filter panel for smooth typing experience
- **Throttled ResizeObserver** (100ms) to limit dimension update frequency
- **Cached world data** in module scope to prevent redundant network requests
- **Single Promise pattern** for world data fetch to prevent duplicate requests
- **RequestAnimationFrame** for flight path marker animations (60fps target)
- **D3 data joins** for efficient DOM updates
- **Lazy GeoJSON** conversion only when world data loads
- **Cleanup functions** for all timers, intervals, animation frames, and observers
- **Vector-effect: non-scaling-stroke** for consistent SVG rendering
- **Will-change: transform** on SVG for GPU acceleration
- **Transform: translateZ(0)** for hardware acceleration
- **Touch-action: none** to prevent default touch behaviors
- **User-select: none** to prevent text selection during drag
- **Disabled double-click zoom** to prevent accidental zoom-ins
- **Optimized zoom controls** that directly manipulate projection instead of D3 zoom behavior
- **Smooth reset animation** using D3 tweening for natural rotation transitions
