document.addEventListener('DOMContentLoaded',() => {
     const width = 10;
     const grid_width = 10;
     const grid_height = 20;
     const grid_size = grid_width * grid_height;
     const grid = createGrid();
     const close = document.getElementsByClassName('close')[0];
     const button = document.querySelector('.button');
     const toggler = document.querySelector('.toggler');
     const menu = document.querySelector('.menu');
     const scoreDisplay = document.querySelector('.score-display');
     const linesScore = document.querySelector('.lines-score');
     const colors = ['url(./images/blue_block.png)','url(./images/pink_block.png)','url(./images/purple_block.png)','url(./images/peach_block.png)','url(./images/yellow_block.png)'];
     let div = Array.from(grid.querySelectorAll('div'));
     let currentIndex = 0;
     let currentRotation = 0;
     let score = 0;
     let lines = 0;
     let nextRandomNumber = 0;
     let timerID;
     function createGrid(){
          let grid= document.querySelector('.grid');
          for(let i = 0;i < grid_size;i++){
               let gridElement = document.createElement('div');
               grid.appendChild(gridElement);
          }
          for(let i = 0;i < grid_width;i++){
               let gridElement = document.createElement('div');
               gridElement.setAttribute('class','block3');
               grid.appendChild(gridElement);
          }
          let previousGrid = document.querySelector('.previous-grid');
          for(let i = 0;i < 16;i++){
               let gridElement = document.createElement('div');
               previousGrid.appendChild(gridElement);
          }
          return grid;
     }
     document.addEventListener('keydown',control);
     const lTetromino = [
          [1,grid_width + 1,grid_width * 2 + 1,2],
          [grid_width,grid_width + 1,grid_width + 2,grid_width * 2 + 2],
          [1,grid_width + 1,grid_width * 2 + 1,grid_width * 2],
          [grid_width,grid_width * 2,grid_width * 2 + 1,grid_width * 2 + 2],
     ];
     const zTetromino = [
          [0,grid_width,grid_width + 1,grid_width * 2 + 1],
          [grid_width + 1,grid_width + 2,grid_width * 2,grid_width * 2 + 1],
          [0,grid_width,grid_width + 1,grid_width * 2 + 1],
          [grid_width + 1,grid_width + 2,grid_width * 2,grid_width * 2 + 1],
     ];
     const tTetromino = [
          [1,grid_width,grid_width + 1,grid_width + 2],
          [1,grid_width + 1,grid_width + 2,grid_width * 2 + 1],
          [grid_width,grid_width + 1,grid_width + 2,grid_width * 2 + 1],
          [1,grid_width,grid_width + 1,grid_width * 2 + 1],
     ];
     const oTetromino = [
          [0,1,grid_width,grid_width + 1],
          [0,1,grid_width,grid_width + 1],
          [0,1,grid_width,grid_width + 1],
          [0,1,grid_width,grid_width + 1],
     ];
     const iTetromino = [
          [1,grid_width + 1,grid_width * 2 + 1,grid_width * 3 + 1],
          [grid_width,grid_width + 1,grid_width + 2,grid_width + 3],
          [1,grid_width + 1,grid_width * 2 + 1,grid_width * 3 + 1],
          [grid_width,grid_width + 1,grid_width + 2,grid_width + 3],
     ];
     const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino];
     let randomNumber = Math.floor(Math.random() * theTetrominoes.length);
     let current = theTetrominoes[randomNumber][currentRotation];
     let currentPosition = 4;
     button.addEventListener('click',() => {
          if(timerID){
               clearInterval(timerID);
               timerID = null;
          }else{
               draw();
               timerID = setInterval(moveDown,1000);
               nextRandomNumber = Math.floor(Math.random() * theTetrominoes.length);
               displayShape();
          }
     });
     function draw(){
          current.forEach(index => {
               div[currentPosition + index].classList.add('block1');
               div[currentPosition + index].style.backgroundImage = colors[randomNumber];
          });
     }
     function undraw(){
          current.forEach(index => {
               div[currentPosition + index].classList.remove('block1');
               div[currentPosition + index].style.backgroundImage = 'none';
          });
     }
     function moveDown(){
          undraw();
          currentPosition = currentPosition += width;
          draw();
          freeze();
     }
     function moveRight(){
          undraw();
          const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
          if(!isAtRightEdge) currentPosition += 1;
          if(current.some(index => div[currentPosition + index].classList.contains('block2'))){
               currentPosition -= 1;
          }
          draw();
     }
     function moveLeft(){
          undraw();
          const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
          if(!isAtLeftEdge) currentPosition -= 1;
          if(current.some(index => div[currentPosition + index].classList.contains('block2'))){
               currentPosition += 1;
          }
          draw();
     }
     function rotate(){
          undraw();
          currentRotation++;
          if(currentRotation === current.length){
               currentRotation = 0;
          }
          current = theTetrominoes[randomNumber][currentRotation];
          draw();
     }
     function control(event){
          if(event.keyCode === 39){
               moveRight();
          }else if(event.keyCode === 38){
               rotate();
          }else if(event.keyCode === 37){
               moveLeft();
          }else if(event.keyCode === 40){
               moveDown();
          }
     }
     function addScore(){
          for(currentIndex = 0;currentIndex < grid_size;currentIndex += grid_width){
               const row = [currentIndex,currentIndex + 1,currentIndex + 2,currentIndex + 3,currentIndex + 4,currentIndex + 5,currentIndex + 6,currentIndex + 7,currentIndex + 8,currentIndex + 9];
               if(row.every(index => div[index].classList.contains('block2'))){
                    score += 10;
                    lines += 1;
                    scoreDisplay.innerHTML = score;
                    linesScore.innerHTML = lines;
                    row.forEach(index => {
                         div[index].style.backgroundImage = 'none';
                         div[index].classList.remove('block2') || div[index].classList.remove('block1');
                    });
                    const divRemoved = div.splice(currentIndex,width);
                    div = divRemoved.concat(div);
                    div.forEach(cell => grid.appendChild(cell));
               }
          }
     }
     function gameOver(){
          if(current.some(index => div[currentPosition + index].classList.contains('block2'))){
               scoreDisplay.innerHTML = 'end';
               clearInterval(timerID);
          }
     }
     function freeze(){
          if(current.some(index => div[currentPosition + index + width].classList.contains('block3') || div[currentPosition + index + width].classList.contains('block2'))){
               current.forEach(index => div[index + currentPosition].classList.add('block2'));
               randomNumber = nextRandomNumber;
               nextRandomNumber = Math.floor(Math.random() * theTetrominoes.length);
               current = theTetrominoes[randomNumber][currentRotation];
               currentPosition = 4;
               draw();
               displayShape();
               addScore();
               gameOver();
          }
     }
     freeze();
     const displayWidth = 4;
     const displayDiv = document.querySelectorAll('.previous-grid div');
     const smallTetrominoes = [
          [1,displayWidth + 1,displayWidth * 2 + 1,2],
          [0,displayWidth,displayWidth + 1,displayWidth * 2 + 1],
          [1,displayWidth,displayWidth + 1,displayWidth + 2],
          [0,1,displayWidth,displayWidth + 1],
          [1,displayWidth + 1,displayWidth * 2 + 1,displayWidth * 3 + 1],
     ];
     let displayIndex = 0;
     function displayShape(){
          displayDiv.forEach(square => {
               square.classList.remove('block1');
               square.style.backgroundImage = 'none';
          });
          smallTetrominoes[nextRandomNumber].forEach(index => {
               displayDiv[displayIndex + index].classList.add('block1');
               displayDiv[displayIndex + index].style.backgroundImage = colors[nextRandomNumber];
          });
     }
     toggler.addEventListener('click',() => {
          menu.style.display = 'flex';
     });
     close.addEventListener('click',() => {
          menu.style.display = 'none';
     });
});