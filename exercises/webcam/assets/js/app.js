const splash = document.querySelector('#splash');
const overlay = document.querySelector('#overlay');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// Access webcam
function init() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log(`navigator.getUserMedia error: ${err}`);
    });
}

// Listen for the video to start playing
video.addEventListener('canplay', () => {
    width = video.videoWidth;
    height = video.videoHeight;

    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    splash.style.display = 'none';
    draw()
});

// Draw image on canvas
let prevTime = -1;
context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height)

function draw() {
    let time = video.currentTime;
    if (time !== prevTime) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        prevTime = time;
    }

    requestAnimationFrame(draw);
}

init();