
const recordTime = Date.now()

// map grid to be 32X32 as 1 unit
const gameBaseGridSize = 32
const gameXGridNumber = 21
const gameYGridNumber = 10
const gameImagesAreaHeight = gameBaseGridSize * gameYGridNumber //17*32 = 544 should match with css
const gameImagesAreaWidth = gameBaseGridSize * gameXGridNumber //42*32 = 1344 should match with css

let showGridSize = gameBaseGridSize //this will be changed in other function

let mapTileList = []
let gameItemList = {}
let scoreFactorList = {}
let landCount = 0
let gameScore = 0
let displayScore = document.querySelector('#gameScore')
let ctxLayer40Alpha = 0.9

let scoreCheckingGroups = {
    group0: [],
    group1: [],
    group2: [],
    group3: [],
    group4: [],
    group5: [],
    group6: [],
    group7: [],
    group8: [],
    group9: []
}


// ========for stop edit mode =======================================================================

let actionStopList = {
    isStopAddLand: true,
    isStopRemoveLand: true,
    isStopAddPlant: true,
    isStopRemovePlant: true
}

let editButtonList = {
    addLandButton: "background-color:rgb(240,240,240);",
    removeLandButton: "background-color:rgb(240,240,240);",
    addPlantButton: "background-color:rgb(240,240,240);",
    removePlantButton: "background-color:rgb(240,240,240);"
}


//==========================================Mouse Press Detect================================
let mouseIsDown = false
let mouseIsUp = false

function mousePressed() {
    if (mouseIsDown && !mouseIsUp) {
        return true
    } else {
        return false
    }
}
document.addEventListener('mousedown', () => {
    mouseIsDown = true
    mouseIsUp = false
})
document.addEventListener('mouseup', () => {
    mouseIsUp = true
    mouseIsDown = false
})
//==========================================Mouse Press Detect End================================

// 3 layer canvas
const gameDisplayLayer0 = document.querySelector('#gameDisplayLayer0') //for land tile
const gameDisplayLayer10 = document.querySelector('#gameDisplayLayer10') //for non animation game items
const gameDisplayLayer20 = document.querySelector('#gameDisplayLayer20') //for mouse move highlight at edit mode
const gameDisplayLayer30 = document.querySelector('#gameDisplayLayer30') //for grid display at edit mode
const gameDisplayLayer40 = document.querySelector('#gameDisplayLayer40') //for text showing animation 

gameDisplayLayer0.height = gameImagesAreaHeight;
gameDisplayLayer0.width = gameImagesAreaWidth;

gameDisplayLayer10.height = gameImagesAreaHeight;
gameDisplayLayer10.width = gameImagesAreaWidth;

gameDisplayLayer20.height = gameImagesAreaHeight;
gameDisplayLayer20.width = gameImagesAreaWidth;

gameDisplayLayer30.height = gameImagesAreaHeight;
gameDisplayLayer30.width = gameImagesAreaWidth;

gameDisplayLayer40.height = gameImagesAreaHeight;
gameDisplayLayer40.width = gameImagesAreaWidth;

const ctxLayer0 = gameDisplayLayer0.getContext('2d')
const ctxLayer10 = gameDisplayLayer10.getContext('2d')
const ctxLayer20 = gameDisplayLayer20.getContext('2d')
const ctxLayer30 = gameDisplayLayer30.getContext('2d')
const ctxLayer40 = gameDisplayLayer40.getContext('2d')

const mapTiles = new Image();
const trees = new Image();
const plantTiles = new Image();
const house = new Image();

// using callback to make sure all image were loaded before draw things
mapTiles.onload = () => {
    trees.onload = () => {
        plantTiles.onload = () => {
            house.onload = () => {
                requestRecordAndDrawWorld()
            }
            house.src = './gameImages/house/houseImage.png'
        }
        plantTiles.src = './gameImages/plants/plantsImage.png';
    }
    trees.src = './gameImages/trees/tree.png';
}
mapTiles.src = './gameImages/map/island.png';


async function requestRecordAndDrawWorld() {

    // fetch record from server
    const requestRecord = await fetch(`/requestRecord/`, {
        method: "get"
    });
    const result = await requestRecord.json();

    // fill in data to this js
    mapTileList = result.map
    gameItemList = result.game_item_record
    gameScore = result.lastScoreRecord.score

    for (let factor in result.scoreFactorList) {
        scoreFactorList[factor] = result.scoreFactorList[`${factor}`]
    }



    drawWorld();
    loginMessage();
    startCalculateScore()
}


function drawWorld() {
    drawGround()
    drawGroundEdge()
    drawPlants()
    randomGroupingPlants()

}

//popUp message when enter game page
function loginMessage() {
    let popUpFrame = document.querySelector('#popUpFrame')

    popUpFrame.style = 'left: 560px; top:150px;'

    popUpFrame.innerHTML = ` 
     <div id="loginPopUp"> 
     <div id="closeButtonArea"><button id="closeButton">Close</button></div>
     <div><h1>Welcome to Pixel Farm </h1></div>
     </div>`

    let closeButton = document.querySelector('#closeButton');
    closeButton.addEventListener("click", () => {
        popUpFrame.innerHTML = ''
    })
}

//===================================================SET UP CLASS===============================
class cutMapTile {
    constructor(tileType, cutLocationX, cutLocationY, size, tileValue) {
        this.tileType = tileType;
        this.cutLocationX = cutLocationX;
        this.cutLocationY = cutLocationY;
        this.size = size
        this.tileValue = tileValue
    }
}

const sea = new cutMapTile('sea', 12, 1, 16, 0)
const ground = new cutMapTile('ground', 4.5, 0, 32, 10)

const outerCornerLT = new cutMapTile('outerCornerLT', 0, 0, 16, 1)
const outerCornerLB = new cutMapTile('outerCornerLB', 0, 2, 16, 1)
const outerCornerRT = new cutMapTile('outerCornerRT', 2, 0, 16, 1)
const outerCornerRB = new cutMapTile('outerCornerRB', 2, 2, 16, 1)

const innerCornerLT = new cutMapTile('outerCornerLT', 4, 2, 16, 1)
const innerCornerLB = new cutMapTile('outerCornerLB', 4, 1, 16, 1)
const innerCornerRT = new cutMapTile('outerCornerRT', 3, 2, 16, 1)
const innerCornerRB = new cutMapTile('outerCornerRB', 3, 1, 16, 1)

const topEdge = new cutMapTile('topEdge', 1, 0, 16, 1)
const bottomEdge = new cutMapTile('bottomEdge', 1, 2, 16, 1)
const leftEdge = new cutMapTile('leftEdge', 0, 1, 16, 1)
const rightEdge = new cutMapTile('rightEdge', 2, 1, 16, 1)


// stage 1 to 3 is life ,stage 4 is die.
class cutPlantTile {
    constructor(name, s0X, s0Y, s1X, s1Y, s2X, s2Y, s3X, s3Y, size) {
        this.name = name
        this.stage0cutX = s0X;
        this.stage0cutY = s0Y;
        this.stage1cutX = s1X;
        this.stage1cutY = s1Y;
        this.stage2cutX = s2X;
        this.stage2cutY = s2Y;
        this.stage3cutX = s3X;
        this.stage3cutY = s3Y;
        this.size = size
    }
}

const carrot = new cutPlantTile('carrot', 1, 0, 3, 0, 5, 0, 0, 33, 16)
const corn = new cutPlantTile('corn', 1, 4, 3, 4, 5, 4, 0, 33, 16)
const yellow_flower = new cutPlantTile('yellow_flower', 1, 33, 3, 33, 4, 33, 0, 33, 16)
const red_flower = new cutPlantTile('red_flower', 1, 18, 3, 18, 4, 18, 0, 33, 16)
const blue_flower = new cutPlantTile('blue_flower', 1, 16, 3, 16, 4, 16, 0, 33, 16)
const pumpkin = new cutPlantTile('pumpkin', 1, 3, 3, 3, 5, 3, 0, 33, 16)
const lettuce = new cutPlantTile('lettuce', 1, 8, 3, 8, 5, 8, 0, 33, 16)


class plantingBox {
    constructor(plantType, timeNow, stage, locationX, locationY) {
        this.plantType = plantType;
        this.stageChangeAt = timeNow
        this.stage = stage;
        this.x = locationX
        this.y = locationY
    }
}


class cutTreeFrames {
    constructor(name, f0X, f0Y, f1X, f1Y, f2X, f2Y, f3X, f3Y, size) {
        this.name = name
        this.frame0cutX = f0X;
        this.frame0cutY = f0Y;
        this.frame1cutX = f1X;
        this.frame1cutY = f1Y;
        this.frame2cutX = f2X;
        this.frame2cutY = f2Y;
        this.frame3cutX = f3X;
        this.frame3cutY = f3Y;
        this.size = size
    }
}

const green_trees = new cutTreeFrames('green_trees', 0, 3, 1, 3, 2, 3, 3, 3, 32)
const brown_trees = new cutTreeFrames('brown_trees', 0, 5, 1, 5, 2, 5, 3, 5, 32)


class cutHouseTile {
    constructor(name, X, Y, size) {
        this.name = name
        this.cutLocationX = X;
        this.cutLocationY = Y;
        this.size = size
    }
}

const small_house = new cutHouseTile(0, 0, 94)
const big_house = new cutHouseTile(1, 0, 94)



// ===================================SET UP A MAP GRID ===================================================

// for (let x = 0; x < gameXGridNumber; x++) {
//     mapTileList.push([])
// }
// for (let x = 0; x < gameXGridNumber; x++) {
//     for (let y = 0; y < gameYGridNumber; y++) {

//         mapTileList[x][y] = sea
//     }
// }

// add the first land
// mapTileList[5][5] = ground
// add the first plant
// gameItemList[`x${10}y${10}`] = new plantingBox(carrot, Date.now(), 2, 10, 10)
// gameItemList[`x${11}y${11}`] = new plantingBox(carrot, Date.now(), 2, 11, 11)
//add the plant to score checking group
// scoreCheckingGroups['group0'].push(`x${10}y${10}`)
// scoreCheckingGroups['group1'].push(`x${11}y${11}`)

// ==============SET UP A MAP GRID END =================================================================



// Input displayX,displayY number to grid number. Not actual X,Y.
function drawMapTile(tileType, displayGridX, displayGridY) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxLayer0.drawImage(mapTiles, tileType.cutLocationX * tileType.size, tileType.cutLocationY * tileType.size, tileType.size, tileType.size, displayGridX * 32, displayGridY * 32, tileType.size, tileType.size);
}

function drawPlantingBox(plant, stageNumber, displayGridX, displayGridY) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxLayer10.drawImage(plantTiles, plant[`stage${stageNumber}cutX`] * plant.size, plant[`stage${stageNumber}cutY`] * plant.size, plant.size, plant.size, displayGridX * 16, displayGridY * 16, plant.size, plant.size);
}

function drawTree(treeType, frameNumber, displayGridX, displayGridY) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxLayer10.drawImage(trees, treeType[`frame${frameNumber}cutX`] * treeType.size, treeType[`frame${frameNumber}cutY`] * treeType.size, treeType.size, treeType.size, (displayGridX * treeType.size) - (treeType.size * 0.25), (displayGridY * treeType.size) - (treeType.size / 2), treeType.size, treeType.size);
}


// display the grid by specified size
function showGrid(gridSize) {
    ctxLayer30.globalAlpha = 0.4
    ctxLayer30.lineWidth = 1;
    ctxLayer30.strokeStyle = 'rgb(255,255,255)';
    ctxLayer30.setLineDash([4, 2])
    for (let x = 0; x < gameXGridNumber * (gameBaseGridSize / gridSize)+1; x++) {
        ctxLayer30.beginPath();
        ctxLayer30.moveTo(x * gridSize, 0)
        ctxLayer30.lineTo(x * gridSize, gameYGridNumber * gameBaseGridSize)
        ctxLayer30.stroke();
    }
    for (let y = 0; y < gameYGridNumber * (gameBaseGridSize / gridSize)+1; y++) {
        ctxLayer30.beginPath();
        ctxLayer30.moveTo(0, y * gridSize)
        ctxLayer30.lineTo(gameXGridNumber * gameBaseGridSize, y * gridSize)
        ctxLayer30.stroke();
    }


}



function randomGroupingPlants() {
    for (let key of Object.keys(gameItemList)) {
        let randomGrouping = Math.floor(Math.random() * 10)
        scoreCheckingGroups[`group${randomGrouping}`].push(key)

    }
}

// draw the ground tile according the mapTileList
function drawGround() {
    for (let x = 0; x < gameXGridNumber; x++) {
        for (let y = 0; y < mapTileList[x].length; y++) {
            if (mapTileList[x][y].tileType == 'ground') {
                drawMapTile(ground, x, y)
                landCount += 1
            }
        }
    }
}

//temporary tree
// drawTree(green_trees, 0, x, y)
// drawTree(green_trees, 0, x, y + 0.5)
// drawTree(green_trees, 0, x + 0.5, y)
// drawTree(green_trees, 0, x + 0.5, y + 0.5)


// draw the plants with sorted gameItemList( must sort by y location)
function drawPlants() {
    let sortedKeys = Object.keys(gameItemList).sort((a, b) => {
        if (gameItemList[a]['y'] < gameItemList[b]['y']) {
            return -1
        } else if (gameItemList[a]['y'] > gameItemList[b]['y']) {
            return 1
        } else {
            return 0;
        }
    })

    for (let key of sortedKeys) {
        drawPlantingBox(gameItemList[key].plantType, gameItemList[key].stage, gameItemList[key].x, gameItemList[key].y)

    }
}



// checking the map tiles and draw the edge map tiles
function drawGroundEdge() {
    // draw the ground edge
    for (let x = 0; x < mapTileList.length; x++) {
        for (let y = 0; y < mapTileList[x].length; y++) {

            if (x <= 0 || y <= 0 || x + 1 >= mapTileList.length || y + 1 >= mapTileList[x].length) {       //to prevent -1 index error
                continue
            }

            // checking this tile.
            if (mapTileList[x][y].tileType === 'ground') {

                let top = mapTileList[x][y - 1].tileType
                let bottom = mapTileList[x][y + 1].tileType
                let left = mapTileList[x - 1][y].tileType
                let right = mapTileList[x + 1][y].tileType
                let rightTop = mapTileList[x + 1][y - 1].tileType
                let leftTop = mapTileList[x - 1][y - 1].tileType
                let rightBottom = mapTileList[x + 1][y + 1].tileType
                let leftBottom = mapTileList[x - 1][y + 1].tileType

                //draw top side edge tile
                if (top === 'sea') {
                    if (rightTop === 'sea') {
                        drawMapTile(topEdge, x + 0.5, y - 0.5)
                    } else {
                        drawMapTile(innerCornerLT, x + 0.5, y - 0.5)
                    }

                    if (leftTop === 'sea') {
                        drawMapTile(topEdge, x, y - 0.5)
                    } else {
                        drawMapTile(innerCornerRT, x, y - 0.5)
                    }
                }

                //draw bottom side edge tile
                if (bottom === 'sea') {
                    if (rightBottom === 'sea') {
                        drawMapTile(bottomEdge, x + 0.5, y + 1)
                    } else {
                        drawMapTile(innerCornerLB, x + 0.5, y + 1)
                    }

                    if (leftBottom === 'sea') {
                        drawMapTile(bottomEdge, x, y + 1)
                    } else {
                        drawMapTile(innerCornerRB, x, y + 1)
                    }
                }

                //draw right side edge tile
                if (right === 'sea') {
                    if (rightTop === 'sea') {
                        drawMapTile(rightEdge, x + 1, y)
                    } else {
                        drawMapTile(innerCornerRB, x + 1, y)
                    }

                    if (rightBottom === 'sea') {
                        drawMapTile(rightEdge, x + 1, y + 0.5)
                    } else {
                        drawMapTile(innerCornerRT, x + 1, y + 0.5)
                    }
                }

                //draw left side edge tile
                if (left === 'sea') {
                    if (leftTop === 'sea') {
                        drawMapTile(leftEdge, x - 0.5, y)
                    } else {
                        drawMapTile(innerCornerLB, x - 0.5, y)
                    }

                    if (leftBottom === 'sea') {
                        drawMapTile(leftEdge, x - 0.5, y + 0.5)
                    } else {
                        drawMapTile(innerCornerLT, x - 0.5, y + 0.5)
                    }
                }

                //draw left top corner tile
                if (leftTop === 'sea') {
                    if (top === 'sea' && left === 'sea') {
                        drawMapTile(outerCornerLT, x - 0.5, y - 0.5)
                    }
                }

                //draw right top corner tile
                if (rightTop === 'sea') {
                    if (top === 'sea' && right === 'sea') {
                        drawMapTile(outerCornerRT, x + 1, y - 0.5)
                    }
                }

                //draw left bottom corner tile
                if (leftBottom === 'sea') {
                    if (bottom === 'sea' && left === 'sea') {
                        drawMapTile(outerCornerLB, x - 0.5, y + 1)
                    }
                }

                //draw right bottom corner tile
                if (rightBottom === 'sea') {
                    if (bottom === 'sea' && right === 'sea') {
                        drawMapTile(outerCornerRB, x + 1, y + 1)
                    }
                }
            }
        }
    }
}




// clear all images on the specified ctx layer,
function clearLayer(ctxLayer) {
    ctxLayer.clearRect(0, 0, gameImagesAreaWidth, gameImagesAreaHeight)
}

// start to highlight mouse location and add land
function startAddLand() {
    document.addEventListener('mousemove', SAL);
    document.addEventListener('mousedown', addLand)
}
function SAL(event) {
    highLightAddLand(event)
    if (mousePressed()) {
        addLand(event)
    }
}

// start to highlight mouse location and remove land
function startRemoveLand() {
    document.addEventListener('mousemove', SRL);
    document.addEventListener('mousedown', removeLand)
}
function SRL(event) {
    highLightRemoveLand(event)
    if (mousePressed()) {
        removeLand(event)
    }
}


// start to highlight mouse location and add plant
function startAddPlant() {
    document.addEventListener('mousemove', SAP);
    document.addEventListener('mousedown', addPlant)
}
function SAP(event) {
    highLightAddPlant(event)
    if (mousePressed()) {
        addPlant(event)
    }
}


// start to highlight mouse location and remove plant
function startRemovePlant() {
    document.addEventListener('mousemove', SRP);
    document.addEventListener('mousedown', removePlant)
}
function SRP(event) {
    highLightRemovePlant(event)
    if (mousePressed()) {
        removePlant(event)
    }
}



//highlight mouse location when add plant
function highLightAddPlant(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer20.clientLeft) / (showGridSize * 2));
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer20.clientTop) / (showGridSize * 2));

    //clear previous highlight 
    ctxLayer20.clearRect(0, 0, gameDisplayLayer20.width, gameDisplayLayer20.height)
    ctxLayer20.beginPath();

    //draw the grid box
    ctxLayer20.rect(mouseXGrid * showGridSize, mouseYGrid * showGridSize, showGridSize, showGridSize);

    //control the grid box highlight color
    if (Math.floor(mouseXGrid / (gameBaseGridSize / showGridSize)) <= 0 || Math.floor(mouseYGrid / (gameBaseGridSize / showGridSize)) <= 0 || Math.floor(mouseXGrid / (gameBaseGridSize / showGridSize)) + 1 >= gameXGridNumber || Math.floor(mouseYGrid / (gameBaseGridSize / showGridSize)) + 1 >= gameYGridNumber) {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#FF0000';
        ctxLayer20.fill();

    } else if (gameItemList[`x${mouseXGrid}y${mouseYGrid}`]) {
        if (gameItemList[`x${mouseXGrid}y${mouseYGrid}`].stage === 3) {
            ctxLayer20.globalAlpha = 0.4
            ctxLayer20.fillStyle = '#00FF00';
            ctxLayer20.fill();
        } else {
            ctxLayer20.globalAlpha = 0.4
            ctxLayer20.fillStyle = '#FF0000';
            ctxLayer20.fill();
        }

    } else if (mapTileList[Math.floor(mouseXGrid * (showGridSize / gameBaseGridSize))][Math.floor(mouseYGrid * (showGridSize / gameBaseGridSize))].tileType === 'ground') {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#00FF00';
        ctxLayer20.fill();

    } else {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#FF0000';
        ctxLayer20.fill();
    }

}

//highlight mouse location when remove plant
function highLightRemovePlant(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer20.clientLeft) / (showGridSize * 2));
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer20.clientTop) / (showGridSize * 2));

    //clear previous highlight 
    ctxLayer20.clearRect(0, 0, gameDisplayLayer20.width, gameDisplayLayer20.height)
    ctxLayer20.beginPath();

    //draw the grid box
    ctxLayer20.rect(mouseXGrid * showGridSize, mouseYGrid * showGridSize, showGridSize, showGridSize);

    if (Math.floor(mouseXGrid / (gameBaseGridSize / showGridSize)) <= 0 || Math.floor(mouseYGrid / (gameBaseGridSize / showGridSize)) <= 0 || Math.floor(mouseXGrid / (gameBaseGridSize / showGridSize)) + 1 >= gameXGridNumber || Math.floor(mouseYGrid / (gameBaseGridSize / showGridSize)) + 1 >= gameYGridNumber) {
        return
    }
    //control the grid box highlight color
    if (gameItemList[`x${mouseXGrid}y${mouseYGrid}`]) {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#00FF00';
        ctxLayer20.fill();

    } else {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#FF0000';
        ctxLayer20.fill();
    }

}

//highlight mouse location when add land
function highLightAddLand(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to mapTileList
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer20.clientLeft) / (showGridSize * 2));
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer20.clientTop) / (showGridSize * 2));

    //clear previous highlight 
    ctxLayer20.clearRect(0, 0, gameDisplayLayer20.width, gameDisplayLayer20.height)
    ctxLayer20.beginPath();

    //draw the grid box
    ctxLayer20.rect(mouseXGrid * showGridSize, mouseYGrid * showGridSize, showGridSize, showGridSize);

    //control the grid box highlight color
    if (mouseXGrid <= 0 || mouseYGrid <= 0 || mouseXGrid + 1 >= gameXGridNumber || mouseYGrid + 1 >= gameYGridNumber) {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#FF0000';
        ctxLayer20.fill();
    } else if (mapTileList[mouseXGrid][mouseYGrid].tileType !== 'ground' && isNextToGround(mouseXGrid, mouseYGrid)) {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#00FF00';
        ctxLayer20.fill();
    } else {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#FF0000';
        ctxLayer20.fill();
    }

}

//highlight mouse location when remove land
function highLightRemoveLand(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to mapTileList
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer20.clientLeft) / (showGridSize * 2));
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer20.clientTop) / (showGridSize * 2));

    //clear previous highlight 
    ctxLayer20.clearRect(0, 0, gameDisplayLayer20.width, gameDisplayLayer20.height)
    ctxLayer20.beginPath();

    //draw the grid box
    ctxLayer20.rect(mouseXGrid * showGridSize, mouseYGrid * showGridSize, showGridSize, showGridSize);

    //control the grid box highlight color
    if (mouseXGrid <= 0 || mouseYGrid <= 0 || mouseXGrid + 1 >= gameXGridNumber || mouseYGrid + 1 >= gameYGridNumber) {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#FF0000';
        ctxLayer20.fill();
    } else if (mapTileList[mouseXGrid][mouseYGrid].tileType === 'ground' && landCount > 1) {
        if (gameItemList[`x${mouseXGrid * 2}y${mouseYGrid * 2}`] || gameItemList[`x${mouseXGrid * 2 + 1}y${mouseYGrid * 2}`] || gameItemList[`x${mouseXGrid * 2}y${mouseYGrid * 2 + 1}`] || gameItemList[`x${mouseXGrid * 2 + 1}y${mouseYGrid * 2 + 1}`]) {
            ctxLayer20.globalAlpha = 0.4
            ctxLayer20.fillStyle = '#FF0000';
            ctxLayer20.fill();
        } else {
            ctxLayer20.globalAlpha = 0.4
            ctxLayer20.fillStyle = '#00FF00';
            ctxLayer20.fill();
        }

    } else {
        ctxLayer20.globalAlpha = 0.4
        ctxLayer20.fillStyle = '#FF0000';
        ctxLayer20.fill();
    }

}

//add land with checking
function addLand(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to mapTileList
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer0.clientLeft) / (showGridSize * 2));
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer0.clientTop) / (showGridSize * 2));

    //check if mouse in un available area
    if (mouseXGrid <= 0 || mouseYGrid <= 0 || mouseXGrid + 1 >= mapTileList.length || mouseYGrid + 1 >= mapTileList[mouseXGrid].length) {
        return
    }

    if (mapTileList[mouseXGrid][mouseYGrid].tileType !== 'ground' && isNextToGround(mouseXGrid, mouseYGrid)) {

        mapTileList[mouseXGrid][mouseYGrid] = ground


        clearLayer(ctxLayer0)
        landCount = 0   //reset the counter
        drawGround()    //drawGround will recount the lands
        drawGroundEdge()

        gameScore -= 50

        displayScore.innerText = `Score:${gameScore}`

    }
}

//remove land with checking
function removeLand(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to mapTileList
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer0.clientLeft) / (showGridSize * 2));
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer0.clientTop) / (showGridSize * 2));

    //check if mouse in un available area
    if (mouseXGrid <= 0 || mouseYGrid <= 0 || mouseXGrid + 1 >= mapTileList.length || mouseYGrid + 1 >= mapTileList[mouseXGrid].length) {
        return
    }

    if (mapTileList[mouseXGrid][mouseYGrid].tileType === 'ground' && landCount > 1) {
        if (!gameItemList[`x${mouseXGrid * 2}y${mouseYGrid * 2}`] && !gameItemList[`x${mouseXGrid * 2 + 1}y${mouseYGrid * 2}`] && !gameItemList[`x${mouseXGrid * 2}y${mouseYGrid * 2 + 1}`] && !gameItemList[`x${mouseXGrid * 2 + 1}y${mouseYGrid * 2 + 1}`]) {
            mapTileList[mouseXGrid][mouseYGrid] = sea

            clearLayer(ctxLayer0)
            landCount = 0  //reset the counter
            drawGround()    //drawGround will recount the lands
            drawGroundEdge()
        }
    }
}

//add plant with checking
function addPlant(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to mapTileList
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer10.clientLeft) / (showGridSize * 2));
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer10.clientTop) / (showGridSize * 2));

    //check if mouse in un available area
    if (Math.floor(mouseXGrid / (gameBaseGridSize / showGridSize)) <= 0 || Math.floor(mouseYGrid / (gameBaseGridSize / showGridSize)) <= 0 || Math.floor(mouseXGrid / (gameBaseGridSize / showGridSize)) + 1 >= gameXGridNumber || Math.floor(mouseYGrid / (gameBaseGridSize / showGridSize)) + 1 >= gameYGridNumber) {
        return
    }


    if (gameItemList[`x${mouseXGrid}y${mouseYGrid}`]) {
        if (gameItemList[`x${mouseXGrid}y${mouseYGrid}`].stage === 3) {
            gameItemList[`x${mouseXGrid}y${mouseYGrid}`] = new plantingBox(carrot, Date.now(), 0, mouseXGrid, mouseYGrid)
            clearLayer(ctxLayer10)
            drawPlants()
            let randomGrouping = Math.floor(Math.random() * 10)
            scoreCheckingGroups[`group${randomGrouping}`].push(`x${mouseXGrid}y${mouseYGrid}`)
        }

    } else if (mapTileList[Math.floor(mouseXGrid * (showGridSize / gameBaseGridSize))][Math.floor(mouseYGrid * (showGridSize / gameBaseGridSize))].tileType === 'ground') {
        gameItemList[`x${mouseXGrid}y${mouseYGrid}`] = new plantingBox(carrot, Date.now(), 0, mouseXGrid, mouseYGrid)
        clearLayer(ctxLayer10)
        drawPlants()
        let randomGrouping = Math.floor(Math.random() * 10)
        scoreCheckingGroups[`group${randomGrouping}`].push(`x${mouseXGrid}y${mouseYGrid}`)
    }
}

//remove plant with checking
function removePlant(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to mapTileList
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer10.clientLeft) / (showGridSize * 2));
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer10.clientTop) / (showGridSize * 2));

    if (gameItemList[`x${mouseXGrid}y${mouseYGrid}`]) {

        delete gameItemList[`x${mouseXGrid}y${mouseYGrid}`]

        for (let group in scoreCheckingGroups) {
            if (scoreCheckingGroups[group].includes(`x${mouseXGrid}y${mouseYGrid}`)) {
                scoreCheckingGroups[group] = scoreCheckingGroups[group].filter(e => e !== `x${mouseXGrid}y${mouseYGrid}`)
                break
            }
        }



        clearLayer(ctxLayer10)
        drawPlants()
    }
}



//send player information JSON to server.
async function saveToServer() {
    // const content = {};
    const requestRecord = await fetch(`/updateItem`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 'map': mapTileList, 'game_item_record': gameItemList }),
    });

    const result = await requestRecord.json();


    if (result.message) {
        console.log(result.message);
    }

}

//check the map tile is next to another map tile or not
function isNextToGround(mouseXGrid, mouseYGrid) {
    let top = mapTileList[mouseXGrid][mouseYGrid - 1].tileValue
    let bottom = mapTileList[mouseXGrid][mouseYGrid + 1].tileValue
    let left = mapTileList[mouseXGrid - 1][mouseYGrid].tileValue
    let right = mapTileList[mouseXGrid + 1][mouseYGrid].tileValue
    let rightTop = mapTileList[mouseXGrid + 1][mouseYGrid - 1].tileValue
    let leftTop = mapTileList[mouseXGrid - 1][mouseYGrid - 1].tileValue
    let rightBottom = mapTileList[mouseXGrid + 1][mouseYGrid + 1].tileValue
    let leftBottom = mapTileList[mouseXGrid - 1][mouseYGrid + 1].tileValue
    let quickCheck = top + bottom + left + right + rightTop + rightBottom + leftTop + leftBottom

    if (quickCheck == 0) {
        return false
    } else {
        return true
    }
}

//clear all mouse listener for edit mode
function clearAllMouseListener() {
    document.removeEventListener('mousemove', SAL);
    document.removeEventListener('mousedown', addLand);

    document.removeEventListener('mousemove', SRL);
    document.removeEventListener('mousedown', removeLand);

    document.removeEventListener('mousemove', SAP);
    document.removeEventListener('mousedown', addPlant);

    document.removeEventListener('mousemove', SRP);
    document.removeEventListener('mousedown', removePlant);

}

//reset the isStopxxxxx to true ,except the specified one.  
function stopActionsExceptThis(exceptedAction) {
    for (let action in actionStopList) {
        if (action === exceptedAction) {
            continue
        } else {
            actionStopList[action] = true
        }
    }
}

// clear the red highlight on edit buttons
function clearButtonHighLight() {
    for (let button in editButtonList) {
        editButtonList[button] = 'background-color:rgb(240,240,240);'
    }
    addLandButton.style = editButtonList['addLandButton']
    removeLandButton.style = editButtonList['removeLandButton']
    addPlantButton.style = editButtonList['addPlantButton']
    removePlantButton.style = editButtonList['removePlantButton']
}


//===========================Score Calculation ================================================


function startCalculateScore() {
    for (let i = 0; i < Object.keys(scoreCheckingGroups).length; i++) {
        let checkingGroup = `group${i}`

        setTimeout(() => {
            // after onload, show the score start calculate
            let checkingTimeNow = Date.now()

            for (let gameItem of scoreCheckingGroups[checkingGroup]) {
                let itemName = gameItemList[gameItem].plantType.name
                let itemStage = gameItemList[gameItem].stage
                let itemStageChangeTime = gameItemList[gameItem].stageChangeAt
                let timeDuring = Math.round((checkingTimeNow - itemStageChangeTime) / 1000)

                //change plant stage with checking
                if (timeDuring > scoreFactorList[itemName][`stage_${itemStage}_life`] && itemStage < 3) {
                    gameItemList[gameItem].stage += 1
                    gameItemList[gameItem].stageChangeAt = checkingTimeNow

                    //redraw all plant
                    clearLayer(ctxLayer10)
                    drawPlants()

                    // console.log('===========================changed stage to:', gameItemList[gameItem].stage)
                }

                if(gameItemList[gameItem].stage == 3){
                    continue
                }
                gameScore += scoreFactorList[itemName][`stage_${itemStage}_score`]
            }            
            showTextToItems(checkingGroup)
            displayScore.innerText = `Score:${gameScore}`


            // set up regular 10s checking for score and stage
            let regularChecking = setInterval(() => {

                let checkingTimeNow = Date.now()

                for (let gameItem of scoreCheckingGroups[checkingGroup]) {
                    let itemName = gameItemList[gameItem].plantType.name
                    let itemStage = gameItemList[gameItem].stage
                    let itemStageChangeTime = gameItemList[gameItem].stageChangeAt
                    let timeDuring = Math.round((checkingTimeNow - itemStageChangeTime) / 1000)

                    //change plant stage with checking
                    if (timeDuring > scoreFactorList[itemName][`stage_${itemStage}_life`] && itemStage < 3) {
                        gameItemList[gameItem].stage += 1
                        gameItemList[gameItem].stageChangeAt = checkingTimeNow

                        //redraw all plant
                        clearLayer(ctxLayer10)
                        drawPlants()

                        // console.log('===========================changed stage to:', gameItemList[gameItem].stage)
                    }

                    if(gameItemList[gameItem].stage == 3){
                        continue
                    }
                    gameScore += scoreFactorList[itemName][`stage_${itemStage}_score`]
                }
                showTextToItems(checkingGroup)
                displayScore.innerText = `Score:${gameScore}`

            }, 10000)


        }, i * 1000)

    }
}

function showTextToItems(checkingGroup) {

    let animationFrame = 0
    let yMove = 0
    let moveUpRate = 2
    ctxLayer40.globalAlpha = ctxLayer40Alpha
    ctxLayer40.fillStyle = '#FFFF00'

    let TSA = setInterval(() => { textShowingAnimation() }, 50)

    function textShowingAnimation() {
        animationFrame++
        ctxLayer40.globalAlpha -= 0.04
        if (animationFrame < 20) {
            yMove += moveUpRate
            ctxLayer40.font = "12px Arial";
            clearLayer(ctxLayer40)
            for (let key of scoreCheckingGroups[checkingGroup]) {
                let scoreToAdd = scoreFactorList[gameItemList[key].plantType.name][`stage_${gameItemList[key].stage}_score`]
                if (scoreToAdd == 0) {
                    continue
                }
                let textToShow = `+${scoreToAdd}`
                ctxLayer40.fillText(textToShow, gameItemList[key].x * 16, gameItemList[key].y * 16 - yMove + 16)

            }

        } else {
            ctxLayer40.globalAlpha = ctxLayer40Alpha
            yMove = 0
            animationFrame = 0
            clearInterval(TSA)
            clearLayer(ctxLayer40)
        }
    }
}

//============================ animation ====================================================



// window.requestAnimationFrame(countTime)

// let time = 1
// function countTime() {
//     time++
//     console.log(time)
//     window.requestAnimationFrame(countTime)
// }



//================================== Button Listener ==========================================

// button for add land
let addLandButton = document.querySelector('#addLand');
addLandButton.addEventListener("click", () => {
    clearAllMouseListener()
    clearLayer(ctxLayer30)

    stopActionsExceptThis('isStopAddLand')
    clearButtonHighLight('addLandButton')

    actionStopList.isStopAddLand = !actionStopList.isStopAddLand;

    showGridSize = 32

    if (actionStopList.isStopAddLand) {
        clearAllMouseListener()
        clearLayer(ctxLayer30)
        addLandButton.style = 'background-color:rgb(240,240,240);'
    } else {
        addLandButton.style = 'background-color:rgb(220,50,50);'
        showGrid(showGridSize)
        startAddLand();
    }
})

// button for remove land
let removeLandButton = document.querySelector('#removeLand');
removeLandButton.addEventListener("click", () => {
    clearAllMouseListener()
    clearLayer(ctxLayer30)

    stopActionsExceptThis('isStopRemoveLand')
    clearButtonHighLight('removeLandButton')

    actionStopList.isStopRemoveLand = !actionStopList.isStopRemoveLand;

    showGridSize = 32

    if (actionStopList.isStopRemoveLand) {
        clearAllMouseListener()
        clearLayer(ctxLayer30)
        removeLandButton.style = 'background-color:rgb(240,240,240);'
    } else {
        removeLandButton.style = 'background-color:rgb(220,50,50);'
        showGrid(showGridSize)
        startRemoveLand();
    }
})



// button for add plant
let addPlantButton = document.querySelector('#addPlant');
addPlantButton.addEventListener("click", () => {
    clearAllMouseListener()
    clearLayer(ctxLayer30)

    stopActionsExceptThis('isStopAddPlant')
    clearButtonHighLight('addPlantButton')

    actionStopList.isStopAddPlant = !actionStopList.isStopAddPlant;

    showGridSize = 16

    if (actionStopList.isStopAddPlant) {
        clearAllMouseListener()
        clearLayer(ctxLayer30)
        addPlantButton.style = 'background-color:rgb(240,240,240);'
    } else {
        addPlantButton.style = 'background-color:rgb(220,50,50);'
        showGrid(showGridSize)
        startAddPlant()
    }
})

// button for remove plant
let removePlantButton = document.querySelector('#removePlant');
removePlantButton.addEventListener("click", () => {

    clearAllMouseListener()
    clearLayer(ctxLayer30)

    stopActionsExceptThis('isStopRemovePlant')
    clearButtonHighLight('removePlantButton')

    actionStopList.isStopRemovePlant = !actionStopList.isStopRemovePlant;

    showGridSize = 16

    if (actionStopList.isStopRemovePlant) {
        clearAllMouseListener()
        clearLayer(ctxLayer30)
        removePlantButton.style = 'background-color:rgb(240,240,240);'
    } else {
        removePlantButton.style = 'background-color:rgb(220,50,50);'
        showGrid(showGridSize)
        startRemovePlant()
    }
})

// button for popUP of player info page
let playerInfoButton = document.querySelector('#playerInfoButton');
playerInfoButton.addEventListener("click", () => {

    let popUpFrame = document.querySelector('#popUpFrame')
    popUpFrame.style = 'left: 40px; top:-40px;'

    popUpFrame.innerHTML = ` 
     <div id="innerFrame"> <div id="closeButtonArea"><button id="closeButton">Back to Game</button> </div><iframe id="innerFrameContent" src="./playerInfo.html"></iframe> </div>`

    let closeButton = document.querySelector('#closeButton');
    closeButton.addEventListener("click", () => {
        popUpFrame.innerHTML = ''
    })

})

// button for popUP of world ranking page
let rankingButton = document.querySelector('#rankingButton');
rankingButton.addEventListener("click", () => {

    let popUpFrame = document.querySelector('#popUpFrame')
    popUpFrame.style = 'left: 40px; top:-40px;'

    popUpFrame.innerHTML = ` 
     <div id="innerFrame"> <div id="closeButtonArea"><button id="closeButton">Back to Game</button> </div><iframe id="innerFrameContent" src="./ranking.html"></iframe> </div>`

    let closeButton = document.querySelector('#closeButton');
    closeButton.addEventListener("click", () => {
        popUpFrame.innerHTML = ''
    })

})

// button for popUP of fdRanking page
let fdRankingButton = document.querySelector('#fdRankingButton');
fdRankingButton.addEventListener("click", () => {

    let popUpFrame = document.querySelector('#popUpFrame')
    popUpFrame.style = 'left: 40px; top:-40px;'

    popUpFrame.innerHTML = ` 
     <div id="innerFrame"> <div id="closeButtonArea"><button id="closeButton">Back to Game</button> </div><iframe id="innerFrameContent" src="./fdRanking.html"></iframe> </div>`

    let closeButton = document.querySelector('#closeButton');
    closeButton.addEventListener("click", () => {
        popUpFrame.innerHTML = ''
    })

})






// button for save to server
let saveToServerButton = document.querySelector('#saveToServer');
saveToServerButton.addEventListener("click", () => {
    saveToServer('Player101')

    //temporary testing


    // console.log(Object.keys(gameItemList))
    // console.log(scoreCheckingGroups)
    // console.log(gameItemList)


})
