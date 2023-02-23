import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

Rasterizer.prototype.lineInter = function(v1, v2, x, y) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;

  let len = Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
  let distance = Math.sqrt(Math.pow((x - x2),2) + Math.pow((y - y2),2));

  let ratio = distance/len;

  let r = r1*ratio + r2*(1-ratio);
  let g = g1*ratio + g2*(1-ratio);
  let b = b1*ratio + b2*(1-ratio);

  return [r,g,b];
}

Rasterizer.prototype.lineRaster = function(v1, v2) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;


  if ((x2-x1) != 0) {
    let slope = Math.floor((y2-y1)/(x2-x1));

    if (x1 < x2) {
      for(let i = Math.floor(x1), y = Math.floor(y1); i <= Math.floor(x2); i++, y = y + slope) {
        this.setPixel(i, y, this.lineInter(v1, v2, i, y));
      }
    }

    else {
      for(let i = Math.floor(x2), y = Math.floor(y2); i <= Math.floor(x1); i++, y = y + slope) {
        this.setPixel(i, y, this.lineInter(v1, v2, i, y));
      }
    }
  }

  else {
    if (y2 > y1) {
      for(let i = Math.floor(y1); i <= Math.floor(y2); i++) {
        this.setPixel(Math.floor(x1), i, this.lineInter(v1, v2, x1, i));
      }
    }

    else {
      for(let i = Math.floor(y2); i <= Math.floor(y1); i++) {
        this.setPixel(Math.floor(x1), i, this.lineInter(v1, v2, x1, i));
      }
    }
  }
}

// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function(v1, v2) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw line
  // this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  // this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
  this.lineRaster(v1, v2);
}

Rasterizer.prototype.triangleInter = function(v1, v2, v3, x, y) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  const X = [x1, x2, x3];
  const Y = [y1, y2, y3];

  let color = [0, 0, 0];

  let len1 = Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
  let len2 = Math.sqrt(Math.pow((x2 - x3),2) + Math.pow((y2 - y3),2));
  let len3 = Math.sqrt(Math.pow((x3 - x1),2) + Math.pow((y3 - y1),2));

  let p1 = (len1 + len2 + len3) / 2;
  let a = Math.sqrt(p1*(p1-len1)*(p1-len2)*(p1-len3));

  let A = [0, 0, 0];

  for (let i = 0; i < 3; i++) {
    let d1 = Math.sqrt(Math.pow((X[i] - x),2) + Math.pow((Y[i] - y),2));
    let d2 = Math.sqrt(Math.pow((X[(i+1)%3] - x),2) + Math.pow((Y[(i+1)%3] - y),2));
    let d3 = Math.sqrt(Math.pow((X[(i+1)%3] - X[i]),2) + Math.pow((Y[(i+1)%3] - Y[i]),2));

    let p2 = (d1 + d2 + d3) / 2;

    A[(2+i)%3] = Math.sqrt(p2*(p2-d1)*(p2-d2)*(p2-d3));
  }

  color[0] = (A[0]/a)*r1 + (A[1]/a)*r2 + (A[2]/a)*r3;
  color[1] = (A[0]/a)*g1 + (A[1]/a)*g2 + (A[2]/a)*g3;
  color[2] = (A[0]/a)*b1 + (A[1]/a)*b2 + (A[2]/a)*b3;

  return color;  
}

Rasterizer.prototype.pointIsInsideTriangle = function(v1,v2,v3,p) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  const [x, y, [r, g, b]] = p;
  const X = [x1, x2, x3];
  const Y = [y1, y2, y3];
  let count = 0;

  for(let i = 0; i < 3; i++) {

    let i1 = X[i];
    let i2 = X[(i+1)%3];
    let j1 = Y[i];
    let j2 = Y[(i+1)%3];
    if (((x-i1)*(j2-j1)) - ((y-j1)*(i2-i1)) >= 0) {
      if (j2-j1 == 0 && y == j1) {
        if (Y[(i+2)%3] > j1) {
          count++;
        }
      }

      else
       count++;
    }
    
  }

  console.log("count: " + count + "\n");
  
  if (count == 3) {
    this.setPixel(Math.floor(x), Math.floor(y), this.triangleInter(v1, v2, v3, Math.floor(x), Math.floor(y)));
  }
}


// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
  // this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  // this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
  // this.setPixel(Math.floor(x3), Math.floor(y3), [r3, g3, b3]);


  let xmin = Math.ceil(Math.min(x1, x2, x3));
  let ymin = Math.ceil(Math.min(y1, y2, y3));
  let xmax = Math.ceil(Math.max(x1, x2, x3));
  let ymax = Math.ceil(Math.max(y1, y2, y3));

  for(let i = xmin; i <= xmax; i++) {
    for(let j = ymin; j <= ymax; j++) {
      let p = [i, j, [r1, g1, b1]];
      this.pointIsInsideTriangle(v1, v2, v3, p);
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "v,0,0,0.9,0.9,0.4;",
  "v,0,40,0.7,0.8,0.4;",
  "v,63,40,0.7,0.8,0.4;",
  "v,63,0,0.7,0.8,0.4;",
  "t,0,1,3;",
  "t,3,1,2;",
  "v,0,63,0.2,0.4,0.6;",
  "v,0,40,0.7,0.8,0.4;",
  "v,63,40,0.7,0.8,0.4;",
  "v,63,63,0.2,0.4,0.6;",
  "t,6,5,4;",
  "t,4,7,6;",
  "v,10,30,0.8,0.4,0.1;",
  "v,0,40,0.8,0.4,0.1;",
  "v,20,40,0.8,0.4,0.1;",
  "v,10,50,0.0,0.0,0.0;",
  "v,0,40,0.0,0.0,0.0;",
  "v,20,40,0.0,0.0,0.0;",
  "t,11,13,12;",
  "t,8,9,10;",
  "v,30,30,0.8,0.4,0.1;",
  "v,20,40,0.8,0.4,0.1;",
  "v,40,40,0.8,0.4,0.1;",
  "v,30,50,0.0,0.0,0.0;",
  "v,20,40,0.0,0.0,0.0;",
  "v,40,40,0.0,0.0,0.0;",
  "t,17,19,18;",
  "t,14,15,16;",
  "v,50,30,0.8,0.4,0.1;",
  "v,40,40,0.8,0.4,0.1;",
  "v,60,40,0.8,0.4,0.1;",
  "v,50,50,0.0,0.0,0.0;",
  "v,40,40,0.0,0.0,0.0;",
  "v,60,40,0.0,0.0,0.0;",
  "t,23,25,24;",
  "t,20,21,22;",
  "v,63,37,0.8,0.4,0.1;",
  "v,60,40,0.8,0.4,0.1;",
  "v,63,40,0.8,0.4,0.1;",
  "v,63,43,0.0,0.0,0.0;",
  "v,60,40,0.0,0.0,0.0;",
  "v,63,40,0.0,0.0,0.0;",
  "t,29,31,30;",
  "t,26,27,28;",
  "v,0,63,0.2,0.4,0.6;",
  "v,63,63,0.2,0.4,0.6;",
  "l,32,33;"
].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
