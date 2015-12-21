var canvas;
var btnDraw, btnErase, btnClear;
var slider;
var isDraw = true;
var isErase = false;

function setup() {
  canvas = createCanvas(192, 192);
  canvas.parent("container");
  canvas.id("sketch");

  background (255);
  slider = createSlider(1, 30, 5);
  slider.parent("slidercontainer");

  btnDraw = createButton("");
  btnDraw.class("fa fa-paint-brush fa-2x");
  btnDraw.mousePressed(erasingit);

  btnErase = createButton("");
  btnErase.class("fa fa-eraser fa-2x");
  btnErase.mousePressed(drawingit);

  btnClear = createButton("");
  btnClear.class("fa fa-refresh fa-2x");
  btnClear.mousePressed(clearing);

  btnDraw.parent("buttoncontainer");
  btnErase.parent("buttoncontainer");
  btnClear.parent("buttoncontainer");
}

function draw() {
  if (mouseIsPressed) {
    if (isErase) {
      stroke(255);
      strokeWeight(10);
      line(pmouseX, pmouseY, mouseX, mouseY);
    } else {
      fill(0);
      // strokeWeight(4);
      strokeWeight(slider.value());
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  } else {
    cursor(CROSS);
  }
}

function drawingit() {
  if (select) {
    isDraw = false;
    isErase = true;
  }
}

function erasingit() {
  if (select) {
    isDraw = true;
    isErase = false;
  }
}

function clearing() {
  background(255);
}
