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
  background(255, 255, 255);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  layerImg.loadPixels();
}

let X_STOP = 1920;
let Y_STOP = 1080;
let DIAMETER = 11;

// return a custom pixel kernel with given diameter (should be odd). will return array[diameter][diameter]
function makePixelKernel(diameter, is_reverse=false, is_diamond=false) {
  let kernel = [];
  let on_value = 1;
  let off_value = 0;
  if (is_reverse) {
    on_value = 0;
    off_value = 1;
  }
  for (let j=0; j<diameter; j++) {
    let j_center = (diameter-1) / 2;
    let j_offset = abs(j_center-j);
    let j_frac = j_offset / j_center;
    let row = [];
    kernel.push(row);
    for (let i=0; i<diameter; i++) {
      let i_center = (diameter-1) / 2;
      let i_offset = abs(i_center-i);
      let i_frac = i_offset / i_center;
      if (is_diamond) {
        if (i_frac + j_frac > 1) {
          row.push(off_value);
        }
        else {
          row.push(on_value);
        }
      }
      else {
        if ((i_frac*i_frac + j_frac*j_frac) > 1) {
          row.push(off_value);
        }
        else {
          row.push(on_value);
        }
      }
    }
  }
  return kernel;
}

let renderCounter=5;
function draw () {

   // make kernel
   is_reverse = true;
   is_diamond = false;
   let kernel = makePixelKernel(DIAMETER, is_reverse, is_diamond)
 
  let num_lines_to_draw = 40;
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
    for(let i=5; i<X_STOP; i++) {
      colorMode(RGB);
      let pix = sourceImg.get(i, j);
      let pixBlur = [0, 0, 0, 255];
      // create a color from the values (always RGB)
      let mask = maskImg.get(i, j); //applies to layered image and blur
      let layer = layerImg.get(i, j);

      if(mask[1] > 128) {
        set(i, j, layer);
        pixBlur = sourceImg.get(i, j);
      }
      else {
        let new_col = [0, 0, 0, 200];
        
        for(let k=0; k<3; k++) {
          new_col[k] = map(0, 10, 100, pix[k], layer[k]);

          let sum_rgb = [0, 0, 0]
          let num_cells = 0;
          for(let wx=0;wx<DIAMETER;wx++){
            for (let wy=0;wy<DIAMETER;wy++) {
              let kernel_value = kernel[wx][wy];
              if (kernel_value > 0) {
                let pixBlur = sourceImg.get(i+wx, j+wy);
                for(let c=0; c<3; c++) {
                  sum_rgb[c] += pixBlur[c];
                }
                num_cells += 1;              
              }
            }
          }
          for(let c=0; c<3; c++) {
            pixBlur[c] = int(sum_rgb[c] / num_cells);
          }        
        }
        
    
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