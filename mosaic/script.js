// containers
const mainContainer = document.getElementById("mainContainer")
const adminContainer = document.getElementById("adminContainer")
const width = 600
const height = 600

// pebbles
const div = 15
const pebbleApproximateSize = width/div

// beautifying pebbles
const randomOffsetPercent = 80
const gapSize = 1
const colorList = ["#BAA963", "#B78C58", "#AF9B53", "#997C35"]
const backgroundColor = "#5A337B"
const circleRadius = 280
const animationDuration = 2000

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

// create pebble
let pebbleList = []
for (let i = 0; i < pointList.length-1; i++) {
    for (let j = 0; j<pointList[0].length-1; j++) {
        let newPebbleCoos = [pointList[i][j],pointList[i][j+1],pointList[i+1][j],pointList[i+1][j+1]]
        let newPebble = this.createPolygon(newPebbleCoos[0][0],newPebbleCoos[0][1],newPebbleCoos[1][0],newPebbleCoos[1][1],
            newPebbleCoos[2][0],newPebbleCoos[2][1],newPebbleCoos[3][0],newPebbleCoos[3][1])

        // full pebble List
        if (newPebble) {
            pebbleList.push(newPebble)
        }
        
    }
}

// add pebble to map
for (let newPebble of pebbleList) {
    mainContainer.appendChild(newPebble)
}


// functions
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

    // remove pebble if not in circle
    const centerX = minX + pebbleWidth/2
    const centerY = minY + pebbleHeight/2
    const distancetoCenter = this.distance(centerX,centerY,width/2,height/2)
    if (circleRadius != undefined) {
        if (distancetoCenter > circleRadius) {
            return
        } else if (distancetoCenter + div > circleRadius) {
            if (this.distance(x1,y1,width/2,height/2) > circleRadius) {
                [x1,y1] = this.mapPointToCircle(x1, y1)
            }
            if (this.distance(x2,y2,width/2,height/2) > circleRadius) {
                [x2,y2] = this.mapPointToCircle(x2, y2)
            }
            if (this.distance(x3,y3,width/2,height/2) > circleRadius) {
                [x3,y3] = this.mapPointToCircle(x3, y3)
            }
            if (this.distance(x4,y4,width/2,height/2) > circleRadius) {
                [x4,y4] = this.mapPointToCircle(x4, y4)
            }
        }
    }

    const delay = distancetoCenter/circleRadius*1000
    newPebble.animate([
        // key frames
        { scale: 0, easing: 'ease', offset: 0 },
        { scale: 1.2, easing: 'ease-out', offset: 0.7},
        { scale: 1, easing: 'ease-in', offset: 1 }
        ], {
        // sync options
        duration: animationDuration,
        delay: delay,
        fill: "forwards",
    });

    const newColor = this.colourGradient(1-distancetoCenter/circleRadius, 
        colorList[Math.floor(Math.random()*colorList.length)],backgroundColor)
    newPebble.style.backgroundColor = newColor

    // reorder coordinates
    const orderedx1 = (x3-minX)
    const orderedy1 = (y3-minY)
    const orderedx2 = (x4-minX)
    const orderedy2 = (y4-minY)
    const orderedx3 = (x2-minX)
    const orderedy3 = (y2-minY)
    const orderedx4 = (x1-minX)
    const orderedy4 = (y1-minY)

    // reduce size of pebble to let background appear
    const [finalx1,finaly1,finalx2,finaly2,finalx3,finaly3,finalx4,finaly4] = this.computeSizeReductionQuadrilateral(orderedx1,orderedy1,orderedx2,orderedy2,orderedx3,orderedy3,orderedx4,orderedy4,gapSize)
     
    newPebble.style.clipPath = "polygon(" + finalx1 + "px " + finaly1 + "px, " + finalx2 + "px " + finaly2 + "px, "
         + finalx3 + "px " + finaly3 + "px, " + finalx4 + "px " + finaly4 + "px)"

    return newPebble
}


function mapPointToCircle(x,y) {
    const a = (height/2-y)/(width/2-x)
    const distance = this.distance(x,y,width/2,height/2)
    const side = x < width/2 ? 1 : -1
    const angle = Math.atan(a)
    const newX = side*(distance-circleRadius)*Math.cos(angle) + x
    const newY = side*(distance-circleRadius)*Math.sin(angle) + y

    return [newX, newY]
}


function computeSizeReductionQuadrilateral(x1, y1, x2, y2, x3, y3, x4, y4, reduction) {
    const firstA = (y3-y1)/(x3-x1)
    const firstDistance = this.distance(x1,y1,x3,y3)
    const firstAlpha = Math.atan(firstA)
    const newx1 = -reduction*Math.cos(firstAlpha) + x1
    const newy1 = -reduction*Math.sin(firstAlpha) + y1
    const newx3 = -(firstDistance-reduction)*Math.cos(firstAlpha) + x1
    const newy3 = -(firstDistance-reduction)*Math.sin(firstAlpha) + y1

    const secondA = (y4-y2)/(x4-x2)
    const secondDistance = this.distance(x2,y2,x4,y4)
    const secondAlpha = Math.atan(secondA)
    const newx2 = -reduction*Math.cos(secondAlpha) + x2
    const newy2 = -reduction*Math.sin(secondAlpha) + y2
    const newx4 = -(secondDistance-reduction)*Math.cos(secondAlpha) + x2
    const newy4 = -(secondDistance-reduction)*Math.sin(secondAlpha) + y2

    return [newx1,newy1,newx2,newy2,newx3,newy3,newx4,newy4]
}


function distance(x1,y1,x2,y2) {
    return Math.sqrt((y2-y1)*(y2-y1) + (x2-x1)*(x2-x1))
}


function computeQuadrilateralSurface(x1, y1, x2, y2, x3, y3, x4, y4, width, height) {
    const surfaceT1 = x1*y4/2
    const surfaceT2 = (width-x1)*y2/2
    const surfaceT3 = (width-x3)*(height-y2)/2
    const surfaceT4 = x3*(height-y4)/2
    return width*height - (surfaceT1 + surfaceT2 + surfaceT3 + surfaceT4)
}



function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex([r, g, b]) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

function colourGradient(p, hexBeginning, hexEnd){
    const rgb_beginning = hexToRgb(hexBeginning)
    const rgb_end = hexToRgb(hexEnd)

    var w = p * 2 - 1;
    var w1 = (w + 1) / 2.0
    var w2 = 1 - w1;
    var rgb = [parseInt(rgb_beginning["r"] * w1 + rgb_end["r"] * w2),
        parseInt(rgb_beginning["g"] * w1 + rgb_end["g"] * w2),
        parseInt(rgb_beginning["b"] * w1 + rgb_end["b"] * w2)];

    return rgbToHex(rgb);
};