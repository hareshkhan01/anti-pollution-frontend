# Implementation Plan: Add Routing for Map View

## Overview

This implementation adds React Router v6 to enable navigation between a landing page and a map view. The approach extracts the current App.jsx into a HomePage component, creates a new MapPage component with geolocation and route fetching, and implements shared dark mode state using React Context. All existing GSAP animations and component functionality will be preserved.

## Tasks

- [ ] 1. Install React Router dependency
  - Add react-router-dom to package.json dependencies
  - _Requirements: 1.1, 1.2_

- [ ] 2. Create DarkModeContext for shared state
  - [ ] 2.1 Create src/contexts/DarkModeContext.jsx with provider and hook
    - Implement DarkModeProvider component with isDarkMode state
    - Implement useDarkMode custom hook
    - Add useEffect to sync dark mode with document.documentElement class
    - Initialize dark mode from prefers-color-scheme media query
    - _Requirements: 3.9_
  
  - [ ]* 2.2 Write property test for dark mode context
    - **Property: Dark mode class consistency**
    - **Validates: Requirements 3.9**

- [ ] 3. Create HomePage component
  - [ ] 3.1 Create src/pages/HomePage.jsx by extracting from App.jsx
    - Move all landing page content from App.jsx to HomePage.jsx
    - Import all section components (Navigation, HeroSection, RoutePlannerSection, FeatureSection, FeaturesGridSection, FooterSection, FloatingParticles)
    - Use useDarkMode hook instead of local state
    - Preserve all GSAP ScrollTrigger setup and refs
    - Maintain scroll snap behavior
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [ ]* 3.2 Write unit tests for HomePage component
    - Test that all section components render
    - Test GSAP ScrollTrigger initialization
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 4. Create MapPage component
  - [ ] 4.1 Create src/pages/MapPage.jsx with geolocation and route fetching
    - Import useGeolocation hook and fetchRoutesData from routeApi
    - Import Header and MapView components
    - Use useDarkMode hook for dark mode state
    - Implement loading state for geolocation
    - Implement error state for geolocation with retry button
    - Fetch routes from API using mockPostData when coordinates are available
    - Implement loading state for route fetching
    - Implement error state for API failures with retry button
    - Render MapView with latitude, longitude, and routes when data is ready
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_
  
  - [ ]* 4.2 Write unit tests for MapPage loading and error states
    - Test loading indicator when geolocation is loading
    - Test error message when geolocation fails
    - Test loading indicator when routes are loading
    - Test error message when API fails
    - Test MapView renders with correct props when data is ready
    - _Requirements: 4.2, 4.3, 4.5, 4.6, 4.7_

- [ ] 5. Checkpoint - Ensure page components are created
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Update App.jsx to router component
  - [ ] 6.1 Replace App.jsx content with Routes configuration
    - Import Routes, Route, Navigate from react-router-dom
    - Import HomePage and MapPage components
    - Define route "/" for HomePage
    - Define route "/map" for MapPage
    - Define catch-all route "*" that redirects to "/"
    - Remove all landing page content and state management
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ]* 6.2 Write property test for undefined route redirect
    - **Property 1: Undefined Route Redirect**
    - **Validates: Requirements 2.3**

- [ ] 7. Update main.jsx with BrowserRouter and DarkModeProvider
  - [ ] 7.1 Wrap App with BrowserRouter and DarkModeProvider
    - Import BrowserRouter from react-router-dom
    - Import DarkModeProvider from contexts/DarkModeContext
    - Wrap App with BrowserRouter as outer wrapper
    - Wrap App with DarkModeProvider inside BrowserRouter
    - Preserve existing StrictMode and root rendering structure
    - _Requirements: 7.1, 7.2_
  
  - [ ]* 7.2 Write unit tests for main.jsx setup
    - Test BrowserRouter wraps App
    - Test DarkModeProvider wraps App
    - _Requirements: 7.1_

- [ ] 8. Update Navigation component for routing
  - [ ] 8.1 Replace anchor tags with Link components
    - Import Link from react-router-dom
    - Import useDarkMode hook from contexts/DarkModeContext
    - Replace isDarkMode and setIsDarkMode props with useDarkMode hook
    - Update navLinks array to include { label: 'Map', href: '/map' }
    - Implement hybrid navigation: Link for routes, button with scrollToSection for hash links
    - Use Link component for "/" and "/map" routes
    - Use button with onClick for hash links (/#route-planner, /#cleaner-routes, /#footer)
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 8.2 Write unit tests for Navigation component
    - Test Link components render for route paths
    - Test button components render for hash links
    - Test useDarkMode hook is used
    - _Requirements: 5.1, 5.2_

- [ ] 9. Checkpoint - Ensure routing is functional
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 10. Write property test for MapView route display
  - **Property 2: All Routes Displayed on Map**
  - **Validates: Requirements 6.3**

- [ ]* 11. Write integration tests for routing behavior
  - Test navigation from home to map page
  - Test navigation from map to home page
  - Test dark mode persists across route changes
  - Test URL updates without page reload
  - _Requirements: 5.3, 5.4_

- [ ] 12. Final checkpoint - Verify all functionality
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The design document uses JSX/React, so all implementation will be in JavaScript/React
- Existing components (MapView, Header, sections, hooks, API) require no modifications
- GSAP ScrollTrigger animations must be preserved on HomePage
- Dark mode state is shared across routes via Context API
