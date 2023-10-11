let sourceImg=null;
let maskImg=null;
let layerImg=null;

// change these three lines as appropiate
let sourceFile = "input_1.jpg";
let maskFile   = "mask_1.png";
let outputFile = "output_1.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  layerImg = loadImage("layeredimage.png");
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(0, 0, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  layerImg.loadPixels();
}

let X_STOP = 1920;
let Y_STOP = 1080;

let renderCounter=0;
function draw () {
  let num_lines_to_draw = 40;
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
    for(let i=0; i<X_STOP; i++) {
      colorMode(RGB);
      let pix = sourceImg.get(i, j);
      // create a color from the values (always RGB)
      let col = color(pix);
      let mask = maskImg.get(i, j);
      let layer = layerImg.get(i, j);

      if(mask[0] > 128) {
        set(i, j, pix);
      }
      else {
        let new_col = [0, 0, 0, 255];
        for(let k=0; k<3; k++) {
          new_col[k] = map(40, 0, 100, pix[k], layer[k]);
        }
        // let new_col = color(h, s,  newBrt);
        set(i, j, new_col);
      }
    }
  }
  renderCounter = renderCounter + num_lines_to_draw;
  updatePixels();

  // print(renderCounter);
  if(renderCounter > Y_STOP) {
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