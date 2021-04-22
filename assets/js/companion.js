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
        this.DOM = document.querySelector('#penguin');
    }

    init() {
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

    draw() {
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

        const eyes = Array.from(this.DOM.querySelectorAll('.eye'))
        for (let eye of eyes) {
            const x = (pos - this.x / canvas.width) * this.width / 6 / 3;
            eye.style.transform = `translateX(${x}px)`;
        }
    }

    drawTarget(pos) {
        context.strokeStyle = 'red';
        context.beginPath();
        context.arc(pos * canvas.width, this.y, this.range, 0, Math.PI * 2);
        context.stroke();
    }
}
