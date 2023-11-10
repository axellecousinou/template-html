// containers
const mainContainer = document.getElementById("mainContainer")
const adminContainer = document.getElementById("adminContainer")
const width = 600
const height = 600

// pebbles
const div = 20
const pebbleApproximateSize = width/div
const randomOffsetPercent = 100
const colorList = ["#BAA963", "#B78C58", "#AF9B53", "#997C35"]

// hover
const hoverCircle = document.getElementById("hoverCircle")
const hoverRadius = 100
const minRadiusThreshold = 50
const defaultScale = 0.85
const thresholdScale = 1
const maxScale = 1.3
const defaultScaleDelay = 750 // ms

// chunks
const chunkXNum = Math.floor(width/(hoverRadius*2))
const chunkYNum = Math.floor(height/(hoverRadius*2))

// circle
const shouldBeCircle = true
const circleRadius = 300


// create points
let pointList = []
for (let i = 0; i <=width/div; i++) {
    let newLine = []
    for (let j = 0; j <=height/div; j++) {
        let borderX = i == 0 || i == width/div ? 0 : 1
        let borderY = j == 0 || j == height/div ? 0 : 1
        x = i*div + Math.round(Math.random()*(randomOffsetPercent/100*div)*borderX)
        y = j*div + Math.round(Math.random()*(randomOffsetPercent/100*div)*borderY)

        newLine.push([x,y])
    }
    pointList.push(newLine)
}


//display points
for (let i = 0; i <pointList.length; i++) {
    for (let j = 0; j<pointList[0].length; j++) {
        let newPoint = document.createElement("div")
        newPoint.className = "point"
        newPoint.style.left = pointList[i][j][0] + "px"
        newPoint.style.top = pointList[i][j][1] + "px"
        newPoint.style.zIndex = 10
        adminContainer.appendChild(newPoint)
    }
}


// create chunks 
chunkList = []
for (let i=0; i<chunkXNum; i++) {
    newChunkList = []
    for (let j=0; j<chunkYNum; j++) {
        newChunk = []
        newChunkList.push(newChunk)
    }
    chunkList.push(newChunkList)
}

// display chunks
const chunkWidth = width/chunkXNum
const chunkHeight = height/chunkYNum

for (let i=0; i<chunkXNum; i++) {
    for (let j=0; j<chunkYNum; j++) {
        let newChunk = document.createElement("div")
        newChunk.className = "chunk"
        newChunk.style.width = chunkWidth + "px"
        newChunk.style.height = chunkHeight + "px"
        newChunk.style.left = i*chunkWidth + "px"
        newChunk.style.top = j*chunkHeight + "px"
        newChunk.style.zIndex = 10
        adminContainer.appendChild(newChunk)

    }
}


// create pebble
let pebbleList = []
for (let i = 0; i < pointList.length-1; i++) {
    for (let j = 0; j<pointList[0].length-1; j++) {
        let newPebbleCoos = [pointList[i][j],pointList[i][j+1],pointList[i+1][j],pointList[i+1][j+1]]
        this.createPolygon(newPebbleCoos[0][0],newPebbleCoos[0][1],newPebbleCoos[1][0],newPebbleCoos[1][1],
            newPebbleCoos[2][0],newPebbleCoos[2][1],newPebbleCoos[3][0],newPebbleCoos[3][1])
    }
}

for (let newPebble of pebbleList) {
    if (newPebble) {
        newPebble.style.transform = "scale(0)"
        newPebble.style.rotate = Math.random()*180 - 90 + "deg"
        newPebble.style.opacity = 0
        mainContainer.appendChild(newPebble)
        setTimeout(function() {
            newPebble.style.transition = "transform 3s ease, rotate 2s ease, opacity 2s ease"
            newPebble.style.transform = "scale("+defaultScale+")"
            newPebble.style.rotate = "0deg"
            newPebble.style.opacity = 1
        }, 100)
    }
}


// hovering 
hoverCircle.style.width = hoverRadius*2 + "px"
hoverCircle.style.height = hoverRadius*2 + "px"

setTimeout(function() {
    document.addEventListener("mousemove", (event) => {
        const boundingRectX = mainContainer.getBoundingClientRect().x
        const boundingRectY = mainContainer.getBoundingClientRect().y
    
        hoverCircle.style.left = event.clientX + "px"
        hoverCircle.style.top = event.clientY + "px"
    
        const chunkX = Math.floor((event.clientX - boundingRectX)/chunkWidth)
        const chunkY = Math.floor((event.clientY - boundingRectY)/chunkHeight)
        
        if (chunkX >= 0 && chunkX < chunkXNum && chunkY >= 0 && chunkY < chunkYNum) { 
            // Loop over pebble in chunk
            for (let pebble of chunkList[chunkX][chunkY]) {
                const distance = this.distance(pebble.center[0],pebble.center[1],event.clientX - boundingRectX, event.clientY - boundingRectY)
                if (distance < hoverRadius) {
                    pebble.object.style.transition = "transform 0.3s ease"
                    if (distance < minRadiusThreshold) {
                        pebble.object.style.transform = "scale("+maxScale+")"
    
                        setTimeout(function() {
                            pebble.object.style.transition = "transform 2s ease"
                            pebble.object.style.transform = "scale("+defaultScale+")"
                        }, defaultScaleDelay);
                    } else {
                        pebble.object.style.transform = "scale("+this.newScale(distance)+")"
    
                        setTimeout(function() {
                            pebble.object.style.transition = "transform 2s ease"
                            pebble.object.style.transform = "scale("+defaultScale+")"
                        }, defaultScaleDelay);
                    }
                }
            }
        }
        
    });
}, 4000);


// change circle values
const circleOverlay = document.getElementById("circleOverlay")
circleOverlay.style.width = circleRadius*2 + "px"
circleOverlay.style.height = circleRadius*2 + "px"
circleOverlay.style.border = pebbleApproximateSize*2 + "px solid #5A337B"



function createPolygon(x1, y1, x2, y2, x3, y3, x4, y4) {
    let newPebble = document.createElement("div")
    newPebble.className = "pebble"

    const minX = Math.min(x1,x2)
    const minY = Math.min(y1,y3) 
    const maxX = Math.max(x3,x4)
    const maxY = Math.max(y2,y4)

    const pebbleWidth = maxX - minX
    const pebbleHeight = maxY - minY

    const centerX = minX + pebbleWidth/2
    const centerY = minY + pebbleHeight/2


    newPebble.style.width = pebbleWidth + "px"
    newPebble.style.height = pebbleHeight + "px"
    newPebble.style.left = minX + "px"
    newPebble.style.top = minY + "px"
    newPebble.style.clipPath = "polygon(" + (x1-minX) + "px " + (y1-minY) + "px, " + (x2-minX) + "px " + (y2-minY) + "px, "
         + (x4-minX) + "px " + (y4-minY) + "px, " + (x3-minX) + "px " + (y3-minY) + "px)"

    newPebble.style.backgroundColor = colorList[Math.floor(Math.random()*colorList.length)]

    adminContainer.appendChild(newPebble.cloneNode())


    if (shouldBeCircle) {
        if (this.distance(centerX, centerY, width/2, height/2) > circleRadius + pebbleApproximateSize) {
            return
        }
    }

    // full pebble List
    pebbleList.push(newPebble)


    // populate chunkList with pebble
    const chunkX = Math.floor((minX + pebbleWidth/2)/chunkWidth)
    const chunkY = Math.floor((minY + pebbleHeight/2)/chunkHeight)
    chunkList[chunkX][chunkY].push({
        center: [centerX, centerY],
        object: newPebble
    })


    return newPebble
}


function distance(x1, y1, x2, y2) {
    return (Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)))
}

a = (thresholdScale-defaultScale)/(minRadiusThreshold-hoverRadius)
b = thresholdScale - (thresholdScale-defaultScale)/(minRadiusThreshold-hoverRadius)*(minRadiusThreshold)
function newScale(distance) {
    return a*distance + b
}