import { camCanvas, camContext } from './canvas.js';

class FaceDetection {
    constructor() {
        this.detections = []
    }

    async addModel(model) {
        this.model = await blazeface.load();
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/assets/models')
        ])
    }

    async estimateFaces(video) {
        const predictions = await faceDetection.model.estimateFaces(video, false);
        this.predictions = [];
        for (let prediction of predictions)
            if (prediction.probability[0] > 0.95) {
                this.predictions.push(prediction)
                prediction.x = prediction.topLeft[0];
                prediction.y = prediction.topLeft[1];
                prediction.width = prediction.bottomRight[0] - prediction.topLeft[0];
                prediction.height = prediction.bottomRight[1] - prediction.topLeft[1];
                prediction.area = prediction.width * prediction.height;
            }


        this.detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        this.expressions = []
        for (const detection of this.detections) {
            const expression = detection.expressions.asSortedArray()[0]
            if (expression.probability > 0.9) this.expressions.push(expression)
        }
    }

    drawDetections() {
        for (let prediction of this.predictions) {
            camContext.fillStyle = 'rgba(256, 0, 0, 0.5)';
            camContext.fillRect(prediction.x, prediction.y, prediction.width, prediction.height);
        }

        //faceapi.draw.drawDetections(camCanvas, this.detections)
        faceapi.draw.drawFaceLandmarks(camCanvas, this.detections)
        faceapi.draw.drawFaceExpressions(camCanvas, this.detections)
    }

    getDominantFace() {
        const dominantFace = this.predictions[0];
        for (let prediction of this.predictions)
            if (prediction.area > dominantFace.area)
                dominantFace = prediction

        const expression = this.expressions[0]

        return [dominantFace, expression]
    }

    getTrackPos() {
        const [face, expression] = this.getDominantFace();
        return [1 - (face?.x + face?.width / 2) / camCanvas.width, expression]
    }
}

export const faceDetection = new FaceDetection()
