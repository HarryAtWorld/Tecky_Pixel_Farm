// map grid to be 32X32 as 1 unit
const gameImagesAreaHeight = 640 //32*20 should match with css
const gameImagesAreaWidth = 1440 //32*45 should match with css


let mapTileList = []
let gameItemList = []

let mapIsLoaded = false;
let treesIsLoaded = false;






// 3 layer canvas
const gameMap = document.querySelector('#gameMapLayer')
const gamePlant = document.querySelector('#gamePlantLayer')
const gameUI = document.querySelector('#gameUILayer')

gameMap.height = gameImagesAreaHeight;
gameMap.width = gameImagesAreaWidth;

gamePlant.height = gameImagesAreaHeight;
gamePlant.width = gameImagesAreaWidth;

gameUI.height = gameImagesAreaHeight;
gameUI.width = gameImagesAreaWidth;

const ctxMap = gameMap.getContext('2d')
const ctxPlant = gamePlant.getContext('2d')
const ctxUI = gameUI.getContext('2d')

const mapTiles = new Image();
const trees = new Image();
const plantTiles = new Image();
const house = new Image();

// BUG: images onload order not correct sometime.<======solved by multi layer
// mapTiles.onload = drawMap; // Draw when image has loaded
mapTiles.src = './gameImages/map/island.png';


// trees.onload = drawTrees; // Draw when image has loaded
trees.src = './gameImages/trees/tree.png';
plantTiles.onload = drawMap; // Draw when image has loaded
plantTiles.src = './gameImages/plants/plantsImage.png';
// house.onload = ; // Draw when image has loaded
house.src = './gameImages/house/houseImage.png';



class cutMapTile {
    constructor(tileType, cutLocationX, cutLocationY, size) {
        this.tileType = tileType;
        this.cutLocationX = cutLocationX;
        this.cutLocationY = cutLocationY;
        this.size = size
    }
}

const sea = new cutMapTile('sea', 12, 1, 16)
const ground = new cutMapTile('ground', 4.5, 0, 32)

const outerCornerLT = new cutMapTile('outerCornerLT', 0, 0, 16)
const outerCornerLB = new cutMapTile('outerCornerLB', 0, 2, 16)
const outerCornerRT = new cutMapTile('outerCornerRT', 2, 0, 16)
const outerCornerRB = new cutMapTile('outerCornerRB', 2, 2, 16)

const innerCornerLT = new cutMapTile('outerCornerLT', 4, 2, 16)
const innerCornerLB = new cutMapTile('outerCornerLB', 4, 1, 16)
const innerCornerRT = new cutMapTile('outerCornerRT', 3, 2, 16)
const innerCornerRB = new cutMapTile('outerCornerRB', 3, 1, 16)

const topEdge = new cutMapTile('topEdge', 1, 0, 16)
const bottomEdge = new cutMapTile('bottomEdge', 1, 2, 16)
const leftEdge = new cutMapTile('leftEdge', 0, 1, 16)
const rightEdge = new cutMapTile('rightEdge', 2, 1, 16)


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

        let randomTileType = Math.round(Math.random() * 4) //control the quantity of ground
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
    ctxMap.drawImage(mapTiles, tileType.cutLocationX * tileType.size, tileType.cutLocationY * tileType.size, tileType.size, tileType.size, displayGridX * 32, displayGridY * 32, tileType.size, tileType.size);
}

function drawPlant(plant, stageNumber, displayGridX, displayGridY) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxPlant.drawImage(plantTiles, plant[`stage${stageNumber}cutX`] * plant.size, plant[`stage${stageNumber}cutY`] * plant.size, plant.size, plant.size, displayGridX * 32, displayGridY * 32, plant.size, plant.size);
}

function drawTree(treeType, frameNumber, displayGridX, displayGridY) {
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxPlant.drawImage(trees, treeType[`frame${frameNumber}cutX`] * treeType.size, treeType[`frame${frameNumber}cutY`] * treeType.size, treeType.size, treeType.size, (displayGridX * treeType.size)-(treeType.size*0.25), (displayGridY * treeType.size)-(treeType.size/2), treeType.size, treeType.size);
}



function drawMap() {


    // draw the ground tile
    for (let x = 0; x < mapTileList.length; x++) {
        for (let y = 0; y < mapTileList[x].length; y++) {
            if (mapTileList[x][y].tileType == 'ground') {
                drawMapTile(ground, x, y)

                drawTree(green_trees,1,x,y)
                drawTree(green_trees,1,x,y+0.5)
                drawTree(green_trees,1,x+0.5,y)
                drawTree(green_trees,1,x+0.5,y+0.5)
            }
            ctxUI.globalAlpha = 0.3
            ctxUI.strokeStyle = 'rgb(200,200,200)';
            ctxUI.strokeRect(x * 32, y * 32, 32, 32) //show 32x32 grid
            
        }
    }


    // draw the ground edge
    for (let x = 0; x < mapTileList.length; x++) {
        for (let y = 0; y < mapTileList[x].length; y++) {

            if (x - 1 < 0 || y - 1 < 0 || x + 1 >= mapTileList.length || y + 1 >= mapTileList[x].length) {       //to prevent -1 index error
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

