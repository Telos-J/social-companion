import { video, initCam } from './video.js';
import { canvas, context, camCanvas, camContext, setCanvasDimensions } from './canvas.js';
import { Companion } from './companion.js';
import { faceDetection } from './faceDetection.js';

let companion;

async function init() {
    const model = await blazeface.load();
    faceDetection.addModel(model);

    initCam();
    setCanvasDimensions();
    companion = new Companion(canvas.width / 2, canvas.height / 2, 100, 100);

    return model
}

export async function main() {
    await faceDetection.estimateFaces(video);

    camContext.drawImage(video, 0, 0, camCanvas.width, camCanvas.height)
    context.clearRect(0, 0, canvas.width, canvas.height);

    faceDetection.drawPredictions();

    const pos = faceDetection.getTrackPos()
    companion.track(pos)
    // companion.drawTarget(pos)
    companion.draw();

    requestAnimationFrame(main)
}

init();
