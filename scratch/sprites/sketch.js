const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
document.addEventListener('keydown', keyPressed)
let position = { x: 10, y: 10 }
let currentLoop;
let IS_JUMPING_NOW = false
const actions = {
    run: {
        filesCount: 7,
    },
    jump: {
        filesCount: 7,
    },
    bend: {
        filesCount: 4,
    },
}
const actionsAssets = { totalImageCount: 0, totalLoadedImageCount: 0 }

setup()
function setup() {
    audio_element = document.createElement("audio");
    audio_element.setAttribute('loop', '');
    loadAssets()
}
function loadAssets() {
    const baseURL = "assets/images/Sprite/Horse/"
    for (action in actions) {
        actionsAssets[action] = {}
        const imageURL = actionsAssets[action].imageURL = [];
        const loadedImages = actionsAssets[action].loadedImages = [];
        for (let fileIndex = 0; fileIndex < actions[action].filesCount; fileIndex++) {
            const filePath = baseURL + `horse-${action}-0${fileIndex}.png`
            imageURL.push(filePath)
            actionsAssets.totalImageCount++
        }
        imageURL.forEach(src => {
            const image = new Image();
            image.src = src;
            image.onload = () => {
                actionsAssets.totalLoadedImageCount++
                if (actionsAssets.totalLoadedImageCount === actionsAssets.totalImageCount) {
                    // startDraw()
                    launchGame()
                }
            }
            loadedImages.push(image);

        });
    }
}

function render(loadedImages, speed, distance, isOnceAction = false, currentImageIndex = 0) {
    const canvasWidth = canvas.width
    const imgWidth = loadedImages[currentImageIndex].width
    return new Promise(resolve => {
        clearInterval(currentLoop)
        currentLoop = setInterval(() => {
            position.x = (position.x + distance + imgWidth) > canvasWidth ? (distance - imgWidth) % canvasWidth : (position.x + distance)
            let currentImage = loadedImages[currentImageIndex]
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(currentImage, position.x, position.y);
            if (isOnceAction && (currentImageIndex + 1) >= loadedImages.length) {
                clearInterval(currentLoop)
                resolve(true);
            }
            currentImageIndex = (currentImageIndex + 1) % loadedImages.length
        }, 1000 / speed)
    })
}
async function startDraw() {
    playSound('bend')
    await render(actionsAssets['bend'].loadedImages, 7, 0, true)
    await render(actionsAssets['bend'].loadedImages.reverse(), 7, 0, true)
    stopSound()
    actionsAssets['bend'].loadedImages.reverse()
    await delay(1000)
    await render(actionsAssets['jump'].loadedImages, 10, 15, true)
    playSound('run')
    render(actionsAssets['run'].loadedImages, 15, 10, false)
    await delay(3000)
    startDraw()
}
async function launchGame() {
    playSound('run')
    render(actionsAssets['run'].loadedImages, 15, 10, false)
}
async function keyPressed(e) {
    if (e.keyCode != 32 || IS_JUMPING_NOW) return
    IS_JUMPING_NOW = true
    playSound('bend')
    await render(actionsAssets['jump'].loadedImages, 10, 15, true)
    IS_JUMPING_NOW = false
    launchGame()
}
async function delay(delayInMS) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, delayInMS);
    });
}

function playSound(action) {
    audio_element.src = `assets/sounds/${action}_fx.mp3`
    audio_element.play();
}
function stopSound() {
    audio_element.pause();
}