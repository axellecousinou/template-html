const container1 = document.getElementById("container1")
const container2 = document.getElementById("container2")
const height = 500
const width = 500
const div = 25

const randomOffsetPercent = 100

const colorList = ["#BAA963", "#B78C58", "#AF9B53", "#997C35"]

const hoverCircle = document.getElementById("hoverCircle")
const hoverRadius = 100
const minRadiusThreshold = 50
const defaultScale = 0.85
const thresholdScale = 1
const maxScale = 1.2

const chunkXNum = Math.floor(width/(hoverRadius*2))
const chunkYNum = Math.floor(height/(hoverRadius*2))


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
        container1.appendChild(newPoint)
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
        container1.appendChild(newChunk)

    }
}


// create pebble
let pebbleList = []
for (let i = 0; i < pointList.length-1; i++) {
    for (let j = 0; j<pointList[0].length-1; j++) {
        let newPebbleCoos = [pointList[i][j],pointList[i][j+1],pointList[i+1][j],pointList[i+1][j+1]]

        let newPebble2 = this.createPolygon2(newPebbleCoos[0][0],newPebbleCoos[0][1],newPebbleCoos[1][0],newPebbleCoos[1][1],
            newPebbleCoos[2][0],newPebbleCoos[2][1],newPebbleCoos[3][0],newPebbleCoos[3][1])
        container2.appendChild(newPebble2)

        // old pebble just for understanding
        let newPebble = this.createPolygon(newPebbleCoos[0][0],newPebbleCoos[0][1],newPebbleCoos[1][0],newPebbleCoos[1][1],
            newPebbleCoos[2][0],newPebbleCoos[2][1],newPebbleCoos[3][0],newPebbleCoos[3][1])
        container1.appendChild(newPebble)
    }
}


// hovering 
hoverCircle.style.width = hoverRadius*2 + "px"
hoverCircle.style.height = hoverRadius*2 + "px"

document.addEventListener("mousemove", (event) => {
    const boundingRectX = container2.getBoundingClientRect().x
    const boundingRectY = container2.getBoundingClientRect().y

    hoverCircle.style.left = event.clientX + "px"
    hoverCircle.style.top = event.clientY + "px"

    const chunkX = Math.floor((event.clientX - boundingRectX)/chunkWidth)
    const chunkY = Math.floor((event.clientY - boundingRectY)/chunkHeight)
    
    if (chunkX >= 0 && chunkX < chunkXNum && chunkY >= 0 && chunkY < chunkYNum) { 
        // Loop over pebble in chunk
        for (let pebble of chunkList[chunkX][chunkY]) {
            const distance = this.distance(pebble.center[0],pebble.center[1],event.clientX - boundingRectX, event.clientY - boundingRectY)
            if (distance < hoverRadius) {
                pebble.object.style.transition = "transform 0.15s ease"
                if (distance < minRadiusThreshold) {
                    pebble.object.style.transform = "scale("+maxScale+")"

                    setTimeout(function() {
                        pebble.object.style.transition = "transform 2s ease"
                        pebble.object.style.transform = "scale("+defaultScale+")"
                    }, 100);
                } else {
                    const newScale = thresholdScale + (thresholdScale-defaultScale)/(minRadiusThreshold-hoverRadius)*(distance-minRadiusThreshold)
                    pebble.object.style.transform = "scale("+newScale+")"

                    setTimeout(function() {
                        pebble.object.style.transition = "transform 2s ease"
                        pebble.object.style.transform = "scale("+defaultScale+")"
                    }, 100);
                }
            } else {
                /*pebble.object.style.transition = "transform 2s ease"
                pebble.object.style.transform = "scale("+defaultScale+")"*/
            }
        }
    }

    /*
    for (let i=0; i<chunkXNum; i++) {
        for (let j=0; j<chunkYNum; j++) {
            if (i != chunkX && j != chunkY) {
                for (let pebble of chunkList[i][j]) {
                    pebble.object.style.transition = "transform 2s ease"
                    pebble.object.style.transform = "scale("+defaultScale+")"
                }
            }
        }
    }*/
    
});


function createPolygon2(x1, y1, x2, y2, x3, y3, x4, y4) {
    let newPebble = document.createElement("div")
    newPebble.className = "pebble"

    const minX = Math.min(x1,x2)
    const minY = Math.min(y1,y3) 
    const maxX = Math.max(x3,x4)
    const maxY = Math.max(y2,y4)

    const pebbleWidth = maxX - minX
    const pebbleHeight = maxY - minY

    newPebble.style.width = pebbleWidth + "px"
    newPebble.style.height = pebbleHeight + "px"
    newPebble.style.left = minX + "px"
    newPebble.style.top = minY + "px"
    newPebble.style.clipPath = "polygon(" + (x1-minX) + "px " + (y1-minY) + "px, " + (x2-minX) + "px " + (y2-minY) + "px, "
         + (x4-minX) + "px " + (y4-minY) + "px, " + (x3-minX) + "px " + (y3-minY) + "px)"

    newPebble.style.backgroundColor = colorList[Math.floor(Math.random()*colorList.length)]


    // full pebble List
    pebbleList.push({
        center: [minX + pebbleWidth/2, minY + pebbleHeight/2],
        object: newPebble
    })


    // populate chunkList with pebble
    const chunkX = Math.floor((minX + pebbleWidth/2)/chunkWidth)
    const chunkY = Math.floor((minY + pebbleHeight/2)/chunkHeight)
    chunkList[chunkX][chunkY].push({
        center: [minX + pebbleWidth/2, minY + pebbleHeight/2],
        object: newPebble
    })


    return newPebble
}


function createPolygon(x1, y1, x2, y2, x3, y3, x4, y4) {
    let newPebble = document.createElement("div")
    newPebble.className = "falsePebble"
    newPebble.style.clipPath = "polygon(" + x1 + "px " + y1 + "px, " + x2 + "px " + y2 + "px, "
         + x4 + "px " + y4 + "px, " + x3 + "px " + y3 + "px)"
    newPebble.style.backgroundColor = colorList[Math.floor(Math.random()*colorList.length)]
    return newPebble
}


function distance(x1, y1, x2, y2) {
    return (Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)))
}