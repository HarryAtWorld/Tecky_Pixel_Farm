const mapTileSize = 16
let mapTileList =[]

let mapIsLoaded = false;
let treesIsLoaded = false;


const gameMap = document.querySelector('.gameArea')
gameMap.height = 320; //mapTileSize*20 should match with css
gameMap.width = 720;  //mapTileSize*35 should match with css



const ctx = gameMap.getContext('2d')

const map = new Image();
const trees = new Image();



class cutTile{
    constructor(status,cutLocationX, cutLocationY) {
        this.status = status;
        this.cutLocationX = cutLocationX;
        this.cutLocationY = cutLocationY;        
      }
}

const sea = new cutTile('sea',12 ,1)
const ground = new cutTile('ground',1 ,1)

const outerCornerLT  = new cutTile('outerCornerLT',0 ,0)
const outerCornerLB  = new cutTile('outerCornerLB',0 ,2)
const outerCornerRT  = new cutTile('outerCornerRT',2 ,0)
const outerCornerRB  = new cutTile('outerCornerRB',2 ,2)

const innerCornerLT  = new cutTile('outerCornerLT',4 ,2)
const innerCornerLB  = new cutTile('outerCornerLB',4 ,1)
const innerCornerRT  = new cutTile('outerCornerRT',3 ,2)
const innerCornerRB  = new cutTile('outerCornerRB',3 ,1)

const topEdge  = new cutTile('topEdge',1 ,0)
const bottomEdge  = new cutTile('bottomEdge',1 ,2)
const leftEdge  = new cutTile('leftEdge',0 ,1)
const rightEdge  = new cutTile('rightEdge',2 ,1)


// BUG: images onload order not correct sometime.<======need to solve
map.onload = drawMap; // Draw when image has loaded
map.src = './gameImages/map/island.png';
trees.onload = drawTrees; // Draw when image has loaded
trees.src = './gameImages/trees/tree.png';


function mapInit(){
    for (let x = 0; i < mapTileList.length-2; x++){
        for (let y = 0; i < mapTileList[x+1].length-2; y++){
            if (mapTileList[x+1][y+1].status === 'ground'){
                if(mapTileList[x][y].status !== 'ground'){      //check left top
                    mapTileList[x][y].status = outerCornerLT
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
function drawMapTile(tileType,displayX,displayY){
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(map,tileType.cutLocationX*mapTileSize, tileType.cutLocationY*mapTileSize, mapTileSize, mapTileSize, displayX*mapTileSize, displayY*mapTileSize, mapTileSize, mapTileSize);
}


function drawMap() {  
    
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 

    for (let i = 0; i < 13; i++) {
        
        ctx.drawImage(map, mapTileSize*i, 0, mapTileSize, mapTileSize, mapTileSize*i, 0, mapTileSize, mapTileSize);
        ctx.drawImage(map, mapTileSize*i, 16, mapTileSize, mapTileSize, mapTileSize*i, 16, mapTileSize, mapTileSize);
        ctx.drawImage(map, mapTileSize*i, 32, mapTileSize, mapTileSize, mapTileSize*i, 32, mapTileSize, mapTileSize);

        ctx.drawImage(map, mapTileSize*i, 0, mapTileSize, mapTileSize, mapTileSize*i, 48, mapTileSize, mapTileSize);
        ctx.drawImage(map, mapTileSize*i, 16, mapTileSize, mapTileSize, mapTileSize*i, 64, mapTileSize, mapTileSize);
        ctx.drawImage(map, mapTileSize*i, 16, mapTileSize, mapTileSize, mapTileSize*i, 80, mapTileSize, mapTileSize);
        ctx.drawImage(map, mapTileSize*i, 32, mapTileSize, mapTileSize, mapTileSize*i, 96, mapTileSize, mapTileSize);
        
        ctx.setLineDash([2, 1])
        ctx.strokeRect(mapTileSize*i, 0, mapTileSize, mapTileSize)
        ctx.strokeRect(mapTileSize*i, 16, mapTileSize, mapTileSize)
        ctx.strokeRect(mapTileSize*i, 32, mapTileSize, mapTileSize)
    }

    ctx.drawImage(map,leftEdge.cutLocationX*mapTileSize, leftEdge.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 284, 168, mapTileSize, mapTileSize);
    ctx.drawImage(map,leftEdge.cutLocationX*mapTileSize, leftEdge.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 284, 184, mapTileSize, mapTileSize);
    ctx.drawImage(map, outerCornerLB.cutLocationX*mapTileSize, outerCornerLB.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 284, 200, mapTileSize, mapTileSize);
    ctx.drawImage(map, innerCornerLB.cutLocationX*mapTileSize, innerCornerLB.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 300, 200, mapTileSize, mapTileSize);
    ctx.drawImage(map, outerCornerLB.cutLocationX*mapTileSize, outerCornerLB.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 300, 216, mapTileSize, mapTileSize);
    ctx.drawImage(map,bottomEdge.cutLocationX*mapTileSize, bottomEdge.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 316, 216, mapTileSize, mapTileSize);
    ctx.drawImage(map,bottomEdge.cutLocationX*mapTileSize, bottomEdge.cutLocationY*mapTileSize, mapTileSize, mapTileSize, 332, 216, mapTileSize, mapTileSize);


}


function drawTrees() {    
    
    ctx.drawImage(trees, 0, 160, 32, 32, 8, 64, 32, 32);
    ctx.drawImage(trees, 0, 224, 32, 32, 8, 64, 32, 32);

}