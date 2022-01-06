document.addEventListener('DOMContentLoaded',() => {
     const grid = document.querySelector('.grid');
     const score = document.querySelector('#score');
     const start = document.querySelector('#start-button');
     let div = Array.from(document.querySelectorAll('.grid div'));
     const width = 10;
     const colors = ['orange','red','purple','green','blue'];
     let nextRandomNumber = 0;
     let timerID;
     let scoreIndex = 0;
     let currentPosition = 4;
     let currentRotation = 0;
     const ltetromino = [
          [1,width + 1,width * 2 + 1,2],
          [width,width + 1,width + 2, width*2+2],
          [1,width + 1,width * 2 + 1, width*2],
          [width,width * 2,width * 2 + 1,width * 2 + 2],
     ];
     const ztetromino = [
          [0,width,width + 1,width * 2 + 1],
          [width + 1,width + 2,width * 2,width * 2 + 1],
          [0,width,width + 1,width * 2 + 1],
          [width + 1,width + 2,width * 2,width * 2 + 1],
     ];
     const tTetromino = [
          [1,width,width +1,width + 2],
          [1,width + 1,width + 2,width * 2 + 1],
          [width,width + 1,width + 2,width * 2 + 1],
          [1,width,width + 1,width * 2 + 1],
     ];
     const oTetromino = [
          [0,1,width,width + 1],
          [0,1,width,width + 1],
          [0,1,width,width + 1],
          [0,1,width,width + 1],
     ];
     const iTetromino = [
          [1,width + 1,width * 2 + 1,width * 3 + 1],
          [width,width + 1,width + 2,width + 3],
          [1,width + 1,width * 2 + 1,width * 3 + 1],
          [width,width + 1,width + 2,width + 3],
     ];
     const theTetrominoes = [ltetromino,ztetromino,tTetromino,oTetromino,iTetromino];
     let randomNumber = Math.floor(Math.random() * theTetrominoes.length);
     let current = theTetrominoes[randomNumber][currentRotation];
     function draw(){
          current.forEach(index => {
               div[currentPosition + index].classList.add('tetromino');
               div[currentPosition + index].style.backgroundColor = colors[randomNumber];
          });
     }
     function undraw(){
          current.forEach(index => {
               div[currentPosition + index].classList.remove('tetromino');
               div[currentPosition + index].style.backgroundColor = "";
          });
     }
     function isAtRight(){
          return current.some(index => (currentPosition + index + 1) % width === 0);
     }
     function isAtLeft(){
          return current.some(index => (currentPosition + index) % width === 0);
     };
     function gameOver(){
          if(current.some(index => div[currentPosition + index].classList.contains('taken'))){
               score.innerHTML = 'end';
               clearInterval(timerID);
          }
     }
     function checkRotatedPosition(P){
          P = P || currentPosition;
          if((P + 1) % width < 4){
               if(isAtRight()){
                    currentPosition += 1;
                    checkRotatedPosition(P);
               }
          }else if(P % width > 5){
               if(isAtLeft()){
                    currentPosition -= 1;
                    checkRotatedPosition(P);
               }
          }
     }
     function rotate(){
          undraw();
          currentRotation++;
          if(currentRotation === current.length){
               currentRotation = 0;
          }
          current = theTetrominoes[randomNumber][currentRotation];
          checkRotatedPosition();
          draw();
     }
     function moveLeft(){
          undraw();
          const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
          if(!isAtLeftEdge) currentPosition -= 1;
          if(current.some(index => div[currentPosition + index].classList.contains('taken'))){
               currentPosition += 1;
          }
          draw();
     }
     function moveRight(){
          undraw();
          const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);
          if(!isAtRightEdge) currentPosition += 1;
          if(current.some(index => div[currentPosition + index].classList.contains('taken'))){
               currentPosition -= 1;
          }
          draw();
     }
     function moveDown(){
          undraw();
          currentPosition += width;
          draw();
          freeze();
     }
     function control(event){
          if(event.keyCode === 37){
               moveLeft();
          }else if(event.keyCode === 38){
               rotate();
          }else if(event.keyCode === 39){
               moveRight();
          }else if(event.keyCode === 40){
               moveDown();
          }
     }
     document.addEventListener('keyup',control);
     const displaySquares = document.querySelectorAll('.mini-grid div');
     const displayWidth = 4;
     const displayIndex = 0;
     const upNextTetrominoes = [
          [1,displayWidth + 1,displayWidth * 2 + 1,2],
          [0,displayWidth,displayWidth + 1,displayWidth * 2 + 1],
          [1,displayWidth,displayWidth + 1,displayWidth + 2],
          [0,1,displayWidth,displayWidth + 1],
          [1,displayWidth + 1,displayWidth * 2 + 1,displayWidth * 3 + 1],
     ];
     function displayShape(){
          displaySquares.forEach(square => {
               square.classList.remove('tetromino');
               square.style.backgroundColor = "";
          });
          upNextTetrominoes[nextRandomNumber].forEach(index => {
               displaySquares[displayIndex + index].classList.add('tetromino');
               displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandomNumber];
          });
     }
     start.addEventListener('click',() => {
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
     function addScore(){
          for(let i = 0;i < 199;i += width){
               const row = [i,i + 1,i + 2,i + 3,i + 4,i + 5,i + 6,i + 7,i + 8,i + 9];
               if(row.every(index => div[index].classList.contains('taken'))){
                    scoreIndex += 10;
                    score.innerHTML = scoreIndex;
                    row.forEach(index => {
                         div[index].classList.remove('taken');
                         div[index].classList.remove('tetromino');
                         div[index].style.backgroundColor = "";
                    });
                    const squaresRemoved = div.splice(index,width);
                    div = squaresRemoved.concat(div);
                    div.forEach(cell => grid.appendChild(cell));
               }
          }
     }
     function freeze(){
          if(current.some(index => div[currentPosition + index + width].classList.contains('taken'))){
               current.forEach(index => div[currentPosition + index].classList.add('taken'));
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
});