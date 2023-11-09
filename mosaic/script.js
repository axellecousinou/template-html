const container1 = document.getElementById("container1")
const container2 = document.getElementById("container2")
const height = 500
const width = 500
const div = 25

const randomOffset = 20

const colorList = ["#BAA963", "#B78C58", "#AF9B53", "#997C35"]



// create points
let pointList = []
for (let i = 0; i <=width/div; i++) {
    let newLine = []
    for (let j = 0; j <=height/div; j++) {
        let borderX = i == 0 || i == width/div ? 0 : 1
        let borderY = j == 0 || j == height/div ? 0 : 1
        x = i*div + Math.round(Math.random()*randomOffset*borderX)
        y = j*div + Math.round(Math.random()*randomOffset*borderY)

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
        container1.appendChild(newPoint)
    }
}


// create pebble
let pebbleList = []
for (let i = 0; i < pointList.length-1; i++) {
    for (let j = 0; j<pointList[0].length-1; j++) {
        let newPebbleCoos = [pointList[i][j],pointList[i][j+1],pointList[i+1][j],pointList[i+1][j+1]]
        let newPebble = this.createPolygon(newPebbleCoos[0][0],newPebbleCoos[0][1],newPebbleCoos[1][0],newPebbleCoos[1][1],
            newPebbleCoos[2][0],newPebbleCoos[2][1],newPebbleCoos[3][0],newPebbleCoos[3][1])
        container1.appendChild(newPebble)

        let newPebble2 = this.createPolygon2(newPebbleCoos[0][0],newPebbleCoos[0][1],newPebbleCoos[1][0],newPebbleCoos[1][1],
            newPebbleCoos[2][0],newPebbleCoos[2][1],newPebbleCoos[3][0],newPebbleCoos[3][1])
        container2.appendChild(newPebble2)
    }
}


function createPolygon2(x1, y1, x2, y2, x3, y3, x4, y4) {
    let newPebble = document.createElement("div")
    newPebble.className = "pebble"

    minX = Math.min(x1,x2)
    minY = Math.min(y1,y3) 
    maxX = Math.max(x3,x4)
    maxY = Math.max(y2,y4)

    pebbleWidth = maxX - minX
    pebbleHeight = maxY - minY

    newPebble.style.width = pebbleWidth + "px"
    newPebble.style.height = pebbleHeight + "px"
    newPebble.style.left = minX + "px"
    newPebble.style.top = minY + "px"
    newPebble.style.clipPath = "polygon(" + (x1-minX) + "px " + (y1-minY) + "px, " + (x2-minX) + "px " + (y2-minY) + "px, "
         + (x4-minX) + "px " + (y4-minY) + "px, " + (x3-minX) + "px " + (y3-minY) + "px)"

    newPebble.style.backgroundColor = colorList[Math.floor(Math.random()*colorList.length)]
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