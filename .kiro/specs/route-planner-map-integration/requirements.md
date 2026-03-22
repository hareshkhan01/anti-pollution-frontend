# Requirements Document

## Introduction

This feature connects the route planner form on the landing page to the real routing API and displays the returned routes on an interactive OlaMaps map. When a user submits origin and destination addresses, the system geocodes them, calls the scoring API, and presents the results. The user can then open a full-screen map overlay showing the polyline routes.

## Glossary

- **RoutePlanner**: The form UI component that accepts origin/destination inputs and filter preferences.
- **Geocoder**: The service that converts a human-readable address string into geographic coordinates (lat/lng).
- **RouteAPI**: The backend service at `POST /api/score` that accepts origin/destination coordinates and returns scored route data.
- **MapModal**: The full-screen overlay component that renders the OlaMaps map with route polylines.
- **Route**: An object containing a `routeId` and a `polyline` array of `[lng, lat]` coordinate pairs.

---

## Requirements

### Requirement 1: Geocode Text Inputs

**User Story:** As a user, I want to type a place name or address into the origin/destination fields, so that I don't need to know the exact coordinates.

#### Acceptance Criteria

1. WHEN the user submits the form with a text address, THE Geocoder SHALL resolve the address to a `{ lat, lng }` coordinate pair before calling the RouteAPI.
2. IF the Geocoder returns no results for an address, THEN THE RoutePlanner SHALL display an inline error message describing the failure.
3. WHEN the user has previously clicked "Locate" and the starting point is "My current location", THE RoutePlanner SHALL use the stored geolocation coordinates directly without calling the Geocoder.

---

### Requirement 2: Real API Route Fetch

**User Story:** As a user, I want the app to fetch real route data from the backend, so that I get accurate low-pollution routes.

#### Acceptance Criteria

1. WHEN the user clicks "Find the safest route" with valid origin and destination, THE RoutePlanner SHALL call the RouteAPI with `{ originLat, originLng, destLat, destLng }`.
2. WHILE the RouteAPI request is in flight, THE RoutePlanner SHALL display a loading spinner and disable the submit button.
3. WHEN the RouteAPI returns a successful response, THE RoutePlanner SHALL transition to the success state and store the returned routes.
4. IF the RouteAPI request fails, THEN THE RoutePlanner SHALL display an inline error message and remain in the form state.

---

### Requirement 3: Open Route in Map

**User Story:** As a user, I want to view my route on an interactive map, so that I can see the path visually.

#### Acceptance Criteria

1. WHEN the RoutePlanner is in the success state, THE RoutePlanner SHALL display an "Open in map" button.
2. WHEN the user clicks "Open in map", THE MapModal SHALL open as a full-screen overlay rendering the OlaMaps map.
3. THE MapModal SHALL render each returned Route as a polyline layer on the map.
4. THE MapModal SHALL center the map on the origin coordinates.
5. WHEN the user presses the Escape key or clicks the close button, THE MapModal SHALL close and return the user to the success state.
6. WHILE the MapModal is open, THE RoutePlanner SHALL prevent the page body from scrolling.
