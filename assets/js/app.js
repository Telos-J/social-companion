const splash = document.querySelector('#splash');
const video = document.querySelector('video');
const camCanvas = document.querySelector('#cam-canvas');
const camContext = camCanvas.getContext('2d');
const canvas = document.querySelector('#sc-canvas');
const context = canvas.getContext('2d');

function setCanvasDimensions() {
  const scale = window.devicePixelRatio;
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
}

function initCam() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(function(stream) {
      video.srcObject = stream;
      video.play();
  })
  .catch(function(err) {
      console.log(`navigator.getUserMedia error: ${err}`);
  });
}
    
async function init() {
    model = await blazeface.load();

    initCam();
    setCanvasDimensions();

    return model
}

async function main() {
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

video.addEventListener('canplay', () => {
    const width = video.videoWidth;
    const height = video.videoHeight;

    video.setAttribute('width', width);
    video.setAttribute('height', height);
    camCanvas.setAttribute('width', width);
    camCanvas.setAttribute('height', height);

    splash.style.display = 'none';
    main()
});

window.addEventListener('resize', setCanvasDimensions)

let model = init();