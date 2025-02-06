// Horizontal
const H_GRID = 16;
// vertical
const V_GRID = 16;
// carreau de 40px
const GRID_SIZE = 40;

const WINDOW_WIDTH = H_GRID * GRID_SIZE;
const WINDOW_HEIGHT = V_GRID * GRID_SIZE;

const bsodPoint = 2;
const stallmanPoint = 4;

var score = 0;

var plateau = document.getElementById("plateau");
plateau.style.width = WINDOW_WIDTH;
plateau.style.height = WINDOW_HEIGHT;

var pion = document.getElementById("pion"),
  stylePion = pion.style,
  x = 0,
  y = 0;

var bombe = document.createElement("div");
bombe.style.width = GRID_SIZE + "px";
bombe.style.height = GRID_SIZE + "px";
bombe.style.position = "absolute";
bombe.style.backgroundImage = "url('assests/bomb.png')";
bombe.style.backgroundRepeat = "no-repeat";
bombe.style.backgroundSize = "contain";
bombe.style.zIndex = "100";
bombe.id = "bombe";
bombe.explode = -1;

// On crée la grille
var blockGrid = [];
for (var i = 0; i < H_GRID; i++) {
  blockGrid.push([]);
  for (var j = 0; j < V_GRID; j++) {
    let block = document.createElement("div");
    block.style.width = "40px";
    block.style.height = "40px";
    block.style.position = "absolute";
    block.style.backgroundSize = "contain";
    block.style.zIndex = "90";

    // Murs de briques
    // if + condition pour ne pas faire poper de wallbrick dans les 4 coins de la grille
    if (
      random100() > 60 &&
      !(
        (i >= 0 && i <= 1 && j >= 0 && j <= 1) ||
        (i >= H_GRID - 2 && i < H_GRID && j >= 0 && j <= 1) ||
        (i >= 0 && i <= 1 && j >= V_GRID - 2 && j < V_GRID) ||
        (i >= H_GRID - 2 && i < H_GRID && j >= V_GRID - 2 && j < V_GRID)
      )
    ) {
      block.style.backgroundImage = 'url("assests/block-wall.png")';
      block.traverser = false;
    }

    // Blue screens of death
    else if (
      random100() > 96 &&
      !(
        (i >= 0 && i <= 1 && j >= 0 && j <= 1) ||
        (i >= H_GRID - 2 && i < H_GRID && j >= 0 && j <= 1) ||
        (i >= 0 && i <= 1 && j >= V_GRID - 2 && j < V_GRID) ||
        (i >= H_GRID - 2 && i < H_GRID && j >= V_GRID - 2 && j < V_GRID)
      )
    ) {
      block.style.backgroundImage = 'url("assests/wood box.png")';
      block.classList.add("bsod");
      block.traverser = false;
    }

    // Stallman
    else if (
      random100() > 96 &&
      !(
        (i >= 0 && i <= 1 && j >= 0 && j <= 1) ||
        (i >= H_GRID - 2 && i < H_GRID && j >= 0 && j <= 1) ||
        (i >= 0 && i <= 1 && j >= V_GRID - 2 && j < V_GRID) ||
        (i >= H_GRID - 2 && i < H_GRID && j >= V_GRID - 2 && j < V_GRID)
      )
    ) {
      block.style.backgroundImage = 'url("assests/stone.jpg")';
      block.classList.add("stallman");
      block.traverser = false;
    }

    // Herbe = sol par défaut
    else {
      block.style.backgroundImage = 'url("assests/grass2.png")';
      block.traverser = true;
    }

    block.style.marginLeft = (i * GRID_SIZE).toString() + "px";
    block.style.marginTop = (j * GRID_SIZE).toString() + "px";

    document.getElementById("plateau").appendChild(block);
    blockGrid[i].push(block);
  }
}

// tableau des vilains
var vilainList = [];

// on crée 8 vilains (8 x div vilain)
for (var i = 0; i < 8; i++) {
  let vilain = document.createElement("div");
  vilain.id = String(i);
  let x = 0;
  let y = 0;
  while (!blockGrid[x][y].traverser || (x === 0 && y === 0)) {
    x = Math.floor(Math.random() * H_GRID);
    y = Math.floor(Math.random() * V_GRID);
  }
  blockGrid[x][y].traverser = true;
  vilain.vilainX = x;
  vilain.vilainY = y;
  vilain.direction = "right";
  vilain.id = "vilain" + String(i);
  vilain.style.width = "40px";
  vilain.style.height = "40px";
  vilain.style.position = "absolute";
  vilain.style.backgroundImage = "url('assests/Bomberman.png')";
  vilain.style.backgroundSize = "contain";
  vilain.style.backgroundRepeat = "no-repeat";
  vilain.style.left = String(vilain.vilainX * GRID_SIZE) + "px";
  vilain.style.top = String(vilain.vilainY * GRID_SIZE) + "px";
  vilain.style.zIndex = "95";
  plateau.appendChild(vilain);

  vilainList.push(vilain);
}

// Création des vilains - aléatoires (random)
var frame = 0;

function loop() {
  if (frame === 60) {
    for (var i = 0; i < vilainList.length; i++) {
      let vilain = vilainList[i];
      let vilainX = vilain.vilainX;
      let vilainY = vilain.vilainY;
      let direction = vilain.direction;
      blockGrid[vilainX][vilainY].traverser = true;
      //vilain.traverser = true;

      switch (direction) {
        case "left":
          if (vilainY > 0 && blockGrid[vilainX][vilainY - 1].traverser)
            vilainY--;
          break;

        case "right":
          if (vilainX < H_GRID - 1 && blockGrid[vilainX + 1][vilainY].traverser)
            vilainX++;
          break;

        case "up":
          if (vilainY < V_GRID - 1 && blockGrid[vilainX][vilainY + 1].traverser)
            vilainY++;
          break;

        case "down":
          if (vilainX > 0 && blockGrid[vilainX - 1][vilainY].traverser)
            vilainX--;
          break;
      }

      // Pion meurt si vilain va sur lui
      if (
        pion.offsetLeft == vilainX * GRID_SIZE &&
        pion.offsetTop == vilainY * GRID_SIZE
      ) {
        //console.log(x * GRID_SIZE, y * GRID_SIZE, vilainList[i].offsetLeft, vilainList[i].offsetTop);
        document.getElementById("pion").remove();
        alert("you got hit try again!");
        document.location.reload(true);
        break;
      }

      vilain.style.left = String(vilainX * GRID_SIZE) + "px";
      vilain.style.top = String(vilainY * GRID_SIZE) + "px";

      let random = random100();

      if (random < 25) {
        direction = "left";
      }

      if (random >= 25 && random < 50) {
        direction = "right";
      }

      if (random >= 50 && random < 75) {
        direction = "up";
      }

      if (random > 75) {
        direction = "down";
      }

      vilain.vilainX = vilainX;
      vilain.vilainY = vilainY;
      vilain.direction = direction;

      //blockGrid[vilainX][vilainY].traverser = true;
    }

    frame = 0;
  }
  frame++;

  window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);

document.onkeydown = function (event) {
  var event = event || window.event,
    keyCode = event.keyCode;
  switch (keyCode) {
    // Up
    case 38:
      if (y > 0 && blockGrid[x][y - 1].traverser) y--; // ou y-=40;
      startAnimationhaut();
      break;
    // Right
    case 39:
      if (x < H_GRID - 1 && blockGrid[x + 1][y].traverser) x++;
      startAnimationdroite();
      break;
    // Down
    case 40:
      if (y < H_GRID - 1 && blockGrid[x][y + 1].traverser) y++;
      startAnimationbas();
      break;
    // Left
    case 37:
      if (x > 0 && blockGrid[x - 1][y].traverser) x--;
      startAnimationgauche();
      break;
    // Space bar
    case 32:
      createBomb();
      break;
    // default
    default:
      return;
  }

  // Pion meurt s'il va sur vilain
  for (var i = 0; i < vilainList.length; i++) {
    if (
      x * GRID_SIZE == vilainList[i].offsetLeft &&
      y * GRID_SIZE == vilainList[i].offsetTop
    ) {
      //console.log(x * GRID_SIZE, y * GRID_SIZE, vilainList[i].offsetLeft, vilainList[i].offsetTop);
      document.getElementById("pion").remove();
      alert("you got hit try again!");
      document.location.reload(true);
      break;
    }
  }

  stylePion.left = String(x * GRID_SIZE) + "px";
  stylePion.top = String(y * GRID_SIZE) + "px";
};

// function randomColor() {
//   return "#" + ((1 << 24) * Math.random() | 0).toString(16);
// }

function random100() {
  return Math.floor(Math.random() * 100);
}

/* ----- Creation de la bombe ----- */
var bombeList = [];

function createBomb() {
  if (!document.getElementById("bombe")) {
    bombe = document.createElement("div");
    bombe.style.width = GRID_SIZE + "px";
    bombe.style.height = GRID_SIZE + "px";
    bombe.style.position = "absolute";
    bombe.style.backgroundImage = "url('assests/bomb.png')";
    bombe.style.backgroundRepeat = "no-repeat";
    bombe.style.backgroundSize = "contain";
    bombe.style.zIndex = "100";
    bombe.id = "bombe";
    bombe.style.left = String(x * GRID_SIZE) + "px";
    bombe.style.top = String(y * GRID_SIZE) + "px";

    // x, y de la bombe
    // on ne traverse pas la bombe
    blockGrid[x][y].traverser = false;

    bombe.x = x;
    bombe.y = y;

    document.getElementById("plateau").appendChild(bombe);

    bombeList.push(bombe);
    //console.log(bombe.x, bombe.y);

    // la bombe explose après 3 secondes
    setTimeout(explosionBombe, 3000);
  }
}

function explosionBombe() {
  let bx = bombe.x;
  let by = bombe.y;

  if (document.getElementById("bombe")) {
    // la bombe explose case du milieu
    document.getElementById("bombe").style.backgroundImage =
      "url('assests/explode4.gif')";
  }

  setTimeout(disparitionBombe, 1000);
  setTimeout(killEmAll, 1000);
}

function disparitionBombe() {
  let bx = bombe.x;
  let by = bombe.y;

  blockGrid[bx][by].traverser = false;

  // Bombe
  for (var i = 0; i < bombeList.length; i++) {
    // Haut
    if (by > 0) {
      if (!blockGrid[bx][by - 1].traverser) {
        if (blockGrid[bx][by - 1].classList.contains("bsod"))
          score += bsodPoint;
        if (blockGrid[bx][by - 1].classList.contains("stallman"))
          score += stallmanPoint;
        blockGrid[bx][by - 1].traverser = true;
      }
      blockGrid[bx][by - 1].style.backgroundImage =
        'url("assests/explode4.gif"), url("assests/grass2.png")';
      setTimeout(function () {
        blockGrid[bx][by - 1].style.backgroundImage =
          'url("assests/grass2.png")';
      }, 500);
    }

    // Bas
    if (by < V_GRID - 1) {
      if (!blockGrid[bx][by + 1].traverser) {
        if (blockGrid[bx][by + 1].classList.contains("bsod")) score += 2;
        if (blockGrid[bx][by + 1].classList.contains("stallman")) score += 3;
        blockGrid[bx][by + 1].traverser = true;
      }
      blockGrid[bx][by + 1].style.backgroundImage =
        'url("assests/explode4.gif"), url("assests/grass2.png")';
      setTimeout(function () {
        blockGrid[bx][by + 1].style.backgroundImage =
          'url("assests/grass2.png")';
      }, 500);
    }

    // Gauche
    if (bx > 0) {
      if (!blockGrid[bx - 1][by].traverser) {
        if (blockGrid[bx - 1][by].classList.contains("bsod")) score += 2;
        if (blockGrid[bx - 1][by].classList.contains("stallman")) score += 3;
        blockGrid[bx - 1][by].traverser = true;
      }
      blockGrid[bx - 1][by].style.backgroundImage =
        'url("assests/explode4.gif"), url("assests/grass2.png")';
      setTimeout(function () {
        blockGrid[bx - 1][by].style.backgroundImage =
          'url("assests/grass2.png")';
      }, 500);
    }

    // Droite
    if (bx < H_GRID - 1) {
      if (!blockGrid[bx + 1][by].traverser) {
        if (blockGrid[bx + 1][by].classList.contains("bsod")) score += 2;
        if (blockGrid[bx + 1][by].classList.contains("stallman")) score += 3;
        blockGrid[bx + 1][by].traverser = true;
      }
      blockGrid[bx + 1][by].style.backgroundImage =
        'url("assests/explode4.gif"), url("assests/grass2.png")';
      setTimeout(function () {
        blockGrid[bx + 1][by].style.backgroundImage =
          'url("assests/grass2.png")';
      }, 500);
    }

    drawScore();
  }

  document.getElementById("bombe").remove();
  blockGrid[bx][by].traverser = true;
}

function killEmAll() {
  // Les vilains sont détruits par la bombe
  let bugDead = [];

  for (var i = 0; i < vilainList.length; i++) {
    //console.log(vilainList[i]);

    if (
      parseInt(bombe.style.left) == vilainList[i].offsetLeft &&
      parseInt(bombe.style.top) - GRID_SIZE == vilainList[i].offsetTop
    ) {
      vilainList[i].traverser = true;
      vilainList[i].remove();
      //vilainList.splice(i, 1);
      bugDead.push(i);

      score++;
    }

    if (
      parseInt(bombe.style.left) - GRID_SIZE == vilainList[i].offsetLeft &&
      parseInt(bombe.style.top) == vilainList[i].offsetTop
    ) {
      vilainList[i].traverser = true;
      vilainList[i].remove();
      //vilainList.splice(i, 1);
      bugDead.push(i);

      score++;
    }

    if (
      parseInt(bombe.style.left) + GRID_SIZE == vilainList[i].offsetLeft &&
      parseInt(bombe.style.top) == vilainList[i].offsetTop
    ) {
      vilainList[i].traverser = true;
      vilainList[i].remove();
      //vilainList.splice(i, 1);
      bugDead.push(i);

      score++;
    }

    //console.log(vilainList+i);

    if (
      parseInt(bombe.style.left) == vilainList[i].offsetLeft &&
      parseInt(bombe.style.top) + GRID_SIZE == vilainList[i].offsetTop
    ) {
      vilainList[i].traverser = true;
      vilainList[i].remove();
      //vilainList.splice(i, 1);
      bugDead.push(i);

      score++;
    }

    drawScore();
  }

  // on met à jour la liste + splice
  let offseti = 0;
  for (var i = 0; i < bugDead.length; i++) {
    vilainList.splice(bugDead[i - offseti], 1);
    offseti++;
  }

  // Gagné !!!
  if (vilainList.length == 0) {
    alert(
      "Gagné ! Score " +
        score +
        " - Time: " +
        pad(parseInt(totalSeconds / 60)) +
        ":" +
        pad(totalSeconds % 60)
    );
    document.location.reload(true);
    return;
  }

  // Le pion (joueur) est détruit par la bombe
  for (var i = 0; i < GRID_SIZE; i++) {
    //console.log(stylePion.left, stylePion.top);

    // Pion meurt si au milieu de la bombe
    if (
      parseInt(bombe.style.left) == parseInt(stylePion.left) &&
      parseInt(bombe.style.top) == parseInt(stylePion.top)
    ) {
      document.getElementById("pion").remove();
      alert("you lost");
      document.location.reload(true);
      break;
    }

    // Top
    if (
      parseInt(bombe.style.left) == parseInt(stylePion.left) &&
      parseInt(bombe.style.top) - GRID_SIZE == parseInt(stylePion.top)
    ) {
      document.getElementById("pion").remove();
      alert("you lost");
      document.location.reload(true);
      break;
    }

    if (
      parseInt(bombe.style.left) - GRID_SIZE == parseInt(stylePion.left) &&
      parseInt(bombe.style.top) == parseInt(stylePion.top)
    ) {
      document.getElementById("pion").remove();
      alert("you lost");
      document.location.reload(true);
      break;
    }

    if (
      parseInt(bombe.style.left) + GRID_SIZE == parseInt(stylePion.left) &&
      parseInt(bombe.style.top) == parseInt(stylePion.top)
    ) {
      document.getElementById("pion").remove();
      alert("you lost");
      document.location.reload(true);
      break;
    }

    if (
      parseInt(bombe.style.left) == parseInt(stylePion.left) &&
      parseInt(bombe.style.top) + GRID_SIZE == parseInt(stylePion.top)
    ) {
      document.getElementById("pion").remove();
      alert("you lost");
      document.location.reload(true);
      break;
    }
  }
}

/* ----- SPRITESHEET PION ----- */
var animationInterval;
var spriteSheet = document.getElementById("pion");
var widthOfSpriteSheet = 160;
var widthOfEachSprite = 40;
var heightOfSpriteSheet = 160;
var heightOfEachSprite = 40;

function startAnimationbas() {
  stopAnimation();
  var position = widthOfEachSprite; //start position for the image
  const speed = 110; //in millisecond(ms)
  const diff = widthOfEachSprite; //difference between two sprites

  animationInterval = setInterval(() => {
    spriteSheet.style.backgroundPosition = `-${position}px 0px`;

    if (position < widthOfSpriteSheet) {
      position = position + diff;
    } else {
      //increment the position by the width of each sprite each time
      position = widthOfEachSprite;
    }
    //reset the position to show first sprite after the last one
  }, speed);
}

function startAnimationhaut() {
  stopAnimation();
  var position = widthOfEachSprite; //start position for the image
  const speed = 110; //in millisecond(ms)
  const diff = widthOfEachSprite; //difference between two sprites

  animationInterval = setInterval(() => {
    spriteSheet.style.backgroundPosition = `-${position}px 40px`;

    if (position < widthOfSpriteSheet) {
      position = position + diff;
    } else {
      //increment the position by the width of each sprite each time
      position = widthOfEachSprite;
    }
    //reset the position to show first sprite after the last one
  }, speed);
}

function startAnimationgauche() {
  stopAnimation();
  var position = widthOfEachSprite; //start position for the image
  const speed = 110; //in millisecond(ms)
  const diff = widthOfEachSprite; //difference between two sprites

  animationInterval = setInterval(() => {
    spriteSheet.style.backgroundPosition = `-${position}px 80px`;

    if (position < widthOfSpriteSheet) {
      position = position + diff;
    } else {
      //increment the position by the width of each sprite each time
      position = widthOfEachSprite;
    }
    //reset the position to show first sprite after the last one
  }, speed);
}

function startAnimationdroite() {
  stopAnimation();
  var position = widthOfEachSprite; //start position for the image
  const speed = 110; //in millisecond(ms)
  const diff = widthOfEachSprite; //difference between two sprites

  animationInterval = setInterval(() => {
    spriteSheet.style.backgroundPosition = `-${position}px 120px`;

    if (position < widthOfSpriteSheet) {
      position = position + diff;
    } else {
      //increment the position by the width of each sprite each time
      position = widthOfEachSprite;
    }
    //reset the position to show first sprite after the last one
  }, speed);
}

function stopAnimation() {
  clearInterval(animationInterval);
}

function drawScore() {
  var logElem = document.querySelector(".scoreGame");
  logElem.innerHTML = "Score: " + score + "<br/>";
}

// Timer
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
setInterval(setTime, 1000);

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
