import { camCanvas, camContext } from './canvas.js';

class FaceDetection {
    constructor() {
    }

    addModel(model) {
        this.model = model;
        this.predictions = [];
    }

    async estimateFaces(video) {
        const predictions = await faceDetection.model.estimateFaces(video, false);
        const newPredictions = [];
        for (let prediction of predictions)
            if (prediction.probability[0] > 0.9) {
                newPredictions.push(prediction)
                prediction.x = prediction.topLeft[0];
                prediction.y = prediction.topLeft[1];
                prediction.width = prediction.bottomRight[0] - prediction.topLeft[0];
                prediction.height = prediction.bottomRight[1] - prediction.topLeft[1];
                prediction.area = prediction.width * prediction.height;
            }

        if (newPredictions.length) this.predictions = newPredictions;
    }

    drawPredictions() {
        for (let prediction of this.predictions) {
            camContext.fillStyle = 'rgba(256, 0, 0, 0.5)';
            camContext.fillRect(prediction.x, prediction.y, prediction.width, prediction.height);
        }
    }

    getDominantFace() {
        let dominantFace = this.predictions[0];
        for (let prediction of this.predictions)
            if (prediction.area > dominantFace.area)
                dominantFace = prediction

        return dominantFace
    }

    getTrackPos() {
        const face = this.getDominantFace();
        return 1 - (face?.x + face?.width / 2) / camCanvas.width
    }
}

export const faceDetection = new FaceDetection()
