const mapTileSize = 16

let mapIsLoaded = false;
let treesIsLoaded = false;


const gameMap = document.querySelector('.gameArea')
gameMap.height = 320; //mapTileSize*20 should match with css
gameMap.width = 720;  //mapTileSize*35 should match with css



const ctx = gameMap.getContext('2d')

const map = new Image();
const trees = new Image();




class mapTile{
    constructor(status,cutLocationX, cutLocationY,displayLocationX,displayLocationY) {
        this.status = status;
        this.cutLocationX = cutLocationX;
        this.cutLocationY = cutLocationY;
        this.displayLocationX = displayLocationX;
        this.displayLocationY = displayLocationY;
      }
}


// BUG: images onload order not correct sometime.<======need to solve
map.onload = drawMap; // Draw when image has loaded
map.src = './gameImages/map/island.png';
trees.onload = drawTrees; // Draw when image has loaded
trees.src = './gameImages/trees/tree.png';

// map.onload = ()=>{ mapIsLoaded = true}; // Draw when image has loaded
// map.src = './gameImages/map/island.png';
// trees.onload = ()=>{ treesIsLoaded = true}; // Draw when image has loaded
// trees.src = './gameImages/trees/tree.png';


// updateUI()


// function updateUI(){
//     if(mapIsLoaded && treesIsLoaded){
//         drawMap();
//         drawtrees();
//     }
// }





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

    // ctx.drawImage(trees, 0, 128, 32, 32, 8, 64, 32, 32);
}


function drawTrees() {    
    
    ctx.drawImage(trees, 0, 160, 32, 32, 8, 64, 32, 32);
    ctx.drawImage(trees, 0, 224, 32, 32, 8, 64, 32, 32);

}