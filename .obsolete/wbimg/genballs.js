let width = 512;
let height = 512;
let radius = 255;

let centerX = width / 2;
let centerY = width / 2;
let twist = 0.4;
let twistsec = 10;
let edgesec = 3;
let fillRatio = 0.5;
let leafCount = 7;

let basicBrightness = 90;
let leafBrightness = 90;
let basicSaturation = 50;
let leafSaturation = 80;
let startHue = 0;
let endHue = 100;

let letters = 'HAPPY22THBIRTHDAY';
let letterColor = [0, 0, 100];
let letterOffsetY = 30;
let letterSize = 300;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function setup() {
  createCanvas(width, height);
  colorMode(HSB, 100);

  
  (async () => {
    for(let i=0; i<letters.length; i++){
      let currentHue = startHue + i / letters.length * (endHue - startHue);
      let basicColor = [currentHue, basicSaturation, basicBrightness];
      let leafColor = [currentHue, leafSaturation, leafBrightness];
      await sleep(600);
      drawLetterSave(basicColor, leafColor, letters[i], i);
    }
  })();
  
}
function twistPoint(angle, idx){
  let pointRadius = idx * radius / twistsec;
  let pointAngle = angle + twist * idx / twistsec;
  let pointX = centerX + pointRadius * sin(pointAngle);
  let pointY = centerY + pointRadius * cos(pointAngle);
  return [pointX, pointY];
}

function twistShape(angle, deltaAngle) {
  beginShape();
  curveVertex(centerX, centerY);
  for(let i=0; i <= twistsec; i++){
    let p = twistPoint(angle, i);
    curveVertex(p[0], p[1]);
  }
  
  for(let i = 1; i < edgesec; i++){
    let edgeAngle = angle + deltaAngle * i / edgesec;
    let p = twistPoint(edgeAngle, twistsec);
    curveVertex(p[0], p[1]);
  }
  
  for(let i=twistsec; i >= 1; i--){
    let p = twistPoint(angle + deltaAngle, i);
    curveVertex(p[0], p[1]);
  }
  endShape(CLOSE);
}

function centerLetter(letter){
  textSize(letterSize);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(letter, centerX, centerY + letterOffsetY);
}

function drawLetterSave(basicColor, leafColor, letter, idx) {
  background(0,0,0,0);
  beginShape();
  noStroke();
  fill(...basicColor);
  circle(centerX,centerY,radius * 2,radius * 2);
  fill(...leafColor);
  for(let i=0; i<leafCount; i++){
    let startAngle = i / leafCount * 2 * PI;
    let deltaAngle = fillRatio / leafCount * 2 * PI;
    twistShape(startAngle, deltaAngle);
  }
  fill(...letterColor);
  centerLetter(letter);
  let fname = '[' + idx + ']' + letter + '.png';
  print('The filename is ' + fname);
  save(fname);
}