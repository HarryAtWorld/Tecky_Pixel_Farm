

// map grid to be 32X32 as 1 unit
const gameImagesAreaHeight = 640 //32*20 should match with css
const gameImagesAreaWidth = 1440 //32*45 should match with css


let mapTileList = []
let gameItemList = []
let gameScore = 1000

let mapIsLoaded = false;
let treesIsLoaded = false;

let displayScore = document.querySelector('#gameScore')

// 3 layer canvas
const gameDisplayLayer0 = document.querySelector('#gameDisplayLayer0')
const gameDisplayLayer1 = document.querySelector('#gameDisplayLayer1')
const gameDisplayLayer2 = document.querySelector('#gameDisplayLayer2')
const gameDisplayLayer3 = document.querySelector('#gameDisplayLayer3')

gameDisplayLayer0.height = gameImagesAreaHeight;
gameDisplayLayer0.width = gameImagesAreaWidth;

gameDisplayLayer1.height = gameImagesAreaHeight;
gameDisplayLayer1.width = gameImagesAreaWidth;

gameDisplayLayer2.height = gameImagesAreaHeight;
gameDisplayLayer2.width = gameImagesAreaWidth;

gameDisplayLayer3.height = gameImagesAreaHeight;
gameDisplayLayer3.width = gameImagesAreaWidth;

const ctxLayer0 = gameDisplayLayer0.getContext('2d')
const ctxLayer1 = gameDisplayLayer1.getContext('2d')
const ctxLayer2 = gameDisplayLayer2.getContext('2d')
const ctxLayer3 = gameDisplayLayer3.getContext('2d')

const mapTiles = new Image();
const trees = new Image();
const plantTiles = new Image();
const house = new Image();

// using callback to make sure all image were loaded before draw things
mapTiles.onload = () => {
    trees.onload = () => {
        plantTiles.onload = () => {
            house.onload = drawMap;
            house.src = './gameImages/house/houseImage.png'
        }
        plantTiles.src = './gameImages/plants/plantsImage.png';
    }
    trees.src = './gameImages/trees/tree.png';
}
mapTiles.src = './gameImages/map/island.png';


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
    constructor(s1X, s1Y, s2X, s2Y, s3X, s3Y, s4X, s4Y, size) {

        this.stage1cutX = s1X;
        this.stage1cutY = s1Y;
        this.stage2cutX = s2X;
        this.stage2cutY = s2Y;
        this.stage3cutX = s3X;
        this.stage3cutY = s3Y;
        this.stage4cutX = s4X;
        this.stage4cutY = s4Y;
        this.size = size
    }
}

const carrot = new cutPlantTile(1, 0, 3, 0, 5, 0, 0, 33, 16)
const corn = new cutPlantTile(1, 4, 3, 4, 5, 4, 0, 33, 16)
const yellow_flower = new cutPlantTile(1, 33, 3, 33, 4, 33, 0, 33, 16)
const red_flower = new cutPlantTile(1, 18, 3, 18, 4, 18, 0, 33, 16)
const blue_flower = new cutPlantTile(1, 16, 3, 16, 4, 16, 0, 33, 16)
const pumpkin = new cutPlantTile(1, 3, 3, 3, 5, 3, 0, 33, 16)
const lettuce = new cutPlantTile(1, 8, 3, 8, 5, 8, 0, 33, 16)


class cutTreeFrames {
    constructor(s1X, s1Y, s2X, s2Y, s3X, s3Y, s4X, s4Y, size) {
        this.frame1cutX = s1X;
        this.frame1cutY = s1Y;
        this.frame2cutX = s2X;
        this.frame2cutY = s2Y;
        this.frame3cutX = s3X;
        this.frame3cutY = s3Y;
        this.frame4cutX = s4X;
        this.frame4cutY = s4Y;
        this.size = size
    }
}

const green_trees = new cutTreeFrames(0, 3, 1, 3, 2, 3, 3, 3, 32)
const brown_trees = new cutTreeFrames(0, 5, 1, 5, 2, 5, 3, 5, 32)


class cutHouseTile {
    constructor(X, Y, size) {
        this.cutLocationX = X;
        this.cutLocationY = Y;
        this.size = size
    }
}

const small_house = new cutHouseTile(0, 0, 94)
const big_house = new cutHouseTile(1, 0, 94)





function mapInit() {
    for (let x = 0; x < mapTileList.length - 2; x++) {
        for (let y = 0; y < mapTileList[x + 1].length - 2; y++) {
            if (mapTileList[x][y + 1].tileType === 'ground') {         //check left 
                if (mapTileList[x][y].status === 'ground') {        //check left top
                    drawMapTile(leftEdge, x + 0.5, y)
                } else {
                    drawMapTile(innerCornerLB, x + 0.5 + 1, y + 1)
                }

            }

        }
    }

}




// ==============for test only, making a random map=========================================================================================
for (let x = 0; x < 45; x++) {
    mapTileList.push([])
}
for (let x = 0; x < 45; x++) {
    for (let y = 0; y < 20; y++) {

        if (x == 0 || y == 0 || x == 44 || y == 19) {       //to make the map edge to be sea

            mapTileList[x][y] = sea

            continue
        }

        let randomTileType = Math.round(Math.random() * 6) //control the quantity of ground
        if (randomTileType == 1) {
            mapTileList[x][y] = ground
        } else {
            mapTileList[x][y] = sea
        }

    }
}

//==========================================================================================================================


// map.onload = ()=>{ mapIsLoaded = true}; // Draw when image has loaded
// map.src = './gameImages/map/island.png';
// trees.onload = ()=>{ treesIsLoaded = true}; // Draw when image has loaded
// trees.src = './gameImages/trees/tree.png';


// updateUI()


// function updateUI(){
//     if(mapIsLoaded && treesIsLoaded){
//         drawMap();
//         drawTrees();
//     }
// }

// Input displayX,displayY number to grid number. Not actual X,Y.
function drawMapTile(tileType, displayGridX, displayGridY) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxLayer0.drawImage(mapTiles, tileType.cutLocationX * tileType.size, tileType.cutLocationY * tileType.size, tileType.size, tileType.size, displayGridX * 32, displayGridY * 32, tileType.size, tileType.size);
}

function drawPlant(plant, stageNumber, displayGridX, displayGridY) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxLayer1.drawImage(plantTiles, plant[`stage${stageNumber}cutX`] * plant.size, plant[`stage${stageNumber}cutY`] * plant.size, plant.size, plant.size, displayGridX * 32, displayGridY * 32, plant.size, plant.size);
}

function drawTree(treeType, frameNumber, displayGridX, displayGridY) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxLayer1.drawImage(trees, treeType[`frame${frameNumber}cutX`] * treeType.size, treeType[`frame${frameNumber}cutY`] * treeType.size, treeType.size, treeType.size, (displayGridX * treeType.size) - (treeType.size * 0.25), (displayGridY * treeType.size) - (treeType.size / 2), treeType.size, treeType.size);
}


function showGrid() {
    for (let x = 0; x < mapTileList.length; x++) {
        for (let y = 0; y < mapTileList[x].length; y++) {
            ctxLayer3.globalAlpha = 0.3
            ctxLayer3.strokeStyle = 'rgb(200,200,200)';
            ctxLayer3.strokeRect(x * 32, y * 32, 32, 32) //show 32x32 grid

        }
    }
}


// draw the ground tile
function drawGroundTile() {
    for (let x = 0; x < mapTileList.length; x++) {
        for (let y = 0; y < mapTileList[x].length; y++) {
            if (mapTileList[x][y].tileType == 'ground') {
                drawMapTile(ground, x, y)

                //temporary tree
                drawTree(green_trees, 1, x, y)
                drawTree(green_trees, 1, x, y + 0.5)
                drawTree(green_trees, 1, x + 0.5, y)
                drawTree(green_trees, 1, x + 0.5, y + 0.5)
            }
        }
    }
}


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


function drawMap() {
    drawGroundTile()
    drawGroundEdge()
}

function clearLayer(ctxLayer) {
    ctxLayer.clearRect(0, 0, gameImagesAreaWidth, gameImagesAreaHeight)
    ctxLayer.beginPath();
}

// for stop edit map 
let isStopEditMap = true

function startEditMap() {

    //for map edit use ,highlight the available area
    document.addEventListener('mousemove', highLightMouseForMap);
    //click to add ground tile
    document.addEventListener('click', addGroundTile);


}

function highLightMouseForMap(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to mapTileList
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer0.clientLeft) / 32);
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer0.clientTop) / 32);

    //clear previous highlight 
    ctxLayer2.clearRect(0, 0, gameDisplayLayer0.width, gameDisplayLayer0.height)
    ctxLayer2.beginPath();
    ctxLayer2.rect(mouseXGrid * 32, mouseYGrid * 32, 32, 32);


    //control the highlight color
    if (mouseXGrid <= 0 || mouseYGrid <= 0 || mouseXGrid + 1 >= mapTileList.length || mouseYGrid + 1 >= mapTileList[mouseXGrid].length) {
        ctxLayer2.globalAlpha = 0.4
        ctxLayer2.fillStyle = '#FF0000';
        ctxLayer2.fill();
    } else {

        if (mapTileList[mouseXGrid][mouseYGrid].tileType !== 'ground' && isNextToGround(mouseXGrid, mouseYGrid)) {
            ctxLayer2.globalAlpha = 0.4
            ctxLayer2.fillStyle = '#00FF00';
            ctxLayer2.fill();
        } else {
            ctxLayer2.globalAlpha = 0.4
            ctxLayer2.fillStyle = '#FF0000';
            ctxLayer2.fill();
        }
    }

    // stop listener condition
    if (isStopEditMap) {

        document.removeEventListener('mousemove',
            highLightMouseForMap
        );

        document.removeEventListener('click',
            addGroundTile
        );
    }
}

function addGroundTile(event) {
    let bound = gameDisplayLayer0.getBoundingClientRect();

    //covert to canvas XY gid, canvas left top to be 0,0. can direct use as index to mapTileList
    mouseXGrid = Math.floor(Math.round(event.clientX - bound.left - gameDisplayLayer0.clientLeft) / 32);
    mouseYGrid = Math.floor(Math.round(event.clientY - bound.top - gameDisplayLayer0.clientTop) / 32);

    //check if mouse in un available area
    if (mouseXGrid <= 0 || mouseYGrid <= 0 || mouseXGrid + 1 >= mapTileList.length || mouseYGrid + 1 >= mapTileList[mouseXGrid].length) {
        return
    }



    if (mapTileList[mouseXGrid][mouseYGrid].tileType !== 'ground' && isNextToGround(mouseXGrid, mouseYGrid)) {

        mapTileList[mouseXGrid][mouseYGrid] = ground
        clearLayer(ctxLayer0)
        drawGroundTile()
        drawGroundEdge()

        gameScore -= 50

        displayScore.innerHTML = `<h1>Score:${gameScore}</h1>`

    }
}

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



// button for edit map mode
let mapEditButton = document.querySelector('#editMap');
mapEditButton.addEventListener("click", () => {
    isStopEditMap = !isStopEditMap;

    if (isStopEditMap) {
        clearLayer(ctxLayer3)
    } else {
        showGrid()
        startEditMap();
    }

})