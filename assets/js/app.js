import { video, initCam } from './video.js';
import { canvas, context, camCanvas, camContext, setCanvasDimensions } from './canvas.js';
import { companion } from './companion.js';
import { faceDetection } from './faceDetection.js';

async function init() {
    gsap.registerPlugin(MorphSVGPlugin);

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

    faceapi.draw.drawDetections(camCanvas, detections)
    faceapi.draw.drawFaceLandmarks(camCanvas, detections)
    faceapi.draw.drawFaceExpressions(camCanvas, detections)

    const detection = detections?.[0]?.expressions.asSortedArray()[0]

    companion.track(pos)
    companion.drawTarget(pos)
    companion.update(pos, detection)

    requestAnimationFrame(main)
}

init();
