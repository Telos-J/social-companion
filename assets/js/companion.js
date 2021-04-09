import { canvas, context, convertToCanvasCoord } from './canvas.js';

export class Companion {
    constructor() {
        this._x = 0.5;
        this._y = 0.5;
        this.width = 100;
        this.height = 100;
        this.speed = 5;
        this.range = 200;
        this.eyePos = 0;
        this.color = 'black';
    }

    get x() {
        return this._x * canvas.width
    }

    set x(x) {
        this._x = x / canvas.width
    }

    get y() {
        return this._y * canvas.height
    }

    set y(y) {
        this._y = y / canvas.height
    }

    init() {
        window.addEventListener('click', (e) => {
            const [x, y] = convertToCanvasCoord(e.clientX, e.clientY);
            this.click(x, y)
        })

        window.addEventListener('mousemove', (e) => {
            const [x, y] = convertToCanvasCoord(e.clientX, e.clientY);
            if (this.collide(x, y)) document.body.style.cursor = 'pointer';
            else document.body.style.cursor = 'default';
        })
    }

    draw() {
        // draw body
        context.fillStyle = this.color;
        context.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.height);

        // draw eye socket
        context.fillStyle = 'white';
        context.strokeStyle = this.color;
        context.beginPath();
        context.arc(this.x - this.width / 4, this.y - this.height / 2, this.width / 4, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.beginPath();
        context.arc(this.x + this.width / 4, this.y - this.height / 2, this.width / 4, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        // draw pupil
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x - this.width / 4 + this.eyePos, this.y - this.height / 2, this.width / 12, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(this.x + this.width / 4 + this.eyePos, this.y - this.height / 2, this.width / 12, 0, Math.PI * 2);
        context.fill();

    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    track(pos) {
        if (this.x > pos * canvas.width + this.range) this.moveLeft();
        else if (this.x < pos * canvas.width - this.range) this.moveRight();

        this.eyePos = (pos - this.x / canvas.width) * this.width / 6 / 3;
    }

    drawTarget(pos) {
        context.strokeStyle = 'red';
        context.beginPath();
        context.arc(pos * canvas.width, this.y, this.range, 0, Math.PI * 2);
        context.stroke();
    }

    collide(x, y) {
        return x > this.x - this.width / 2 && x < this.x + this.width / 2 && 
            y > this.y - this.height / 2 && y < this.y + this.height / 2
    }

    click(x, y) {
        if (this.collide(x, y)) 
            this.color = this.color === 'black' ? 'red' : 'black';
    }
}
