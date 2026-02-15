# Face Detection Models

This directory contains the face-api.js models required for face detection in the browser.

## Required Models

For the Face Detector feature to work, you need to download the following model files from the official face-api.js repository:

### Tiny Face Detector Model
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1` (binary weights file)

## Download Instructions

1. Visit the official face-api.js models repository:
   https://github.com/justadudewhohacks/face-api.js-models

2. Navigate to the `tiny_face_detector` folder

3. Download the following files and place them in this directory (`frontend/public/models/face-api/`):
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`

## Model Information

- **Tiny Face Detector**: A lightweight, performant face detection model optimized for real-time detection in web browsers
- **Model Size**: ~190 KB (quantized)
- **Performance**: Fast enough for real-time webcam detection
- **Accuracy**: Good balance between speed and accuracy for general face detection

## Usage

The models are loaded automatically when the Face Detector page is accessed. The app will:
1. Show a loading state while models are being downloaded
2. Display an error message if models fail to load
3. Provide a retry button if loading fails

## License

These models are provided by the face-api.js project and are subject to their respective licenses.
For more information, visit: https://github.com/justadudewhohacks/face-api.js
