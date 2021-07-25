import { video, initCam } from './video.js';
import { canvas, context, camCanvas, camContext, setCanvasDimensions } from './canvas.js';
import { companion } from './companion.js';
import { faceDetection } from './faceDetection.js';

async function init() {
    gsap.registerPlugin(MorphSVGPlugin);

    await faceDetection.addModel();

    initCam();
    setCanvasDimensions();
}

export async function main() {
    await faceDetection.estimateFaces(video);

    camContext.drawImage(video, 0, 0, camCanvas.width, camCanvas.height)
    context.clearRect(0, 0, canvas.width, canvas.height);

    faceDetection.drawDetections();
    const [pos, expression] = faceDetection.getTrackPos()


    companion.track(pos)
    companion.drawTarget(pos)
    companion.update(pos, expression)

    requestAnimationFrame(main)
}

init();
