# Design Document: Add Routing for Map View

## Overview

This design implements client-side routing using React Router v6 to enable navigation between a landing page and a map view. The current application has a single-page structure with GSAP animations and a separate MapView component. This design will restructure the application into a multi-route architecture while preserving all existing functionality, animations, and state management.

The routing solution will:
- Split the current App.jsx into HomePage and MapPage components
- Configure React Router with BrowserRouter at the application entry point
- Update Navigation component to use React Router Link components
- Implement shared dark mode state across routes using React Context
- Add loading and error states for the map page's asynchronous operations
- Maintain all existing GSAP ScrollTrigger animations on the home page

### Key Design Decisions

1. **React Router v6**: Using the latest stable version for modern routing patterns with declarative route definitions
2. **Context API for Dark Mode**: Sharing dark mode state across routes without prop drilling
3. **Component Extraction**: Minimal refactoring to extract HomePage and MapPage from existing code
4. **Lazy Loading**: Not implementing code splitting initially to maintain simplicity
5. **Error Boundaries**: Using component-level error handling rather than route-level error boundaries

## Architecture

### Routing Structure

```
BrowserRouter (main.jsx)
  └── App (router component)
      ├── Route "/" → HomePage
      ├── Route "/map" → MapPage
      └── Route "*" → Navigate to "/"
```

### Component Hierarchy

```
main.jsx
  └── BrowserRouter
      └── DarkModeProvider
          └── App (router)
              ├── HomePage
              │   ├── Navigation
              │   ├── FloatingParticles
              │   ├── HeroSection
              │   ├── RoutePlannerSection
              │   ├── FeatureSection (×3)
              │   ├── FeaturesGridSection
              │   └── FooterSection
              └── MapPage
                  ├── Header
                  └── MapView
```

### State Management Flow

Dark mode state will be managed through React Context to avoid prop drilling across routes:

```
DarkModeContext
  ├── isDarkMode: boolean
  ├── setIsDarkMode: (value: boolean) => void
  └── Provider wraps entire app
```

Each route component will access dark mode state via `useDarkMode()` custom hook.

## Components and Interfaces

### 1. App Component (Router)

**File**: `src/App.jsx`

**Purpose**: Main routing component that defines application routes

**Implementation**:
```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
```

**Interface**: None (renders routes)

---

### 2. HomePage Component

**File**: `src/pages/HomePage.jsx`

**Purpose**: Landing page with all feature sections and GSAP animations

**Props**: None (uses context for dark mode)

**Implementation Strategy**:
- Extract all content from current App.jsx
- Preserve all GSAP ScrollTrigger setup
- Use `useDarkMode()` hook for dark mode state
- Maintain all existing refs and effects

**Key Responsibilities**:
- Initialize GSAP ScrollTrigger animations
- Manage scroll snap behavior
- Render all landing page sections
- Apply dark mode class to document element

---

### 3. MapPage Component

**File**: `src/pages/MapPage.jsx`

**Purpose**: Interactive map view with route visualization

**Props**: None

**State**:
```typescript
{
  routes: Array<Route> | null,
  routesLoading: boolean,
  routesError: string | null
}
```

**Hooks Used**:
- `useGeolocation()` - Get user's current location
- `useDarkMode()` - Access dark mode state
- `useEffect()` - Fetch routes on mount

**Implementation Flow**:
1. Call `useGeolocation()` to get user coordinates
2. If geolocation loading, show loading spinner
3. If geolocation error, show error message
4. Once coordinates available, fetch routes from API
5. If routes loading, show loading spinner
6. If routes error, show API error message
7. When both available, render MapView with data

**Loading States**:
```jsx
if (loading) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>Getting your location...</p>
    </div>
  )
}
```

**Error States**:
```jsx
if (error) {
  return (
    <div className="error-container">
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  )
}
```

---

### 4. Navigation Component Updates

**File**: `src/components/sections/Navigation.jsx`

**Changes Required**:
- Import `Link` from `react-router-dom`
- Replace anchor tags with Link components for route navigation
- Update `navLinks` array to include map route
- Use `useDarkMode()` hook instead of props

**Updated navLinks**:
```javascript
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Map', href: '/map' },
  { label: 'How it works', href: '/#route-planner' },
  { label: 'Features', href: '/#cleaner-routes' },
  { label: 'Support', href: '/#footer' },
]
```

**Link Implementation**:
```jsx
{navLinks.map((link) => {
  if (link.href.startsWith('/#')) {
    // Hash link for same-page navigation
    return (
      <button
        key={link.label}
        onClick={() => scrollToSection(link.href.substring(1))}
        className="nav-link"
      >
        {link.label}
      </button>
    )
  }
  // Route link for navigation
  return (
    <Link
      key={link.label}
      to={link.href}
      className="nav-link"
    >
      {link.label}
    </Link>
  )
})}
```

---

### 5. DarkModeContext

**File**: `src/contexts/DarkModeContext.jsx`

**Purpose**: Provide dark mode state to all components

**Implementation**:
```jsx
import { createContext, useContext, useState, useEffect } from 'react'

const DarkModeContext = createContext(null)

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider')
  }
  return context
}
```

**Interface**:
```typescript
interface DarkModeContextValue {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
}
```

---

### 6. Main Entry Point Updates

**File**: `src/main.jsx`

**Changes**:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DarkModeProvider } from './contexts/DarkModeContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

## Data Models

### Route Data Structure

The route data returned from the API follows this structure:

```typescript
interface Route {
  routeId: string
  polyline: Array<[number, number]>  // [longitude, latitude] pairs
  distance?: number
  duration?: number
  score?: number
}

interface RoutesResponse {
  routes: Route[]
}
```

### Geolocation Data Structure

The `useGeolocation` hook returns:

```typescript
interface GeolocationState {
  latitude: number | null
  longitude: number | null
  loading: boolean
  error: string | null
}
```

### Navigation Link Structure

```typescript
interface NavLink {
  label: string
  href: string  // Either route path ("/map") or hash ("#section")
}
```

### Dark Mode Context State

```typescript
interface DarkModeState {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Undefined Route Redirect

*For any* URL path that is not explicitly defined in the router configuration (not "/" or "/map"), navigating to that path should redirect the user to the home page at "/".

**Validates: Requirements 2.3**

### Property 2: All Routes Displayed on Map

*For any* array of route objects passed to the MapView component, all routes in the array should be added as layers to the map instance.

**Validates: Requirements 6.3**

### Example Tests

The following acceptance criteria are best validated through specific example tests rather than property-based tests:

**Router Configuration Examples**:
- Route "/" renders HomePage component (Requirement 2.1)
- Route "/map" renders MapPage component (Requirement 2.2)
- BrowserRouter wraps App in main.jsx (Requirement 7.1)

**HomePage Component Examples**:
- Renders Navigation component (Requirement 3.1)
- Renders HeroSection component (Requirement 3.2)
- Renders RoutePlannerSection component (Requirement 3.3)
- Renders three FeatureSection components (Requirement 3.4)
- Renders FeaturesGridSection component (Requirement 3.5)
- Renders FooterSection component (Requirement 3.6)
- Renders FloatingParticles component (Requirement 3.7)
- Dark mode toggle adds/removes 'dark' class (Requirement 3.9)

**MapPage Component Examples**:
- Shows loading indicator when geolocation is loading (Requirement 4.2)
- Shows error message when geolocation fails (Requirement 4.3)
- Fetches routes with mockPostData payload (Requirement 4.4)
- Shows loading indicator when routes are loading (Requirement 4.5)
- Shows error message when API fails (Requirement 4.6)
- Renders MapView with correct props when data is ready (Requirement 4.7)
- Renders Header component (Requirement 4.8)

**Navigation Component Examples**:
- Includes link to "/" (Requirement 5.1)
- Includes link to "/map" (Requirement 5.2)
- Link clicks update URL without page reload (Requirement 5.3)

**MapView Component Examples**:
- Accepts latitude, longitude, and routes props (Requirement 6.1)
- Initializes map centered on provided coordinates (Requirement 6.2)
- First route is styled blue, others gray (Requirement 6.4)
- Adds start and end markers from first route (Requirement 6.5)

**Hook and API Examples**:
- useGeolocation returns latitude, longitude, loading, error (Requirement 6.6)
- fetchRoutesData sends POST to correct endpoint (Requirement 6.7)

**Dependency Examples**:
- react-router-dom is in package.json dependencies (Requirement 1.1)
- react-router-dom version is 6 or higher (Requirement 1.2)

## Error Handling

### Geolocation Errors

**Error Scenarios**:
1. Browser doesn't support geolocation API
2. User denies location permission
3. Location acquisition timeout
4. Position unavailable

**Handling Strategy**:
- The `useGeolocation` hook captures all errors in the error state
- MapPage component displays user-friendly error messages
- Provide "Retry" button to attempt geolocation again
- Error messages should be specific to the failure reason

**Error UI**:
```jsx
<div className="error-container">
  <div className="error-icon">⚠️</div>
  <h2>Location Access Required</h2>
  <p>{error}</p>
  <button onClick={() => window.location.reload()}>
    Try Again
  </button>
</div>
```

### API Errors

**Error Scenarios**:
1. Network connection failure
2. API server not running (localhost:3300)
3. API returns non-200 status code
4. Invalid response format
5. Request timeout

**Handling Strategy**:
- Wrap API calls in try-catch blocks
- Display specific error messages based on error type
- Provide "Retry" button to attempt API call again
- Log errors to console for debugging

**Error UI**:
```jsx
<div className="error-container">
  <div className="error-icon">🔌</div>
  <h2>Unable to Load Routes</h2>
  <p>The route service is currently unavailable. Please ensure the API server is running.</p>
  <button onClick={retryFetchRoutes}>
    Retry
  </button>
</div>
```

### Route Not Found

**Handling Strategy**:
- Use catch-all route (`path="*"`) in router configuration
- Redirect to home page using `<Navigate to="/" replace />`
- No error message needed (silent redirect)

### Component Errors

**Handling Strategy**:
- MapView component handles missing props gracefully
- Check for null/undefined before rendering map
- GSAP animations wrapped in try-catch to prevent crashes
- Console warnings for development debugging

## Testing Strategy

### Unit Testing Approach

Unit tests will focus on specific examples, component rendering, and integration points. We'll use React Testing Library for component tests and Jest for utility function tests.

**Test Categories**:

1. **Router Configuration Tests**
   - Verify route paths render correct components
   - Test redirect behavior for undefined routes
   - Verify BrowserRouter wraps application

2. **Component Rendering Tests**
   - HomePage renders all expected child components
   - MapPage renders Header and MapView when data is ready
   - Navigation includes correct links

3. **State Management Tests**
   - DarkModeContext provides correct values
   - Dark mode toggle updates context state
   - Dark mode class applied to document element

4. **Loading and Error State Tests**
   - MapPage shows loading UI when geolocation is loading
   - MapPage shows error UI when geolocation fails
   - MapPage shows loading UI when routes are loading
   - MapPage shows error UI when API fails

5. **Integration Tests**
   - Navigation links change routes correctly
   - Dark mode persists across route changes
   - MapPage fetches routes with correct payload

### Property-Based Testing Approach

Property-based tests will verify universal behaviors across many generated inputs. We'll use `fast-check` library for JavaScript property-based testing.

**Property Test Configuration**:
- Minimum 100 iterations per test
- Each test tagged with feature name and property reference
- Use custom generators for route data and coordinates

**Property Tests**:

1. **Undefined Route Redirect Property**
   ```javascript
   // Feature: add-routing-for-map-view, Property 1: Undefined Route Redirect
   test('any undefined route redirects to home', () => {
     fc.assert(
       fc.property(
         fc.string().filter(s => s !== '/' && s !== '/map'),
         (path) => {
           // Navigate to random undefined path
           // Verify redirect to "/"
         }
       ),
       { numRuns: 100 }
     )
   })
   ```

2. **All Routes Displayed Property**
   ```javascript
   // Feature: add-routing-for-map-view, Property 2: All Routes Displayed
   test('all routes in array are added to map', () => {
     fc.assert(
       fc.property(
         fc.array(routeGenerator, { minLength: 1, maxLength: 10 }),
         (routes) => {
           // Render MapView with generated routes
           // Verify all routes are added as map layers
         }
       ),
       { numRuns: 100 }
     )
   })
   ```

**Custom Generators**:
```javascript
// Generator for route objects
const routeGenerator = fc.record({
  routeId: fc.string(),
  polyline: fc.array(
    fc.tuple(
      fc.float({ min: -180, max: 180 }), // longitude
      fc.float({ min: -90, max: 90 })    // latitude
    ),
    { minLength: 2, maxLength: 50 }
  )
})
```

### Testing Balance

- **Unit tests**: Focus on specific examples, edge cases, and component integration
- **Property tests**: Verify universal behaviors across many inputs
- **Manual tests**: Visual verification of animations, map rendering, and styling
- **E2E tests**: (Future) Full user flows with real browser automation

### Test File Organization

```
src/
  __tests__/
    App.test.jsx                    # Router configuration tests
    pages/
      HomePage.test.jsx             # HomePage component tests
      MapPage.test.jsx              # MapPage component tests
    components/
      Navigation.test.jsx           # Navigation component tests
    contexts/
      DarkModeContext.test.jsx      # Context tests
    properties/
      routing.property.test.js      # Property-based routing tests
      mapview.property.test.js      # Property-based MapView tests
```

## File Structure and Organization

### New Files to Create

```
src/
  contexts/
    DarkModeContext.jsx           # Dark mode context provider and hook
  pages/
    HomePage.jsx                  # Landing page component (extracted from App.jsx)
    MapPage.jsx                   # Map view page component
```

### Files to Modify

```
src/
  App.jsx                         # Convert to router component
  main.jsx                        # Add BrowserRouter and DarkModeProvider
  components/
    sections/
      Navigation.jsx              # Update to use Link and useDarkMode hook
```

### Files to Keep Unchanged

```
src/
  components/
    MapView/
      MapView.jsx                 # No changes needed
      MapView.css                 # No changes needed
    Header/
      Header.jsx                  # No changes needed
      Header.css                  # No changes needed
    sections/
      HeroSection.jsx             # No changes needed
      RoutePlannerSection.jsx     # No changes needed
      FeatureSection.jsx          # No changes needed
      FeaturesGridSection.jsx     # No changes needed
      FooterSection.jsx           # No changes needed
    FloatingParticles.jsx         # No changes needed
  hooks/
    useGeolocation.js             # No changes needed
  api/
    routeApi.js                   # No changes needed
  data/
    mockPostData.json             # No changes needed
```

### Directory Structure After Implementation

```
src/
├── api/
│   └── routeApi.js
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── components/
│   ├── FloatingParticles.jsx
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── Header.css
│   ├── MapView/
│   │   ├── MapView.jsx
│   │   └── MapView.css
│   └── sections/
│       ├── FeatureSection.jsx
│       ├── FeaturesGridSection.jsx
│       ├── FooterSection.jsx
│       ├── HeroSection.jsx
│       ├── Navigation.jsx
│       └── RoutePlannerSection.jsx
├── contexts/
│   └── DarkModeContext.jsx       [NEW]
├── data/
│   ├── mockPostData.json
│   └── mockRoutes.json
├── hooks/
│   ├── use-mobile.js
│   └── useGeolocation.js
├── lib/
│   └── utils.js
├── pages/
│   ├── HomePage.jsx              [NEW]
│   └── MapPage.jsx               [NEW]
├── App.css
├── App.jsx                       [MODIFIED]
├── index.css
└── main.jsx                      [MODIFIED]
```

## Implementation Notes

### Migration Steps

1. **Install Dependencies**
   ```bash
   npm install react-router-dom
   npm install --save-dev fast-check  # for property-based testing
   ```

2. **Create Context**
   - Create `src/contexts/DarkModeContext.jsx`
   - Implement provider and custom hook

3. **Create Page Components**
   - Create `src/pages/HomePage.jsx` by extracting from `App.jsx`
   - Create `src/pages/MapPage.jsx` with geolocation and API logic

4. **Update App.jsx**
   - Remove all page content
   - Add Routes configuration
   - Import page components

5. **Update main.jsx**
   - Import BrowserRouter and DarkModeProvider
   - Wrap App with providers

6. **Update Navigation**
   - Import Link from react-router-dom
   - Replace anchor tags with Link components
   - Update navLinks array
   - Use useDarkMode hook

7. **Test**
   - Verify all routes work
   - Test dark mode across routes
   - Test map page loading and error states
   - Verify animations still work on home page

### Potential Issues and Solutions

**Issue**: GSAP ScrollTrigger animations not working after route change
**Solution**: Ensure ScrollTrigger.refresh() is called when returning to HomePage, or clean up and reinitialize on mount

**Issue**: Dark mode state resets on route change
**Solution**: Use Context API to persist state across routes (already in design)

**Issue**: Map doesn't render after navigation
**Solution**: Ensure MapView useEffect dependencies are correct and map initializes on mount

**Issue**: Navigation links don't scroll to sections on home page
**Solution**: Implement hybrid navigation - use Link for routes, button with scrollToSection for hash links

**Issue**: Browser back button doesn't work as expected
**Solution**: React Router handles this automatically with BrowserRouter

### Performance Considerations

- **Code Splitting**: Consider lazy loading pages in future iterations
- **Map Initialization**: Map only initializes when MapPage is mounted
- **GSAP Cleanup**: Ensure ScrollTrigger instances are killed on unmount
- **Context Re-renders**: DarkModeContext only causes re-renders when dark mode changes

### Accessibility Considerations

- Navigation links have proper ARIA labels
- Loading states announce to screen readers
- Error messages are accessible
- Keyboard navigation works for all routes
- Focus management on route changes

### Browser Compatibility

- React Router v6 supports all modern browsers
- BrowserRouter requires HTML5 History API
- Fallback to HashRouter if needed for older browsers
- OlaMaps compatibility unchanged
