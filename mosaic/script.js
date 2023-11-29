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


// create pebble
let pebbleList = []
for (let i = 0; i < pointList.length-1; i++) {
    for (let j = 0; j<pointList[0].length-1; j++) {
        let newPebbleCoos = [pointList[i][j],pointList[i][j+1],pointList[i+1][j],pointList[i+1][j+1]]
        let newPebble = this.createPolygon(newPebbleCoos[0][0],newPebbleCoos[0][1],newPebbleCoos[1][0],newPebbleCoos[1][1],
            newPebbleCoos[2][0],newPebbleCoos[2][1],newPebbleCoos[3][0],newPebbleCoos[3][1])

        // full pebble List
        pebbleList.push(newPebble)
    }
}

for (let newPebble of pebbleList) {
    mainContainer.appendChild(newPebble)
    adminContainer.appendChild(newPebble.cloneNode())
}


function createPolygon(x1, y1, x2, y2, x3, y3, x4, y4) {
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

    return newPebble
}