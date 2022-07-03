const tileSize = 16

const gameMap = document.querySelector('.gameArea')
gameMap.height = 320; //16*20 should match with css
gameMap.width = 608;  //16*38 should match with css



const ctx = gameMap.getContext('2d')

const image1 = new Image();
const image2 = new Image();


image2.onload = drawMap; // Draw when image has loaded
image1.src = './gameImages/map/island.png';
image2.src = './gameImages/plants/tree.png';


function drawMap() {
  
    
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    


    for (let i = 0; i < 13; i++) {
        
        ctx.drawImage(image1, 16*i, 0, 16, 16, 16*i, 0, 16, 16);
        ctx.drawImage(image1, 16*i, 16, 16, 16, 16*i, 16, 16, 16);
        ctx.drawImage(image1, 16*i, 16, 16, 16, 16*i, 32, 16, 16);
        ctx.drawImage(image1, 16*i, 32, 16, 16, 16*i, 48, 16, 16);

        ctx.setLineDash([4, 1])
        ctx.strokeRect(16*i, 0, 16, 16)
        
    }    

    ctx.drawImage(image2, 0, 128, 32, 32, 8, 16, 32, 32);

}

