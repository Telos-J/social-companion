import { canvas, context, convertToCanvasCoord } from './canvas.js';

export class Companion {
    constructor() {
        this._x = 0.5;
        this._y = 0.5;
        this.width = 100;
        this.height = 100;
        this.speed = 5;
        this.velocity = 0;
        this.range = 600;
        this.eyePos = 0;
        this.DOM = document.querySelector('#penguin');
        this.trackLeft = false;
        this.trackRight = false;
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
        this.DOM.style.left = `${this._x * 100}%`
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    track(pos) {
        if (this.x > pos * canvas.width + this.range && !this.trackLeft) {
            this.DOM.classList.remove('right')
            this.DOM.classList.add('left')
            this.trackLeft = true;
        }
        else if (this.x < pos * canvas.width - this.range) {
            this.DOM.classList.remove('left')
            this.DOM.classList.add('right')
            this.trackRight = true;
        }

        if (this.trackLeft && this.x > pos * canvas.width) this.moveLeft();
        else if (this.trackRight && this.x < pos * canvas.width) this.moveRight();
        else {
            this.trackLeft = false;
            this.trackRight = false;
            this.DOM.classList.remove('left')
            this.DOM.classList.remove('right')
        }

        this.trackEyes(pos)
    }

    trackEyes(pos) {
        const eyes = Array.from(this.DOM.querySelectorAll('.eye'))
        for (let eye of eyes) {
            const x = (pos - this.x / canvas.width) * this.width / 6;
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
