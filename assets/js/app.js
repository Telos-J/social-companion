import { video, initCam } from './video.js';
import { canvas, context, camCanvas, camContext, setCanvasDimensions } from './canvas.js';

async function init() {
    model = await blazeface.load();

    initCam();
    setCanvasDimensions();

    return model
}

export async function main() {
  const predictions = await model.estimateFaces(video, false);
  let pos = canvas.width / 2;

  camContext.drawImage(video, 0, 0, camCanvas.width, camCanvas.height)

  for (let prediction of predictions) {
    const start = prediction.topLeft;
    const end = prediction.bottomRight;
    const size = [end[0] - start[0], end[1] - start[1]];

    camContext.fillStyle = 'rgba(256, 0, 0, 0.5)';
    camContext.fillRect(start[0], start[1], size[0], size[1]);
    camContext.fillStyle = 'blue';
    for (let landmark of prediction.landmarks) {
      camContext.fillRect(landmark[0] - 4, landmark[1] - 4, 9, 9)
    }

    if (start[0] + end[0] > camCanvas.width) pos -= 50;
    else pos += 50;

  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'black';
  context.fillRect(pos, canvas.height / 2, 50, 50);

  requestAnimationFrame(main)
}

let model = init();