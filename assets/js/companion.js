import { canvas, context, convertToCanvasCoord } from './canvas.js';
import * as animate from './animate.js'

export class Companion {
    constructor() {
        this._x = 0.5;
        this._y = 0.5;
        this.height = 100;
        this.range = 600;
        this.dom = document.querySelector('#penguin');
        this.body = this.dom.querySelector('#body');
        this.face = this.dom.querySelector('#face');
        this.belly = this.dom.querySelector('#belly');
        this.leftWing = this.dom.querySelector('#left-wing');
        this.rightWing = this.dom.querySelector('#right-wing');
        this.beak = this.dom.querySelector('#beak');
        this.upperBeak = this.dom.querySelector('#upper-beak');
        this.lowerBeak = this.dom.querySelector('#lower-beak');
        this.lowerBeakOpenable = this.dom.querySelector('#lower-beak-openable');
        this.leftFoot = this.dom.querySelector('#left-foot');
        this.rightFoot = this.dom.querySelector('#right-foot');
        this.leftFootFront = this.dom.querySelector('#left-foot-front');
        this.rightFootFront = this.dom.querySelector('#right-foot-front');
        this.leftFootBack = this.dom.querySelector('#left-foot-back');
        this.rightFootBack = this.dom.querySelector('#right-foot-back');
        this.eyelidUpper = this.dom.querySelectorAll('.eye-lid-upper');
        this.eyelidLower = this.dom.querySelectorAll('.eye-lid-lower');
        this.eyeShineSM = this.dom.querySelectorAll('.eye-shine-sm')
        this.eyeTear = this.dom.querySelectorAll('.eye-tear')
        this.trackLeft = false;
        this.trackRight = false;
        this.idleTime = 0;
    }

    init() {
        const self = this
        animate.blink(this)
        animate.idle(this)
        this.state = 'alone'
        window.setInterval(() => { self.tickIdleTime() }, 1000)
    }

    isIdle() {
        return this.state === 'idle' || this.state === 'happy' || this.state === 'greet'
    }

    tickIdleTime() {
        if (this.isIdle()) this.idleTime++
        else this.idleTime = 0
        if (this.idleTime >= 10) this.idleTime = 0
    }

    get x() {
        const domRect = this.dom.getBoundingClientRect()
        return domRect.x + domRect.width / 2
    }

    get y() {
        const domRect = this.dom.getBoundingClientRect()
        return domRect.y + domRect.width / 2
    }

    isLeftOfTargetRange(pos) {
        return this.x > pos * canvas.clientWidth + this.range /
            canvas.width * canvas.clientWidth
    }

    isLeftOfTarget(pos) {
        return this.x > pos * canvas.clientWidth
    }

    isRightOfTargetRange(pos) {
        return this.x < pos * canvas.clientWidth - this.range /
            canvas.width * canvas.clientWidth
    }

    isRightOfTarget(pos) {
        return this.x < pos * canvas.clientWidth
    }

    setTrackDirection(pos) {
        if (this.isLeftOfTargetRange(pos)) {
            this.trackLeft = true;
            this.trackRight = false;
        }
        else if (this.isRightOfTargetRange(pos)) {
            this.trackLeft = false;
            this.trackRight = true;
        }
    }

    track(pos) {
        this.setTrackDirection(pos)

        if ((this.state === 'alone' && pos) || (this.state === 'greet' && this.idleTime < 4)) animate.greet(this)

        else if (this.trackLeft && this.isLeftOfTarget(pos))
            animate.walkLeft(this)
        else if (this.trackRight && this.isRightOfTarget(pos))
            animate.walkRight(this)
        else {
            this.trackLeft = false;
            this.trackRight = false;
            if (this.idleTime < 6) animate.idle(this)
            else animate.happy(this)
        }

        if (!pos) this.state = 'alone'

        this.trackEyes(pos)
    }

    trackEyes(pos) {
        const eyes = Array.from(this.dom.querySelectorAll('.eye'))
        for (let eye of eyes) {
            const eyePos = pos - this.x / canvas.clientWidth // -0.5 ~ 0.5
            gsap.to(eye, { x: eyePos * 30 })
        }
    }

    drawTarget(pos) {
        context.strokeStyle = 'red';
        context.beginPath();
        context.arc(pos * canvas.width, canvas.height * 0.7, this.range, 0, Math.PI * 2);
        context.stroke();
    }

}
