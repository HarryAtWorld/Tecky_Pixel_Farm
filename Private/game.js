const mapShift = 16
const gameImagesAreaHeight = 640 //mapTileSize*20 should match with css
const gameImagesAreaWidth = 1440 //mapTileSize*35 should match with css

let mapTileList =[]

let mapIsLoaded = false;
let treesIsLoaded = false;

// 3 layer canvas
const gameMap = document.querySelector('.gameMapLayer')
const gamePlant = document.querySelector('.gamePlantLayer')
const gameUI = document.querySelector('.gameUIlayer')

gameMap.height = gameImagesAreaHeight; 
gameMap.width = gameImagesAreaWidth;  

gamePlant.height = gameImagesAreaHeight; 
gamePlant.width = gameImagesAreaWidth;  

gameUI.height = gameImagesAreaHeight; 
gameUI.width = gameImagesAreaWidth;  

const ctxMap = gameMap.getContext('2d')
const ctxPlant = gamePlant.getContext('2d')
const ctxUI = gameUI.getContext('2d')


const map = new Image();
const trees = new Image();

// BUG: images onload order not correct sometime.<======need to solve
map.onload = drawMap; // Draw when image has loaded
map.src = './gameImages/map/island.png';
trees.onload = drawTrees; // Draw when image has loaded
trees.src = './gameImages/trees/tree.png';


class cutTile{
    constructor(status,cutLocationX, cutLocationY,size) {
        this.status = status;
        this.cutLocationX = cutLocationX;
        this.cutLocationY = cutLocationY;
        this.size = size        
      }
}

const sea = new cutTile('sea',12 ,1,16)
const ground = new cutTile('ground',9 ,0,32)

const outerCornerLT  = new cutTile('outerCornerLT',0 ,0,16)
const outerCornerLB  = new cutTile('outerCornerLB',0 ,2,16)
const outerCornerRT  = new cutTile('outerCornerRT',2 ,0,16)
const outerCornerRB  = new cutTile('outerCornerRB',2 ,2,16)

const innerCornerLT  = new cutTile('outerCornerLT',4 ,2,16)
const innerCornerLB  = new cutTile('outerCornerLB',4 ,1,16)
const innerCornerRT  = new cutTile('outerCornerRT',3 ,2,16)
const innerCornerRB  = new cutTile('outerCornerRB',3 ,1,16)

const topEdge  = new cutTile('topEdge',1 ,0,16)
const bottomEdge  = new cutTile('bottomEdge',1 ,2,16)
const leftEdge  = new cutTile('leftEdge',0 ,1,16)
const rightEdge  = new cutTile('rightEdge',2 ,1,16)





function mapInit(){
    for (let x = 0; i < mapTileList.length-2; x++){
        for (let y = 0; i < mapTileList[x+1].length-2; y++){
            if (mapTileList[x+1][y+1].status === 'ground'){
                if(mapTileList[x][y].status !== 'ground'){      //check left top
                    
                }

            }

        }
    }

}


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
function drawMapTile(tileType,displayGridX,displayGridY){
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //grid to be 32px X 32px
    ctxMap.drawImage(map,tileType.cutLocationX*mapTileSize, tileType.cutLocationY*mapTileSize, tileType.size, tileType.size, displayGridX*32, displayGridY*32, tileType.size, tileType.size);
}


function drawMap() {  
    
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 

    for (let i = 0; i < 13; i++) {
        
        ctxMap.drawImage(map, mapTileSize*i, 0, mapTileSize, mapTileSize, mapTileSize*i, 0, mapTileSize, mapTileSize);
        ctxMap.drawImage(map, mapTileSize*i, 16, mapTileSize, mapTileSize, mapTileSize*i, 16, mapTileSize, mapTileSize);
        ctxMap.drawImage(map, mapTileSize*i, 32, mapTileSize, mapTileSize, mapTileSize*i, 32, mapTileSize, mapTileSize);

        ctxMap.drawImage(map, mapTileSize*i, 0, mapTileSize, mapTileSize, mapTileSize*i, 48, mapTileSize, mapTileSize);
        ctxMap.drawImage(map, mapTileSize*i, 16, mapTileSize, mapTileSize, mapTileSize*i, 64, mapTileSize, mapTileSize);
        ctxMap.drawImage(map, mapTileSize*i, 16, mapTileSize, mapTileSize, mapTileSize*i, 80, mapTileSize, mapTileSize);
        ctxMap.drawImage(map, mapTileSize*i, 32, mapTileSize, mapTileSize, mapTileSize*i, 96, mapTileSize, mapTileSize);
        
        ctxMap.setLineDash([2, 1])
        ctxMap.strokeRect(mapTileSize*i, 0, mapTileSize, mapTileSize)
        ctxMap.strokeRect(mapTileSize*i, 16, mapTileSize, mapTileSize)
        ctxMap.strokeRect(mapTileSize*i, 32, mapTileSize, mapTileSize)
    }

    ctxMap.drawImage(map,leftEdge.cutLocationX*mapTileSize, leftEdge.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 284, 168, mapTileSize, mapTileSize);
    ctxMap.drawImage(map,leftEdge.cutLocationX*mapTileSize, leftEdge.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 284, 184, mapTileSize, mapTileSize);
    ctxMap.drawImage(map, outerCornerLB.cutLocationX*mapTileSize, outerCornerLB.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 284, 200, mapTileSize, mapTileSize);
    ctxMap.drawImage(map, innerCornerLB.cutLocationX*mapTileSize, innerCornerLB.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 300, 200, mapTileSize, mapTileSize);
    ctxMap.drawImage(map, outerCornerLB.cutLocationX*mapTileSize, outerCornerLB.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 300, 216, mapTileSize, mapTileSize);
    ctxMap.drawImage(map,bottomEdge.cutLocationX*mapTileSize, bottomEdge.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 316, 216, mapTileSize, mapTileSize);
    ctxMap.drawImage(map,bottomEdge.cutLocationX*mapTileSize, bottomEdge.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 332, 216, mapTileSize, mapTileSize);

    drawMapTile(ground,11, 7)
    drawMapTile(ground,12, 7.5)
    drawMapTile(outerCornerRT,13.5, 7.5)


}


function drawTrees() {    
    
    ctxMap.drawImage(trees, 0, 160, 32, 32, 8, 64, 32, 32);
    ctxMap.drawImage(trees, 0, 224, 32, 32, 8, 64, 32, 32);

}