function killTweens(penguin) {
    gsap.killTweensOf(penguin.body)
    gsap.killTweensOf(penguin.face)
    gsap.killTweensOf(penguin.belly)
    gsap.killTweensOf(penguin.leftWing)
    gsap.killTweensOf(penguin.rightWing)
    gsap.killTweensOf(penguin.beak)
    gsap.killTweensOf(penguin.lowerBeak)
    gsap.killTweensOf(penguin.leftFoot)
    gsap.killTweensOf(penguin.rightFoot)
    gsap.killTweensOf(penguin.leftFootFront)
    gsap.killTweensOf(penguin.rightFootFront)
    gsap.killTweensOf(penguin.leftFootBack)
    gsap.killTweensOf(penguin.rightFootBack)
    gsap.killTweensOf(penguin.lowerBeakOpenable)
    gsap.set(penguin.eyeShineSM, { display: 'none' })
    gsap.set(penguin.eyeTear, { display: 'none' })

    clearInterval(penguin.interval)
}

export function blink(penguin) {
    gsap.timeline({ repeat: -1, yoyo: true })
        .to(penguin.eyelidUpper, { y: 15, duration: 0.1, delay: 4 }, 0)
        .to(penguin.eyelidLower, { y: -15, duration: 0.1, delay: 4 }, 0)
}

export function walkLeft(penguin) {
    if (penguin.state === 'walkLeft') return
    penguin.state = 'walkLeft'

    killTweens(penguin);

    gsap.timeline({ duration: 0.5 })
        .to(penguin.body, { x: 0, y: 0, rotate: 5, transformOrigin: 'bottom center' }, 0)
        .to(penguin.face, { x: -8, scaleX: 0.95, transformOrigin: 'center' }, 0)
        .to(penguin.belly, { x: -3, }, 0)
        .to(penguin.leftWing, { x: 3, rotate: 0 }, 0)
        .to(penguin.rightWing, { x: 3, rotate: 0 }, 0)
        .to(penguin.beak, { x: -1, }, 0)
        .to(penguin.lowerBeak, { x: 1, }, 0)
        .to(penguin.lowerBeakOpenable, { y: 0, }, 0)
        .to(penguin.leftFoot, { x: 0, rotate: 0 }, 0)
        .to(penguin.rightFoot, { x: 0, rotate: 0 }, 0)
        .set(penguin.leftFootFront, { opacity: 1 }, 0)
        .set(penguin.rightFootFront, { opacity: 1 }, 0)

    gsap.timeline({ repeat: -1 })
        .to(penguin.leftFoot, 0.25, { x: -23, y: -10 })
        .to(penguin.leftFoot, 0.25, { x: -46, y: 0 })
        .to(penguin.leftFoot, 0.25, { x: -23, y: 0 })
        .to(penguin.leftFoot, 0.25, { x: 0, y: 0 })

    gsap.timeline({ repeat: -1 })
        .to(penguin.rightFoot, 0.25, { x: 23, y: 0 })
        .to(penguin.rightFoot, 0.25, { x: 46, y: 0 })
        .to(penguin.rightFoot, 0.25, { x: 23, y: -10 })
        .to(penguin.rightFoot, 0.25, { x: 0, y: 0 })

    gsap.timeline({ repeat: -1 })
        .set(penguin.rightFootFront, { opacity: 0 }, 0)
        .set(penguin.rightFootFront, { opacity: 1 }, 0.5)

    moveLeft(penguin)
    penguin.interval = window.setInterval(() => {
        moveLeft(penguin)
    }, 500)

}

function moveLeft(penguin) {
    const width = penguin.dom.getBoundingClientRect().width
    gsap.to(penguin.dom, 0.5, { x: `-=${46 * width / 300}px` })
}

export function walkRight(penguin) {
    if (penguin.state === 'walkRight') return
    penguin.state = 'walkRight'

    killTweens(penguin);

    gsap.timeline({ duration: 0.5 })
        .to(penguin.body, { x: 0, y: 0, rotate: -5, transformOrigin: 'bottom center' }, 0)
        .to(penguin.face, { x: 8, scaleX: 0.95, transformOrigin: 'center' }, 0)
        .to(penguin.belly, { x: 3, }, 0)
        .to(penguin.leftWing, { x: -3, rotate: 0 }, 0)
        .to(penguin.rightWing, { x: -3, rotate: 0 }, 0)
        .to(penguin.beak, { x: 1, }, 0)
        .to(penguin.lowerBeak, { x: -1, }, 0)
        .to(penguin.lowerBeakOpenable, { y: 0, }, 0)
        .to(penguin.leftFoot, { x: 0, rotate: 0 }, 0)
        .to(penguin.rightFoot, { x: 0, rotate: 0 }, 0)
        .set(penguin.leftFootFront, { opacity: 1 }, 0)
        .set(penguin.rightFootFront, { opacity: 1 }, 0)

    gsap.timeline({ repeat: -1 })
        .to(penguin.leftFoot, 0.25, { x: -23, y: 0 })
        .to(penguin.leftFoot, 0.25, { x: -46, y: 0 })
        .to(penguin.leftFoot, 0.25, { x: -23, y: -10 })
        .to(penguin.leftFoot, 0.25, { x: 0, y: 0 })

    gsap.timeline({ repeat: -1 })
        .to(penguin.rightFoot, 0.25, { x: 23, y: -10 })
        .to(penguin.rightFoot, 0.25, { x: 46, y: 0 })
        .to(penguin.rightFoot, 0.25, { x: 23, y: 0 })
        .to(penguin.rightFoot, 0.25, { x: 0, y: 0 })

    gsap.timeline({ repeat: -1 })
        .set(penguin.leftFootFront, { opacity: 0 }, 0)
        .set(penguin.leftFootFront, { opacity: 1 }, 0.5)

    moveRight(penguin)
    penguin.interval = window.setInterval(() => {
        moveRight(penguin)
    }, 500)
}

function moveRight(penguin) {
    const width = penguin.dom.getBoundingClientRect().width
    gsap.to(penguin.dom, 0.5, { x: `+=${46 * width / 300}px` })
}

export async function idle(penguin) {
    if (penguin.state === 'idle') return
    penguin.state = 'idle'

    killTweens(penguin);

    await gsap.timeline({ duration: 0.5 })
        .to(penguin.body, { x: 0, y: 0, rotate: 0 }, 0)
        .to(penguin.face, { x: 0, scaleX: 1, }, 0)
        .to(penguin.belly, { x: 0, }, 0)
        .to(penguin.leftWing, { x: 0, rotate: 0 }, 0)
        .to(penguin.rightWing, { x: 0, rotate: 0 }, 0)
        .to(penguin.beak, { x: 0, }, 0)
        .to(penguin.lowerBeak, { x: 0, }, 0)
        .to(penguin.lowerBeakOpenable, { y: 0, }, 0)
        .to(penguin.leftFoot, { x: 0, y: 0, rotate: 0 }, 0)
        .to(penguin.rightFoot, { x: 0, y: 0, rotate: 0 }, 0)
        .set(penguin.leftFootFront, { opacity: 1 }, 0)
        .set(penguin.rightFootFront, { opacity: 1 }, 0)
        .then()

    gsap.timeline({ repeat: -1, yoyo: true })
        .fromTo(penguin.body, { y: 0 }, { y: 2, duration: 1 })
        .to(penguin.leftWing, { rotate: -5, transformOrigin: "top left", duration: 1, ease: "power1.inOut" }, 0)
        .to(penguin.rightWing, { rotate: 5, transformOrigin: "top right", duration: 1, ease: "power1.inOut" }, 0)
}

export async function happy(penguin) {
    if (penguin.state === 'happy') return
    penguin.state = 'happy'
    penguin.coolTime = 3

    killTweens(penguin);

    await gsap.timeline({ duration: 0.5, })
        .to(penguin.body, { rotate: -10, transformOrigin: "bottom center", ease: 'power1.inOut' }, 0)
        .to(penguin.leftWing, { x: 0, rotate: -10, ease: "power1.inOut" }, 0)
        .to(penguin.rightWing, { x: 0, rotate: 10, ease: "power1.inOut" }, 0)
        .to(penguin.leftFoot, { y: -10, rotate: 0, ease: "power1.inOut" }, 0)
        .to(penguin.rightFoot, { rotate: 0, ease: "power1.inOut" }, 0)
        .then()

    gsap.timeline({ repeat: -1, yoyo: true })
        .to(penguin.lowerBeakOpenable, { y: 10, duration: 0.5, ease: "power1.inOut" }, 0)

    gsap.timeline({ repeat: -1, yoyo: true })
        .to(penguin.leftWing, { rotate: 10, transformOrigin: "top left", duration: 1, ease: "power1.inOut" }, 0)
        .to(penguin.rightWing, { rotate: -10, transformOrigin: "top right", duration: 1, ease: "power1.inOut" }, 0)
        .to(penguin.body, { rotate: 10, transformOrigin: "bottom center", duration: 1, ease: "power1.inOut" }, 0)
        .to(penguin.leftFoot, { y: 0, ease: "power1.inOut" }, 0)
        .to(penguin.rightFoot, { y: -10, yoyo: true, ease: "power1.inOut" }, 0.5)

}

export async function greet(penguin) {
    if (penguin.state === 'greet') return
    penguin.state = 'greet'
    penguin.coolTime = 3

    killTweens(penguin);

    await gsap.timeline({ duration: 0.3, })
        .to(penguin.body, { x: 5, y: -5, rotate: 10, transformOrigin: "bottom center" }, 0)
        .to(penguin.leftWing, { x: 0, rotate: 0 }, 0)
        .to(penguin.rightWing, { x: 0, rotate: 100, transformOrigin: "80% 20%" }, 0)
        .to(penguin.lowerBeakOpenable, { y: 10 }, 0)
        .to(penguin.leftFoot, { x: 10, rotate: 0, }, 0)
        .to(penguin.rightFoot, { y: -2, rotate: -10, transformOrigin: "center center" }, 0)
        .then()

    gsap.timeline({ repeat: -1, yoyo: true })
        .to(penguin.body, 0.2, { rotate: 11, ease: "none" }, 0)
        .to(penguin.rightWing, 0.2, { rotate: 70, transformOrigin: "80% 20%", ease: "none" }, 0)
}

export async function cry(penguin) {
    if (penguin.state === 'cry') return
    penguin.state = 'cry'
    penguin.coolTime = 3

    killTweens(penguin)

    await gsap.timeline({ duration: 0.5, })
        .to(penguin.body, { y: 25, rotate: 0, ease: 'power1.inOut' }, 0)
        .to(penguin.face, { x: 0, scaleX: 1, }, 0)
        .to(penguin.leftWing, { rotate: 10, transformOrigin: "80% 20%" }, 0)
        .to(penguin.rightWing, { rotate: -10, transformOrigin: "80% 20%" }, 0)
        .to(penguin.leftFoot, { x: 4, y: 0, rotate: -30, transformOrigin: "center center" }, 0)
        .to(penguin.rightFoot, { x: -4, y: 0, rotate: 30, transformOrigin: "center center" }, 0)
        .set(penguin.leftFootFront, { opacity: 1 }, 0)
        .set(penguin.rightFootFront, { opacity: 1 }, 0)
        .set(penguin.eyeShineSM, { display: 'inline' }, 0)
        .set(penguin.eyeTear, { display: 'inline' }, 0)
        .then()

    gsap.timeline({ repeat: -1, yoyo: true })
        .to(penguin.body, 0.5, { y: '-=2', ease: "power1.inOut" }, 0)
        .to(penguin.leftWing, { rotate: 8, transformOrigin: "80% 20%" }, 0)
        .to(penguin.rightWing, { rotate: -8, transformOrigin: "80% 20%" }, 0)
}
