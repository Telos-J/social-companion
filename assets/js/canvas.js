export const camCanvas = document.querySelector('#cam-canvas');
export const camContext = camCanvas.getContext('2d');
export const canvas = document.querySelector('#sc-canvas');
export const context = canvas.getContext('2d');

export function setCanvasDimensions() {
    const scale = window.devicePixelRatio;
    canvas.width = Math.floor(window.innerWidth * scale);
    canvas.height = Math.floor(window.innerHeight * scale);
}

export function convertToCanvasCoord(x, y) {
    const scale = window.devicePixelRatio;
    x = x * scale;
    y = y * scale;

    return [x, y];
}

window.addEventListener('resize', setCanvasDimensions)

window.addEventListener('mousemove', (e) => {
    const [x, y] = convertToCanvasCoord(e.clientX, e.clientY);

    // context.strokeStyle = 'black';
    // context.beginPath();
    // context.arc(x, y, 20, 0, Math.PI * 2);
    // context.stroke();
})
