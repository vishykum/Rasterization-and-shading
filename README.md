# 🎨 Rasterizer Playground — Drawing Lines and Triangles in JavaScript

This is a fun, interactive rasterization project where I implemented algorithms to draw lines and solid triangles directly to a virtual framebuffer using JavaScript. The goal was to explore how 2D primitives can be rendered pixel-by-pixel — without relying on WebGL or canvas drawing APIs.

It features color interpolation, triangle filling, and pixel-level rendering with a basic custom graphics pipeline.

---

## 🚀 Getting Started

To run the app locally, you need to launch a local HTTP server in the directory containing `a3.html`.

### Quick Start (Python)

```bash
# For Mac/Linux
python3 -m http.server

# For Windows or general help
# See: https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server
```

Then, open your browser and go to:

```
http://localhost:8000/a3.html
```

If you're not seeing changes after editing code, try clearing your browser cache. See this [StackOverflow thread](https://stackoverflow.com/questions/5690269/disabling-chrome-cache-for-website-development) for tips.

---

## ⚙️ How It Works

The renderer uses a basic framebuffer setup with the function `setPixel(x, y, color)` where:
- `x`, `y` are integer pixel coordinates (top-left is the origin)
- `color` is an array `[r, g, b]` with each value in the range `[0, 1]`

You can use the text input to specify points, lines, and triangles using the following syntax:

- `v,x,y,r,g,b;` — define a vertex at `(x, y)` with color `[r, g, b]`
- `p,i;` — draw a pixel using the vertex at index `i`
- `l,i,j;` — draw a line between vertices `i` and `j`
- `t,i,j,k;` — draw a triangle using vertices `i`, `j`, and `k`

Vertices are indexed in the order they are defined.

Click the **Update** button to render your shapes on the canvas.

---

## ✏️ Features Implemented

- Line rasterization using the DDA algorithm
- Color interpolation along lines (RGB blending)
- Triangle rasterization using a half-plane (inside-outside) test
- Barycentric interpolation for triangle shading
- Bounding box optimization for triangle rendering
- Support for custom vertex definitions and creative compositions

---

## 🔧 Tech Stack

- JavaScript (vanilla)
- HTML for UI layout
- No external libraries used
- Python (only for local development server)

---

## 🌈 Sample Output

The renderer supports colorful line and triangle art with interpolated shading. Here’s what a correctly rendered output looks like:

![output](./output.png)

---

## 💡 Notes

- Only positive `x`, `y` coordinates are supported
- Triangles sharing edges render without gaps or overlaps
- Raster order is consistent — triangle rendering is order-independent
- All computations are done using JavaScript's built-in `Math` functions
- No canvas or WebGL used — just pixel plotting with DOM manipulation

---

## 📁 File Overview

- `a3.html` — UI interface and canvas setup
- `a3.js` — Main implementation of the rasterizer
- `output.png` — Example of a completed render

---

## 🙋‍♂️ About This Project

This was a personal exploration into classic rasterization techniques. The goal was to gain a better understanding of how early computer graphics systems worked at the pixel level — and to implement rendering from the ground up using only JavaScript, math, and basic HTML.

Feel free to fork the project, tweak the renderer, or build your own art using this pixel-pushing playground!
