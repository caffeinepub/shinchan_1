# Specification

## Summary
**Goal:** Add an authenticated Face Detector feature to the shinchan diary app that performs face detection entirely in the browser using either a live webcam feed or an uploaded photo.

**Planned changes:**
- Add a new authenticated “Face Detector” page/route (wrapped with the existing auth gate) with two modes: “Webcam” and “Photo Upload”.
- Implement Webcam mode with start/stop camera controls, live video rendering, and real-time (or near real-time) face bounding box overlays, including clear error handling when camera access is unavailable/denied.
- Implement Photo Upload mode with image selection, preview rendering, face bounding box overlays, and controls to clear/upload a different image.
- Integrate a browser-based face detection library and include required model files as static assets (e.g., under `frontend/public`) with a visible model-loading state, disabled controls until ready, and a clear retryable error state if model loading fails.
- Add a visible navigation entry labeled “Face Detector” that routes via the existing TanStack Router setup without breaking existing routes.

**User-visible outcome:** Signed-in users can open a new “Face Detector” page from the app navigation and detect faces either from their webcam (with live bounding boxes) or by uploading a photo (with bounding boxes), with all processing done locally in the browser.
