let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_2.jpg";
let maskFile   = "mask_2.png";
let outputFile = "output_2.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(0, 0, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
}

function draw () {
  let j = renderCounter;
  // get one scanline
  for(let i=0; i<1920; i++) {
    let pix = sourceImg.get(i, j);
    let mask = maskImg.get(i, j);
    if(mask[0] > 128) {
      // draw the full pixels
      set(i, j, pix);
    }
    else {
      // draw a "dimmed" version in gray
      let gray_color = 64 + pix[1] / 8;
      set(i, j, gray_color);
    }
  }
  updatePixels();
  renderCounter = renderCounter + 1;
  print(renderCounter);
  if(renderCounter > 1080) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    // saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}