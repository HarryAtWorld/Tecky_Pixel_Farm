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
//set what plant to add
let playerName = 'plyer';

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
    isStopAddCarrot: true,
    isStopAddCorn: true,
    isStopAddPumpkin: true,
    isStopAddLettuce: true,
    isStopAddYellowFlower: true,
    isStopAddRedFlower: true,
    isStopAddBlueFlower: true,
    isStopAddTree: true,

    isStopRemovePlant: true
}

let isEditModeOn = false

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
const gameDisplayLayer15 = document.querySelector('#gameDisplayLayer15') //for edit mode display temporary edited map
const gameDisplayLayer16 = document.querySelector('#gameDisplayLayer16') //for edit mode display temporary edited plant
const gameDisplayLayer20 = document.querySelector('#gameDisplayLayer20') //for mouse move highlight at edit mode
const gameDisplayLayer30 = document.querySelector('#gameDisplayLayer30') //for grid display at edit mode
const gameDisplayLayer40 = document.querySelector('#gameDisplayLayer40') //for text showing animation 

gameDisplayLayer0.height = gameImagesAreaHeight;
gameDisplayLayer0.width = gameImagesAreaWidth;

gameDisplayLayer10.height = gameImagesAreaHeight;
gameDisplayLayer10.width = gameImagesAreaWidth;

gameDisplayLayer15.height = gameImagesAreaHeight;
gameDisplayLayer15.width = gameImagesAreaWidth;

gameDisplayLayer16.height = gameImagesAreaHeight;
gameDisplayLayer16.width = gameImagesAreaWidth;

gameDisplayLayer20.height = gameImagesAreaHeight;
gameDisplayLayer20.width = gameImagesAreaWidth;

gameDisplayLayer30.height = gameImagesAreaHeight;
gameDisplayLayer30.width = gameImagesAreaWidth;

gameDisplayLayer40.height = gameImagesAreaHeight;
gameDisplayLayer40.width = gameImagesAreaWidth;

const ctxLayer0 = gameDisplayLayer0.getContext('2d')
const ctxLayer10 = gameDisplayLayer10.getContext('2d')
const ctxLayer15 = gameDisplayLayer15.getContext('2d')
const ctxLayer16 = gameDisplayLayer16.getContext('2d')
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
    const requestRecord = await fetch(`/friendFarm`);
    const result = await requestRecord.json();

    // fill in data to this js
    mapTileList = result.map
    gameItemList = result.game_item_record
    gameScore = result.lastScoreRecord.score
    playerName = result.playerName.user_name
    console.log(result)

    for (let factor in result.scoreFactorList) {
        scoreFactorList[factor] = result.scoreFactorList[`${factor}`]
    }
    displayScore.innerHTML = `&emsp;${playerName} &emsp;&emsp; Score:${gameScore}`


    drawWorld();    
  
}

function drawWorld() {
    drawGround()
    drawGroundEdge()
    drawPlants()  

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
const tree = new cutPlantTile('green_trees', 0, 5, 0, 6, 0, 7, 0, 10, 32)

class plantingBox {
    constructor(plantType, timeNow, stage, locationX, locationY) {
        this.plantType = plantType;
        this.stageChangeAt = timeNow
        this.stage = stage;
        this.x = locationX
        this.y = locationY
    }
}


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

function drawTreeBox(plant, stageNumber, displayGridX, displayGridY) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxLayer10.drawImage(plantTiles, plant[`stage${stageNumber}cutX`] * plant.size, plant[`stage${stageNumber}cutY`] * plant.size, plant.size, plant.size, displayGridX * 16, displayGridY * 16, plant.size, plant.size);
}

// draw the ground tile according the mapTileList
function drawGround() {
    clearLayer(ctxLayer0)
    for (let x = 0; x < gameXGridNumber; x++) {
        for (let y = 0; y < mapTileList[x].length; y++) {
            if (mapTileList[x][y].tileType == 'ground') {
                drawMapTile(ground, x, y)
                landCount += 1
            }
        }
    }
}

function drawPlants() {
    clearLayer(ctxLayer10)
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
        if (gameItemList[key].plantType.name == 'green_trees') {
            drawTreeBox(gameItemList[key].plantType, gameItemList[key].stage, (gameItemList[key].x) - 0.5, (gameItemList[key].y) - 1)
        } else {
            drawPlantingBox(gameItemList[key].plantType, gameItemList[key].stage, gameItemList[key].x, gameItemList[key].y)
        }

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

