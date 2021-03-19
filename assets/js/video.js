import { camCanvas } from './canvas.js';
import { main } from './app.js';

const splash = document.querySelector('#splash');
export const video = document.querySelector('video');

export function initCam() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(function(stream) {
      video.srcObject = stream;
      video.play();
  })
  .catch(function(err) {
      console.log(`navigator.getUserMedia error: ${err}`);
  });
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
