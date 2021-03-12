const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
    
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
        img.src = url;
    });
}

async function main() {
  // Load the model.
  const model = await blazeface.load();

  // Pass in an image or video to the model. The model returns an array of
  // bounding boxes, probabilities, and landmarks, one for each detected face.
  const img = await loadImage('assets/img/brangelina.jpg');

  const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
  const predictions = await model.estimateFaces(img, returnTensors);

  document.querySelector('#splash').style.display = 'none';
  canvas.style.width = img.width + 'px';
  canvas.style.height = img.height + 'px';
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height)

  for (let prediction of predictions) {
    const start = prediction.topLeft;
    const end = prediction.bottomRight;
    const size = [end[0] - start[0], end[1] - start[1]];

    // Render a rectangle over each detected face.
    ctx.fillStyle = 'rgba(256, 0, 0, 0.5)';
    ctx.fillRect(start[0], start[1], size[0], size[1]);

    ctx.fillStyle = 'blue';
    for (let landmark of prediction.landmarks) {
      ctx.fillRect(landmark[0] - 4, landmark[1] - 4, 9, 9)
    }
  }
}

main();