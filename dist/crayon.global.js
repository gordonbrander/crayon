var CRAY = (function (exports) {
'use strict';

const TWO_PI = 2 * Math.PI;
const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;

const DEVICE_PIXEL_RATIO = (
    'devicePixelRatio' in window
  ? window.devicePixelRatio
  : 1
);

const merge = (object, patch) => Object.assign({}, object, patch);

const id = x => x;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

// Generate a list of numbers, from `begin` to `end`, counting by `step`.
// `begin` and `end` are inclusive.
const interpolate = (begin, end, step=1) => {
  const numbers = [];
  // Make sure step is a positive number.
  step = Math.abs(step);
  if (begin < end) {
    for (let i = begin; i <= end; i = i + step) {
      numbers.push(i);
    }
  } else {
    for (let i = begin; i >= end; i = i - step) {
      numbers.push(i);
    }
  }
  return numbers
};

var utils = Object.freeze({
	TWO_PI: TWO_PI,
	TAU: TWO_PI,
	HALF_PI: HALF_PI,
	QUARTER_PI: QUARTER_PI,
	DEVICE_PIXEL_RATIO: DEVICE_PIXEL_RATIO,
	merge: merge,
	id: id,
	randomBetween: randomBetween,
	interpolate: interpolate
});

const ROUND = 'round';
const BEVEL = 'bevel';
const MITER = 'miter';
const BUTT = 'butt';
const SQUARE = 'square';

const stroke = (ctx, strokeColor, strokeWidth=1, dashOffset=0, cap='butt', join='miter') => {
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineDashOffset = dashOffset;
  ctx.lineJoin = join;
};

const fill = (ctx, fillColor) => {
  if (fillColor !== 'transparent') {
    ctx.fillStyle = fillColor;
  }
};

const shadow = (ctx, offsetX, offsetY, blur=5, shadowColor='black') => {
  ctx.shadowColor = shadowColor;
  ctx.shadowOffsetX = offsetX;
  ctx.shadowOffsetY = offsetY;
  ctx.shadowBlur = blur;
};

const style = (ctx, hasFill, hasStroke) => {
  if (hasFill) {
    ctx.fill();
  }
  if (hasStroke) {
    ctx.stroke();
  }
};

const rect = (ctx, x, y, width, height, hasFill=true, hasStroke=false) => {
  // Draw rect from center, not top left
  ctx.rect(x - (width / 2), y - (height / 2), width, height);
  style(ctx, hasFill, hasStroke);
};

const ellipse = (ctx, x, y, radiusX, radiusY, hasFill=true, hasStroke=false) => {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, TWO_PI);
  style(ctx, hasFill, hasStroke);
};

const triangle = (ctx, x0, y0, x1, y1, x2, y2, hasFill=true, hasStroke=false) => {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  style(ctx, hasFill, hasStroke);
};

const quad = (ctx, x0, y0, x1, y1, x2, y2, x3, y3, hasFill=true, hasStroke=false) => {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  style(ctx, hasFill, hasStroke);
};

const line = (ctx, x0, y0, x1, y1, hasStroke=true) => {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  style(ctx, false, hasStroke);
};

const arc = (ctx, x, y, radius, startAngle, endAngle, anticlockwise, hasStroke=true) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  style(ctx, false, hasStroke);
};

const clear = (ctx, x, y, width, height) => {
  ctx.clearRect(x - (width / 2), y - (height / 2), width, height);
};

// Convert to cartesian coords so that origin (0, 0) is at center.
// An elegant coordinate system for a more civilized age.
// Additionally, you can provide a scalingFactor to compensate for
// retina displays.
// See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform.
const transformCartesian = (ctx, width, height, scalingFactor) => {
  ctx.setTransform(
    1 * scalingFactor,
    0,
    0,
    -1 * scalingFactor,
    (width / 2),
    (height / 2)
  );
};

var draw = Object.freeze({
	ROUND: ROUND,
	BEVEL: BEVEL,
	MITER: MITER,
	BUTT: BUTT,
	SQUARE: SQUARE,
	stroke: stroke,
	fill: fill,
	shadow: shadow,
	style: style,
	rect: rect,
	ellipse: ellipse,
	triangle: triangle,
	quad: quad,
	line: line,
	arc: arc,
	clear: clear,
	transformCartesian: transformCartesian
});

/*
A shapelist renderer with groups provides all of the benefits of:

- Method chaining (just put them in an array)
- Serialization (JSON.stringify)
- Scene graph/DOM (declarative)

Additionally, it doesn't care whether you bash it, or copy-on-write.
*/
const renderEllipse = (ctx, shape) => {
  const [x, y] = shape.coords;
  const [width, height] = shape.size;
  const {fill: fill$$1='black', stroke: stroke$$1='transparent', strokeWidth=1} = shape;
  fill(ctx, shape.fill);
  stroke(ctx, stroke$$1, strokeWidth);
  ellipse(ctx, x, y, width, height, fill$$1 !== 'transparent', stroke$$1 !== 'transparent');
};

const renderShapes = (state, shapes) => {
  for (let shape of shapes) {
    renderShape(state, shape);
  }
};

const renderShape = (state, shape) => {
  const {context, width, height} = state;
  const {type} = shape;
  if (type === 'clear') {
    clear(context, 0, 0, width, height);
  } else if (type === 'ellipse') {
    renderEllipse(context, shape);
  }
};

const renderGroup = (state, group) => {
  // if (group.scale) {
  //   scale(group.scale)
  // }
  // if (group.translate) {
  //   translate(group.translate[0], group.translate[1])
  // }
  // if (group.rotate) {
  //   rotate(group.rotate)
  // }
  renderShapes(state, group.shapes);  
};

const renderer = state => shapes => renderShapes(state, shapes);

var shape = Object.freeze({
	renderEllipse: renderEllipse,
	renderShapes: renderShapes,
	renderShape: renderShape,
	renderGroup: renderGroup,
	renderer: renderer
});

// Cast to px string
const px = n => n + 'px';

const canvas = (canvasEl, width, height) => {
  const canvasWidth = width * DEVICE_PIXEL_RATIO;
  const canvasHeight = height * DEVICE_PIXEL_RATIO;
  canvasEl.width = canvasWidth;
  canvasEl.height = canvasHeight;
  canvasEl.style.width = px(width);
  canvasEl.style.height = px(height);
  const ctx = canvasEl.getContext('2d');
  transformCartesian(ctx, canvasWidth, canvasHeight, DEVICE_PIXEL_RATIO);
  return ctx
};

// Read a mouse or other event with client rect coords as cartesian
// coords.
const readEventCartesian = (event, canvasEl, scalingFactor) => [
  event.clientX - ((canvasEl.width / scalingFactor) / 2),
  -1 * (event.clientY - ((canvasEl.height / scalingFactor) / 2))
];

var dom = Object.freeze({
	canvas: canvas,
	readEventCartesian: readEventCartesian
});

/*
Utilities for writing CSS color values
https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
*/
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;
const rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`;
const hsla = (h, s, l, a) => `hsla(${h}, ${s * 100}%, ${l * 100}%, ${a})`;
const hsl = (h, s, l) => `hsl(${h}, ${s * 100}%, ${l * 100}%)`;

var color = Object.freeze({
	rgba: rgba,
	rgb: rgb,
	hsla: hsla,
	hsl: hsl
});

const EVENTS = [
  'click',
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseover',
  'mouseout',
  'touchstart',
  'touchend',
  'touchmove',
  'keydown',
  'keyup',
  'keypress',
  'wheel',
  'devicemotion',
  'deviceorientation',
  'orientationchange'
];

const init = options => {
  const sketch = {};
  const {middleware=id} = options;
  const xoptions = middleware(options);
  const {update=id, el, setup, draw} = xoptions;

  sketch.state = setup();

  // Bind event listeners
  for (let event of EVENTS) {
    const handler = xoptions[event];
    if (handler) {
      el.addEventListener(event, e => {
        sketch.state = handler(sketch.state, e);
      });
    }
  }

  const tick = () => {
    sketch.state = update(sketch.state);
    draw(sketch.state);
    requestAnimationFrame(tick);
  };
  tick();

  return sketch
};

var sketch = Object.freeze({
	init: init
});

exports.draw = draw;
exports.shape = shape;
exports.utils = utils;
exports.dom = dom;
exports.color = color;
exports.sketch = sketch;

return exports;

}({}));
