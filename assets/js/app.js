import { video, initCam } from './video.js';
import { canvas, context, camCanvas, camContext, setCanvasDimensions } from './canvas.js';
import { Companion } from './companion.js';
import { faceDetection } from './faceDetection.js';

export let companion;

async function init() {
    gsap.registerPlugin(MorphSVGPlugin);

    const model = await blazeface.load();
    faceDetection.addModel(model);

    initCam();
    setCanvasDimensions();
    companion = new Companion();
    companion.init();

    return model
}

export async function main() {
    await faceDetection.estimateFaces(video);

    camContext.drawImage(video, 0, 0, camCanvas.width, camCanvas.height)
    context.clearRect(0, 0, canvas.width, canvas.height);

    faceDetection.drawPredictions();

    const pos = faceDetection.getTrackPos()
    companion.track(pos)
    companion.draw();
    companion.drawTarget(pos)

    requestAnimationFrame(main)
}

init();
