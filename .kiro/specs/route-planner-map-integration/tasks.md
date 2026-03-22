Update the requirements for the route-planner-map-integration# Tasks

## Task List

- [ ] 1. Verify geocoding integration in RoutePlannerSection
  - [ ] 1.1 Confirm `geocodeAddress` is called for text-based origin input before `fetchRoutesData`
  - [ ] 1.2 Confirm geolocation bypass: when `startingPoint === 'My current location'` and `geoCoords.current` is set, `geocodeAddress` is skipped for origin
  - [ ] 1.3 Confirm geocode failure sets `error` state with the thrown message and keeps `result` as `null`

- [ ] 2. Verify route API fetch integration in RoutePlannerSection
  - [ ] 2.1 Confirm `fetchRoutesData` is called with `{ originLat, originLng, destLat, destLng }` matching resolved coordinates
  - [ ] 2.2 Confirm `isSearching` is `true` while the request is in flight and the submit button is disabled
  - [ ] 2.3 Confirm successful response sets `routes` to the returned array and `result` to `'success'`
  - [ ] 2.4 Confirm API failure sets `error` state and keeps `result` as `null`

- [ ] 3. Verify map modal open/close behaviour
  - [ ] 3.1 Confirm "Open in map" button is rendered when `result === 'success'`
  - [ ] 3.2 Confirm clicking "Open in map" sets `showMap = true` and renders `MapModal` with correct `routes`, `latitude`, and `longitude` props
  - [ ] 3.3 Confirm pressing Escape calls `onClose` and closes the modal
  - [ ] 3.4 Confirm clicking the close button calls `onClose` and closes the modal
  - [ ] 3.5 Confirm `document.body.style.overflow` is `'hidden'` while `MapModal` is mounted and restored on unmount

- [ ] 4. Write property-based tests
  - [ ] 4.1 Property 1 — pipeline failure sets error state: for any thrown error in the geocode/fetch pipeline, `error` is non-empty, `result` is `null`, `isSearching` is `false`
  - [ ] 4.2 Property 2 — successful fetch stores routes: for any valid `Route[]` returned, `routes` equals the array and `result === 'success'`
  - [ ] 4.3 Property 3 — API payload matches resolved coordinates: for any origin/destination coords, `fetchRoutesData` is called with the exact matching payload

- [ ] 5. Manual smoke test
  - [ ] 5.1 Enter a real origin and destination, submit the form, verify the success state appears
  - [ ] 5.2 Click "Open in map", verify the map overlay opens and polylines are visible
  - [ ] 5.3 Press Escape, verify the modal closes and the success state is restored
  - [ ] 5.4 Enter an invalid address, verify an inline error message appears
