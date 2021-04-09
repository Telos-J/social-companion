import { canvas, context } from './canvas.js';

export class Companion {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.range = 200;
        this.eyePos = 0;
    }

    draw() {
        // draw body
        context.fillStyle = 'black';
        context.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.height);

        // draw eye socket
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(this.x - this.width / 4, this.y - this.height / 2, this.width / 4, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.beginPath();
        context.arc(this.x + this.width / 4, this.y - this.height / 2, this.width / 4, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        // draw pupil
        context.fillStyle = 'black';
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
}
