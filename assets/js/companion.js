import { canvas, context } from './canvas.js';

export class Companion {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.range = 200;
    }

    draw() {
        context.fillStyle = 'black';
        context.fillRect(this.x, this.y, this.width, this.height);
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
    }

    drawTarget(pos) {
        context.strokeStyle = 'red';
        context.beginPath();
        context.arc(pos * canvas.width, this.y, this.range, 0, Math.PI * 2);
        context.stroke();
    }
}
