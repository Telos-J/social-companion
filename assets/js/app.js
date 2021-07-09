import { video, initCam } from './video.js';
import { canvas, context, camCanvas, camContext, setCanvasDimensions } from './canvas.js';
import { Companion } from './companion.js';
import { faceDetection } from './faceDetection.js';

export let companion;

async function init() {
    gsap.registerPlugin(MorphSVGPlugin);

    companion = new Companion();
    companion.init();

    const model = await blazeface.load();
    faceDetection.addModel(model);

    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/assets/models')
    ])

    initCam();
    setCanvasDimensions();

    return model
}

export async function main() {
    await faceDetection.estimateFaces(video);
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

    camContext.drawImage(video, 0, 0, camCanvas.width, camCanvas.height)
    context.clearRect(0, 0, canvas.width, canvas.height);

    faceDetection.drawPredictions();

    const pos = faceDetection.getTrackPos()
    companion.track(pos)
    companion.drawTarget(pos)

    console.log(detections)
    faceapi.draw.drawDetections(camCanvas, detections)
    faceapi.draw.drawFaceLandmarks(camCanvas, detections)
    faceapi.draw.drawFaceExpressions(camCanvas, detections)

    requestAnimationFrame(main)
}

init();
