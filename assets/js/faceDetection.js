import { camCanvas, camContext } from './canvas.js';

class FaceDetection {
    constructor() {
        this.detections = []
    }

    async addModel(model) {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/assets/models')
        ])
    }

    async estimateFaces(video) {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const newDetections = []
        for (const detection of detections) {
            if (detection.detection.score > 0.8) newDetections.push(detection)
        }
        if (newDetections.length) this.detections = newDetections
        else this.detections = []
    }

    drawDetections() {
        faceapi.draw.drawDetections(camCanvas, this.detections)
        faceapi.draw.drawFaceLandmarks(camCanvas, this.detections)
        faceapi.draw.drawFaceExpressions(camCanvas, this.detections)
    }

    getDominantFace() {
        let dominantFace = this.detections[0];
        for (let detection of this.detections)
            if (detection.detection.box.area > dominantFace.detection.box.area)
                dominantFace = detection

        return dominantFace
    }

    getTrackPos() {
        const face = this.getDominantFace();
        const box = face?.detection.box
        const expression = face?.expressions.asSortedArray()[0]

        return [1 - (box?.x + box?.width / 2) / camCanvas.width, expression]
    }
}

export const faceDetection = new FaceDetection()
