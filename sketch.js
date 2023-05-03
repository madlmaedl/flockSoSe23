const swarm = [];
//const test = [];
var count = 0;
var ref = 0;
const numberOfBoid = [90, 87, 82, 82, 74, 73, 75, 70, 67, 65];
const year = ['1974', '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2019', 'Future?'];
const percentageOverfishing = ['10%', '13%', '18%', '18%', '26%', '27%', '25%', '30%', '33%', '35%'];
let roboto, robotoMedium, robotoBold, lora, loraMedium, loraSemibold, loraBold;

let posXRec, posYRec, posXHead, posYHead, posYText;
var titleMoveX = 0;
var titleMoveY = 0;

function preload() {
  roboto = loadFont('assets/Roboto-Regular.ttf');
  robotoMedium = loadFont('assets/Roboto-Medium.ttf');
  robotoBold = loadFont('assets/Roboto-Bold.ttf');

  lora = loadFont('assets/Lora-Regular.ttf');
  loraMedium = loadFont('assets/Lora-Medium.ttf');
  loraSemibold = loadFont('assets/Lora-SemiBold.ttf');
  loraBold = loadFont('assets/Lora-Bold.ttf');
}

function setup() {
  createCanvas(1080, 1920);
  //createCanvas(360, 640);
  background(254);
  for (let i = 1; i <= 90; i++){
    swarm.push(new Boid());
  }

  // for (let i = 1; i <= 50; i++){
  //   test.push(new Boid());
  // }

  posXRec = width - 210;
  posYRec = 20;
  posXHead = posXRec + 10;
  posYHead = 55;
  posYText = 80;
}

function draw() {
  for (let boid of swarm) {
    boid.edges();
    boid.avoidEdge();
    boid.avoidPred();
    boid.flock(swarm);
    boid.chaos(swarm);
    boid.update();
    boid.show(swarm);
  }

  // for (let boid of test) {
  //   boid.edges();
  //   boid.avoidEdge();
  //   boid.avoidPred();
  //   boid.flock(test);
  //   boid.chaos(test);
  //   boid.update();
  //   boid.show(test, 2, 'rect');
  // }


  if (ref <= 9){
    development();
  } else if(swarm.length > 0) {
    kill();
  } else {
    if (count == 120){
      //background(254);
    }
    count ++;
  }

  information();
}

function development(){
  if (count == 80) {
    ref++;
    if (swarm.length != numberOfBoid[ref]){
      var diff = swarm.length - numberOfBoid[ref];
      if (diff > 0){
        for (let i = 1; i <= diff; i++){
          swarm.pop();
        }
      }
      if (diff < 0){
        for (let i = 1; i <= diff; i++){
          swarm.push(new Boid());
        }
      }
    }
    count = 0;
  }
  count ++;
}

function kill(){
  if (count == 10){
    swarm.pop();
    count = 0;
  }
  count ++;
}

function information(){
  noStroke();
  fill(254);
  rect(posXRec, posYRec, 190, 100);

  push();
  textFont(loraBold);
  stroke(3);
  if (titleMoveY >= height -10){
    stroke(254);
  }
  fill(60, 64, 189);
  textSize(50);

  //text('overfishing', titleMoveX, titleMoveY);

  if (titleMoveY >= height -10) {
    titleMoveX = titleMoveX;
    titleMoveY = titleMoveY;
  } else if (titleMoveX > width || titleMoveX < 0) {
    titleMoveX = random(0,200);
    titleMoveY = random(0,1900);
  } else {
    titleMoveX += random(0,2);
    titleMoveY += random(0,5);
  }
  pop();

  push();
  fill(60, 64, 189);
  textSize(30);
  
  if (percentageOverfishing[ref] != undefined){ //data
    textFont(robotoBold);
    text(`${year[ref]}`, posXHead, posYHead); 
    push();
    textSize(14);
    textFont(lora);
    text(`${percentageOverfishing[ref]} overfished marine fishery stocks (global)`, posXHead, posYText, 170, 50);  
    pop();

  } else if (swarm.length > 0 || count < 120){ //future?
    textFont(loraBold);
    text(`${year[ref]}`, posXHead, posYHead); 

  } else if (count >= 120) { //CTA
    textFont(loraBold);
    //text(`${year[ref]}`, posXHead, posYHead); 

    textSize(45);
    textAlign(CENTER, CENTER);
    //stroke(254);
    text(`Use the WWF seafood guide,\n while shopping for fish.`, 0, 0, width, height); 
    if (count == 121){
      //saveFrames('poster_fish', 'png', 1, 1);
    }
  }
  pop();
}
