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
        this.face = this.DOM.querySelector('#face');
        this.belly = this.DOM.querySelector('#belly');
        this.leftWing = this.DOM.querySelector('#left-wing');
        this.rightWing = this.DOM.querySelector('#right-wing');
        this.beak = this.DOM.querySelector('#beak');
        this.upperBeak = this.DOM.querySelector('#upper-beak');
        this.lowerBeak = this.DOM.querySelector('#lower-beak');
        this.leftFoot = this.DOM.querySelector('#left-foot');
        this.rightFoot = this.DOM.querySelector('#right-foot');
        this.trackLeft = false;
        this.trackRight = false;
        this.state = 'idle';
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
            this.animateWalkLeft()
            this.trackLeft = true;
        }
        else if (this.x < pos * canvas.width - this.range) {
            this.DOM.classList.remove('left')
            this.DOM.classList.add('right')
            this.animateWalkRight()
            this.trackRight = true;
        }

        if (this.trackLeft && this.x > pos * canvas.width) this.moveLeft();
        else if (this.trackRight && this.x < pos * canvas.width) this.moveRight();
        else {
            this.trackLeft = false;
            this.trackRight = false;
            this.DOM.classList.remove('left')
            this.DOM.classList.remove('right')
            this.animateIdle()
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

    animateWalkLeft() {
        if (this.state === 'walkLeft') return

        gsap.timeline({ duration: 0.5 })
            .to(this.face, { x: -8, scaleX: 0.95, }, 0)
            .to(this.belly, { x: -3, }, 0)
            .to(this.leftWing, { x: 3, }, 0)
            .to(this.rightWing, { x: 3, }, 0)
            .to(this.beak, { x: -1, }, 0)
            .to(this.lowerBeak, { x: 1, }, 0)

        gsap.timeline({ duration: 0.1, repeat: -1, clearProps: "all" })
            .to(this.leftFoot, { x: -10, y: -10 })
            .to(this.leftFoot, { x: -46, y: 0 })
            .to(this.leftFoot, { x: -23, y: 0 })
            .to(this.leftFoot, { x: 0, y: 0 })

        gsap.timeline({ duration: 0.1, repeat: -1, clearProps: "all" })
            .to(this.rightFoot, { x: 23, y: 0 })
            .to(this.rightFoot, { x: 46, y: 0 })
            .to(this.rightFoot, { x: 30, y: -10 })
            .to(this.rightFoot, { x: 0, y: 0 })

        this.state = 'walkLeft'
    }

    animateWalkRight() {
        if (this.state === 'walkRight') return

        gsap.timeline({ duration: 0.5 })
            .to(this.face, { x: 8, scaleX: 0.95, }, 0)
            .to(this.belly, { x: 3, }, 0)
            .to(this.leftWing, { x: -3, }, 0)
            .to(this.rightWing, { x: -3, }, 0)
            .to(this.beak, { x: 1, }, 0)
            .to(this.lowerBeak, { x: -1, }, 0)

        gsap.timeline({ duration: 0.25, repeat: -1, clearProps: "all" })
            .to(this.leftFoot, { x: -23, y: 0 })
            .to(this.leftFoot, { x: -46, y: 0 })
            .to(this.leftFoot, { x: -30, y: -10 })
            .to(this.leftFoot, { x: 0, y: 0 })

        gsap.timeline({ duration: 0.25, repeat: -1, clearProps: "all" })
            .to(this.rightFoot, { x: 10, y: -10 })
            .to(this.rightFoot, { x: 46, y: 0 })
            .to(this.rightFoot, { x: 23, y: 0 })
            .to(this.rightFoot, { x: 0, y: 0 })

        this.state = 'walkRight'
    }

    animateIdle() {
        if (this.state === 'idle') return

        gsap.timeline({ duration: 0.5 })
            .to(this.face, { x: 0, scaleX: 1, }, 0)
            .to(this.belly, { x: 0, }, 0)
            .to(this.leftWing, { x: 0, }, 0)
            .to(this.rightWing, { x: 0, }, 0)
            .to(this.beak, { x: 0, }, 0)
            .to(this.lowerBeak, { x: 0, }, 0)

        gsap.killTweensOf(this.leftFoot)
        gsap.killTweensOf(this.rightFoot)

        gsap.timeline({ duration: 0.1, clearProps: "all" })
            .to(this.leftFoot, { x: 0, y: 0 }, 0)
            .to(this.rightFoot, { x: 0, y: 0 }, 0)

        this.state = 'idle'
    }
}
