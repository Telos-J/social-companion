const splash = document.querySelector('#splash');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
    
async function init() {
    model = await blazeface.load();

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log(`navigator.getUserMedia error: ${err}`);
    });

    return model
}

async function main() {
  const predictions = await model.estimateFaces(video, false);

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  for (let prediction of predictions) {
    const start = prediction.topLeft;
    const end = prediction.bottomRight;
    const size = [end[0] - start[0], end[1] - start[1]];

    ctx.fillStyle = 'rgba(256, 0, 0, 0.5)';
    ctx.fillRect(start[0], start[1], size[0], size[1]);
    ctx.fillStyle = 'blue';
    for (let landmark of prediction.landmarks) {
      ctx.fillRect(landmark[0] - 4, landmark[1] - 4, 9, 9)
    }
  }

  requestAnimationFrame(main)
}

video.addEventListener('canplay', () => {
    const width = video.videoWidth;
    const height = video.videoHeight;

    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    splash.style.display = 'none';
    main()
});

let model = init();