import { canvas, context, convertToCanvasCoord } from './canvas.js';

export class Companion {
    constructor() {
        this._x = 0.5;
        this._y = 0.5;
        this.height = 100;
        this.range = 600;
        this.dom = document.querySelector('#penguin');
        this.face = this.dom.querySelector('#face');
        this.belly = this.dom.querySelector('#belly');
        this.leftWing = this.dom.querySelector('#left-wing');
        this.rightWing = this.dom.querySelector('#right-wing');
        this.beak = this.dom.querySelector('#beak');
        this.upperBeak = this.dom.querySelector('#upper-beak');
        this.lowerBeak = this.dom.querySelector('#lower-beak');
        this.leftFoot = this.dom.querySelector('#left-foot');
        this.rightFoot = this.dom.querySelector('#right-foot');
        this.trackLeft = false;
        this.trackRight = false;
        this.state = 'idle';
    }

    init() {
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

    track(pos) {
        if (this.isLeftOfTargetRange(pos)) this.trackLeft = true;
        else if (this.isRightOfTargetRange(pos)) this.trackRight = true;

        if (this.trackLeft && this.isLeftOfTarget(pos)) {
            this.animateWalkLeft()
        }
        else if (this.trackRight && this.isRightOfTarget(pos)) {
            this.animateWalkRight()
        }
        else {
            this.trackLeft = false;
            this.trackRight = false;
            this.animateIdle()
        }


        this.trackEyes(pos)
    }

    trackEyes(pos) {
        const eyes = Array.from(this.dom.querySelectorAll('.eye'))
        for (let eye of eyes) {
            const x = (pos - this.x / canvas.clientWidth) * this.dom.clientWidth / 10;
            eye.style.transform = `translateX(${x}px)`;
        }
    }

    drawTarget(pos) {
        context.strokeStyle = 'red';
        context.beginPath();
        context.arc(pos * canvas.width, canvas.height / 2, this.range, 0, Math.PI * 2);
        context.stroke();
    }

    killTweens() {
        gsap.killTweensOf(this.face)
        gsap.killTweensOf(this.belly)
        gsap.killTweensOf(this.leftWing)
        gsap.killTweensOf(this.rightWing)
        gsap.killTweensOf(this.beak)
        gsap.killTweensOf(this.lowerBeak)
        gsap.killTweensOf(this.leftFoot)
        gsap.killTweensOf(this.rightFoot)
    }

    animateWalkLeft() {
        if (this.state === 'walkLeft') return

        this.killTweens();

        gsap.timeline({ duration: 0.5 })
            .to(this.face, { x: -8, scaleX: 0.95, }, 0)
            .to(this.belly, { x: -3, }, 0)
            .to(this.leftWing, { x: 3, }, 0)
            .to(this.rightWing, { x: 3, }, 0)
            .to(this.beak, { x: -1, }, 0)
            .to(this.lowerBeak, { x: 1, }, 0)

        gsap.timeline({ repeat: -1 })
            .to(this.leftFoot, 0.25, { x: -23, y: -10 })
            .to(this.leftFoot, 0.25, { x: -46, y: 0 })
            .to(this.leftFoot, 0.25, { x: -23, y: 0 })
            .to(this.leftFoot, 0.25, { x: 0, y: 0 })

        gsap.timeline({ repeat: -1 })
            .to(this.rightFoot, 0.25, { x: 23, y: 0 })
            .to(this.rightFoot, 0.25, { x: 46, y: 0 })
            .to(this.rightFoot, 0.25, { x: 23, y: -10 })
            .to(this.rightFoot, 0.25, { x: 0, y: 0 })

        clearInterval(this.interval)
        gsap.to(this.dom, 0.5, { x: '-=46px' })
        this.interval = window.setInterval(() => {
            gsap.to(this.dom, 0.5, { x: '-=46px' })
        }, 500)

        this.state = 'walkLeft'
    }

    animateWalkRight() {
        if (this.state === 'walkRight') return

        this.killTweens();

        gsap.timeline({ duration: 0.5 })
            .to(this.face, { x: 8, scaleX: 0.95, }, 0)
            .to(this.belly, { x: 3, }, 0)
            .to(this.leftWing, { x: -3, }, 0)
            .to(this.rightWing, { x: -3, }, 0)
            .to(this.beak, { x: 1, }, 0)
            .to(this.lowerBeak, { x: -1, }, 0)

        gsap.timeline({ repeat: -1 })
            .to(this.leftFoot, 0.25, { x: -23, y: 0 })
            .to(this.leftFoot, 0.25, { x: -46, y: 0 })
            .to(this.leftFoot, 0.25, { x: -23, y: -10 })
            .to(this.leftFoot, 0.25, { x: 0, y: 0 })

        gsap.timeline({ repeat: -1 })
            .to(this.rightFoot, 0.25, { x: 23, y: -10 })
            .to(this.rightFoot, 0.25, { x: 46, y: 0 })
            .to(this.rightFoot, 0.25, { x: 23, y: 0 })
            .to(this.rightFoot, 0.25, { x: 0, y: 0 })

        clearInterval(this.interval)
        gsap.to(this.dom, 0.5, { x: '+=46px' })
        this.interval = window.setInterval(() => {
            gsap.to(this.dom, 0.5, { x: '+=46px' })
        }, 500)

        this.state = 'walkRight'
    }

    animateIdle() {
        if (this.state === 'idle') return

        this.killTweens();

        gsap.timeline({ duration: 0.5 })
            .to(this.face, { x: 0, scaleX: 1, }, 0)
            .to(this.belly, { x: 0, }, 0)
            .to(this.leftWing, { x: 0, }, 0)
            .to(this.rightWing, { x: 0, }, 0)
            .to(this.beak, { x: 0, }, 0)
            .to(this.lowerBeak, { x: 0, }, 0)


        gsap.timeline({ duration: 0.1, clearProps: "all" })
            .to(this.leftFoot, { x: 0, y: 0 }, 0)
            .to(this.rightFoot, { x: 0, y: 0 }, 0)

        clearInterval(this.interval)

        this.state = 'idle'
    }
}
