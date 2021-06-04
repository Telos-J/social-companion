import { canvas, context, convertToCanvasCoord } from './canvas.js';

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
        this.trackLeft = false;
        this.trackRight = false;
        this.idleTime = 0;
    }

    init() {
        const self = this
        this.animateBlink()
        this.animateIdle()
        window.setInterval(() => { self.tickIdleTime() }, 1000)
    }

    tickIdleTime() {
        if (this.state === 'idle' || this.state === 'happy' || this.state === 'greet') this.idleTime++
        else this.idleTime = 0
        if (this.idleTime >= 10) this.idleTime = 0
        console.log(this.idleTime)
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

        if (this.trackLeft && this.isLeftOfTarget(pos)) {
            this.animateWalkLeft()
        }
        else if (this.trackRight && this.isRightOfTarget(pos)) {
            this.animateWalkRight()
        }
        else {
            this.trackLeft = false;
            this.trackRight = false;
            if (this.idleTime < 6) this.animateIdle()
            else this.animateGreet()
            // else this.animateHappy()
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
        gsap.killTweensOf(this.body)
        gsap.killTweensOf(this.face)
        gsap.killTweensOf(this.belly)
        gsap.killTweensOf(this.leftWing)
        gsap.killTweensOf(this.rightWing)
        gsap.killTweensOf(this.beak)
        gsap.killTweensOf(this.lowerBeak)
        gsap.killTweensOf(this.leftFoot)
        gsap.killTweensOf(this.rightFoot)
        gsap.killTweensOf(this.leftFootFront)
        gsap.killTweensOf(this.rightFootFront)
        gsap.killTweensOf(this.leftFootBack)
        gsap.killTweensOf(this.rightFootBack)
        gsap.killTweensOf(this.lowerBeakOpenable)

        clearInterval(this.interval)
    }

    animateBlink() {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(this.eyelidUpper, { y: 15, duration: 0.1, delay: 4 }, 0)
            .to(this.eyelidLower, { y: -15, duration: 0.1, delay: 4 }, 0)
    }

    animateWalkLeft() {
        if (this.state === 'walkLeft') return
        this.state = 'walkLeft'

        this.killTweens();

        gsap.timeline({ duration: 0.5 })
            .to(this.body, { x: 0, y: 0, rotate: 5, transformOrigin: 'bottom center' }, 0)
            .to(this.face, { x: -8, scaleX: 0.95, transformOrigin: 'center' }, 0)
            .to(this.belly, { x: -3, }, 0)
            .to(this.leftWing, { x: 3, rotate: 0 }, 0)
            .to(this.rightWing, { x: 3, rotate: 0 }, 0)
            .to(this.beak, { x: -1, }, 0)
            .to(this.lowerBeak, { x: 1, }, 0)
            .to(this.lowerBeakOpenable, { y: 0, }, 0)
            .set(this.leftFootFront, { opacity: 1 }, 0)
            .set(this.rightFootFront, { opacity: 1 }, 0)

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

        gsap.timeline({ repeat: -1 })
            .set(this.rightFootFront, { opacity: 0 }, 0)
            .set(this.rightFootFront, { opacity: 1 }, 0.5)

        gsap.to(this.dom, 0.5, { x: '-=46px' })
        this.interval = window.setInterval(() => {
            gsap.to(this.dom, 0.5, { x: '-=46px' })
        }, 500)

    }

    animateWalkRight() {
        if (this.state === 'walkRight') return
        this.state = 'walkRight'

        this.killTweens();

        gsap.timeline({ duration: 0.5 })
            .to(this.body, { x: 0, y: 0, rotate: -5, transformOrigin: 'bottom center' }, 0)
            .to(this.face, { x: 8, scaleX: 0.95, transformOrigin: 'center' }, 0)
            .to(this.belly, { x: 3, }, 0)
            .to(this.leftWing, { x: -3, rotate: 0 }, 0)
            .to(this.rightWing, { x: -3, rotate: 0 }, 0)
            .to(this.beak, { x: 1, }, 0)
            .to(this.lowerBeak, { x: -1, }, 0)
            .to(this.lowerBeakOpenable, { y: 0, }, 0)
            .set(this.leftFootFront, { opacity: 1 }, 0)
            .set(this.rightFootFront, { opacity: 1 }, 0)

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

        gsap.timeline({ repeat: -1 })
            .set(this.leftFootFront, { opacity: 0 }, 0)
            .set(this.leftFootFront, { opacity: 1 }, 0.5)

        gsap.to(this.dom, 0.5, { x: '+=46px' })
        this.interval = window.setInterval(() => {
            gsap.to(this.dom, 0.5, { x: '+=46px' })
        }, 500)
    }

    async animateIdle() {
        if (this.state === 'idle') return
        this.state = 'idle'

        this.killTweens();

        gsap.timeline({ duration: 0.1 })
            .to(this.leftFoot, { x: 0, y: 0 }, 0)
            .to(this.rightFoot, { x: 0, y: 0 }, 0)

        await gsap.timeline({ duration: 0.5 })
            .to(this.body, { x: 0, y: 0, rotate: 0 }, 0)
            .to(this.face, { x: 0, scaleX: 1, }, 0)
            .to(this.belly, { x: 0, }, 0)
            .to(this.leftWing, { x: 0, rotate: 0 }, 0)
            .to(this.rightWing, { x: 0, rotate: 0 }, 0)
            .to(this.beak, { x: 0, }, 0)
            .to(this.lowerBeak, { x: 0, }, 0)
            .to(this.lowerBeakOpenable, { y: 0, }, 0)
            .to(this.leftFoot, { x: 0 }, 0)
            .to(this.rightFoot, { y: 0, rotate: 0 }, 0)
            .set(this.leftFootFront, { opacity: 1 }, 0)
            .set(this.rightFootFront, { opacity: 1 }, 0)
            .then()

        gsap.timeline({ repeat: -1, yoyo: true })
            .fromTo(this.body, { y: 0 }, { y: 2, duration: 1 })
            .to(this.leftWing, { rotate: -5, transformOrigin: "top left", duration: 1, ease: "power1.inOut" }, 0)
            .to(this.rightWing, { rotate: 5, transformOrigin: "top right", duration: 1, ease: "power1.inOut" }, 0)
    }

    async animateHappy() {
        if (this.state === 'happy') return
        this.state = 'happy'

        this.killTweens();

        await gsap.timeline({ duration: 0.5, })
            .to(this.body, { rotate: -10, transformOrigin: "bottom center", ease: 'power1.inOut' }, 0)
            .to(this.leftWing, { x: 0, rotate: -10, ease: "power1.inOut" }, 0)
            .to(this.rightWing, { x: 0, rotate: 10, ease: "power1.inOut" }, 0)
            .to(this.leftFoot, { y: -10, ease: "power1.inOut" }, 0)
            .set(this.leftFootFront, { opacity: 1 }, 0)
            .set(this.leftFootFront, { opacity: 1 }, 0)
            .then()

        gsap.timeline({ repeat: -1, yoyo: true })
            .to(this.lowerBeakOpenable, { y: 10, duration: 0.5, ease: "power1.inOut" }, 0)

        gsap.timeline({ repeat: -1, yoyo: true })
            .to(this.leftWing, { rotate: 10, transformOrigin: "top left", duration: 1, ease: "power1.inOut" }, 0)
            .to(this.rightWing, { rotate: -10, transformOrigin: "top right", duration: 1, ease: "power1.inOut" }, 0)
            .to(this.body, { rotate: 10, transformOrigin: "bottom center", duration: 1, ease: "power1.inOut" }, 0)
            .to(this.leftFoot, { y: 0, ease: "power1.inOut" }, 0)
            .to(this.rightFoot, { y: -10, yoyo: true, ease: "power1.inOut" }, 0.5)

    }

    async animateGreet() {
        if (this.state === 'greet') return
        this.state = 'greet'

        this.killTweens();

        await gsap.timeline({ duration: 0.5, })
            .to(this.body, { x: 5, y: -5, rotate: 10, transformOrigin: "bottom center" }, 0)
            .to(this.face, { x: 0, scaleX: 1, }, 0)
            .to(this.belly, { x: 0, }, 0)
            .to(this.leftWing, { x: 0, rotate: 0 }, 0)
            .to(this.rightWing, { x: 0, rotate: 100, transformOrigin: "80% 20%" }, 0)
            .to(this.beak, { x: 0, }, 0)
            .to(this.lowerBeak, { x: 0, }, 0)
            .to(this.lowerBeakOpenable, { y: 10 }, 0)
            .to(this.leftFoot, { x: 10 }, 0)
            .to(this.rightFoot, { y: -2, rotate: -10, transformOrigin: "center center" }, 0)
            .set(this.leftFootFront, { opacity: 1 }, 0)
            .set(this.rightFootFront, { opacity: 1 }, 0)
            .then()

        gsap.timeline({ repeat: -1, yoyo: true })
            .to(this.body, 0.2, { rotate: 11, ease: "none" }, 0)
            .to(this.rightWing, 0.2, { rotate: 70, transformOrigin: "80% 20%", ease: "none" }, 0)
    }
}
