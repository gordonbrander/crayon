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

const copy = o => Object.assign({}, o);

// Merge 2 objects together, creating a new object.
// Properties of `b` win any collision.
const merge = (a, b) => Object.assign({}, a, b);

const _set = (o, k, v) => {
  const copy = Object.assign({}, o);
  o[k] = v;
  return o
};

// Set value of a field on an object.
// This function is copy-on-write. It only returns new object if value
// has actually changed.
const set$1 = (o, k, v) => o[k] !== v ? _set(o, k, v) : o;

const id = x => x;

// Create a setter function that will only invoke `set` if new
// `value` is different from old value as read by `get`.
// This can be used to create setters for specific fields, or
// even a setter for fields deep within a structure.
const setter = (get, set) => (outer, value) =>
  get(outer) === value ? outer : set(outer, value);

// Create a function that can get and set a property within a data structure,
// returning a new version of that data structure if the property has changed.
const cursor = (get, set, update) => (outer, value) =>
  set(outer, update(get(outer), value));

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const ratio = (n, begin, end) => n / (end - begin);

// Multiply a number. It's useful to have a functional form of this operation
// for cursors and stuff.
const scale = (n, x) => n * x;

// Re-scale a number — project it from one scale to another.
// `isBounded` will constraint the result to the range.
const rescale = (n0, a0, b0, a1, b1, isBounded=false) => {
  const n1 = (b1 - a1) * ratio(n0, a0, b0);
  return isBounded ? clamp(n1, a1, b1) : n1
};

const fmod = (float, n) => {
  const int = Math.floor(float);
  return int % n + float - int
};

const lerp = (a, b, scalar) => ((b - a) * scalar) + a;

// Clamp a 360 degree value. Negative degrees rotate the other direction.
const degrees = n => (360 + n) % 360;

// Convert radians to degrees
const radToDeg = rad => rad * (180 / Math.PI);

// Convert degrees to radians
const degToRad = deg => degrees(deg) * (Math.PI / 180);

// Round to nearest x.
// Factor is typically a multiple of 10.
const round = (n, factor=1) => Math.round(n * factor) / factor;

const rangef$1 = (f, begin, end, step=1, extra) => {
  const numbers = [];
  // Make sure step is a positive number.
  step = Math.abs(step);
  if (begin < end) {
    for (let i = begin; i <= end; i = i + step) {
      numbers.push(f(i, extra));
    }
  } else {
    for (let i = begin; i >= end; i = i - step) {
      numbers.push(f(i, extra));
    }
  }
  return numbers
};

// Generate a list of numbers, from `begin` to `end`, counting by `step`.
// `begin` and `end` are inclusive.
const range = (begin, end, step=1) => rangef$1(id, begin, end, step);

// Generate a pseudo-random number between range `min` and `max`.
const random$1 = (min=0, max=1) => Math.random() * (max - min) + min;

// Generate a pseudo-random integer between range `min` and `max`.
const randomInt = (min=0, max=1) => Math.floor(random$1(min, max));

// Choose a random element from an array
const choice = array =>
  array.length > 0 ? array[randomIntBetween(0, array.length)] : null;

// Generate an array of `length` random numbers.
const nrandom = (length, min=0, max=1) =>
  rangef$1(0, length, () => random$1(min, max));

var utils = Object.freeze({
	TWO_PI: TWO_PI,
	TAU: TWO_PI,
	HALF_PI: HALF_PI,
	QUARTER_PI: QUARTER_PI,
	DEVICE_PIXEL_RATIO: DEVICE_PIXEL_RATIO,
	copy: copy,
	merge: merge,
	set: set$1,
	id: id,
	setter: setter,
	cursor: cursor,
	clamp: clamp,
	ratio: ratio,
	scale: scale,
	rescale: rescale,
	fmod: fmod,
	lerp: lerp,
	degrees: degrees,
	radToDeg: radToDeg,
	degToRad: degToRad,
	round: round,
	rangef: rangef$1,
	range: range,
	random: random$1,
	randomInt: randomInt,
	choice: choice,
	nrandom: nrandom
});

const ROUND = 'round';
const BEVEL = 'bevel';
const MITER = 'miter';
const BUTT = 'butt';
const SQUARE = 'square';

const stroke = (context, strokeColor, strokeWidth=1, cap='butt', join='miter') => {
  context.strokeStyle = strokeColor;
  context.lineWidth = strokeWidth;
  context.lineCap = cap;
  context.lineJoin = join;
  context.stroke();
};

const dashStroke = (context, segments, dashOffset=0, strokeColor, strokeWidth=1, cap='butt', join='miter') => {
  context.strokeStyle = strokeColor;
  context.lineWidth = strokeWidth;
  context.lineCap = cap;
  context.lineJoin = join;
  context.setLineDash(segments);
  context.lineDashOffset = dashOffset;
  context.stroke();
};

const fill = (context, fillColor) => {
  context.fillStyle = fillColor;
  context.fill();
};

const ellipse = (context, x, y, radiusX, radiusY) => {
  context.beginPath();
  context.ellipse(x, y, radiusX, radiusY, 0, 0, TWO_PI);
};

const triangle = (context, x0, y0, x1, y1, x2, y2) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
};

const quad = (context, x0, y0, x1, y1, x2, y2, x3, y3) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context.closePath();
};

const rect = (context, x, y, width, height) => {
  // Draw rect from center, not top left
  context.beginPath();
  context.rect(x - (width / 2), y - (height / 2), width, height);
};

const fivegon = (context, x0, y0, x1, y1, x2, y2, x3, y3, x4, y4) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context.lineTo(x4, y4);
  context.closePath();
};

const sixgon = (context, x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context.lineTo(x4, y4);
  context.lineTo(x5, y5);
  context.closePath();
};

const line = (context, x0, y0, x1, y1) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
};

const bezier = (context, cpx0, cpy0, cpx1, cpy1, x0, y0, x1, y1, isClosed=false) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.bezierCurveTo(cpx0, cpy0, cpx1, cpy1, x1, y1);
  if (isClosed) {
    context.closePath();
  }
};

const arc = (context, x, y, radius, startAngle, endAngle, anticlockwise, isClosed=false) => {
  context.beginPath();
  context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  if (isClosed) {
    context.closePath();
  }
};

const clear = (context, x, y, width, height) => {
  context.clearRect(x - (width / 2), y - (height / 2), width, height);
};

const image = (context, img, x, y) => {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  // Draw rect from center, not top left
  context.drawImage(img, x - (width / 2), y - (height / 2));
};

// Convert to cartesian coords so that origin (0, 0) is at center.
// An elegant coordinate system for a more civilized age.
// Additionally, you can provide a scalingFactor to compensate for
// retina displays.
// See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform.
const transformCartesian = (context, width, height, scalingFactor) => {
  context.setTransform(
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
	dashStroke: dashStroke,
	fill: fill,
	ellipse: ellipse,
	triangle: triangle,
	quad: quad,
	rect: rect,
	fivegon: fivegon,
	sixgon: sixgon,
	line: line,
	bezier: bezier,
	arc: arc,
	clear: clear,
	image: image,
	transformCartesian: transformCartesian
});

/* Simple 2D vector math with arrays. Just the basics. */
const PRECISION = 100000000;

const getX = ([x, y]) => x;
const setX = setter(getX, ([x, y], n) => [n, y]);

const getY = ([x, y]) => y;
const setY = setter(getY, ([x, y], n) => [x, n]);

const setXY = (vec2d, x, y) => (
    vec2d.x === x && vec2d.y === y
  ? vec2d
  : [x, y]
);

const add = ([x0, y0], [x1, y1]) => [x0 + x1, y0 + y1];
const sub = ([x0, y0], [x1, y1]) => [x0 - x1, y0 - y1];
const mult = ([x, y], scalar) => [x * scalar, y * scalar];
// Return the inverse of a vector
const inv = v => mult(v, -1);
const multX = ([x, y], scalar) => [x * scalar, y];
const multY = ([x, y], scalar) => [x, y * scalar];
const div = ([x, y], scalar) => [x / scalar, y / scalar];

const distSq = ([x0, y0], [x1, y1]) => {
  const dx = x0 - x1;
  const dy = y0 - y1;
  return (dx * dx) + (dy * dy)
};

// Calculate the euclidian disance between two vectors
const dist = (a, b) => Math.sqrt(distSq(a, b));

// Linear interpolation between two vec2Ds
const lerp$1 = ([x0, y0], [x1, y1], scalar) => [
  lerp(x0, x1, scalar),
  lerp(y0, y1, scalar)
];

const magSq = ([x, y]) => (x * x) + (y * y);

// Calculate the length/magnitude of a vector
const mag = v => Math.sqrt(magSq(v));

const dot = ([x0, y0], [x1, y1]) => (x0 * x1) + (y0 * y1);

const norm = v => div(v, mag(v));

const rotation = ([x, y]) => radToDeg(Math.atan2(y, x));

// Rotate a vector by n
const rot = (v, deg) => {
  const rad = degToRad(deg);
  const len = mag(v);
  return [
    round(Math.cos(rad) * len, PRECISION),
    round(Math.sin(rad) * len, PRECISION)
  ]
};

// Rotate a vector around a circle.
const circ = ([cx, cy], radius, deg) => {
  const rad = degToRad(deg);
  return [
    round(cx + radius * Math.cos(rad), PRECISION),
    round(cy + radius * Math.sin(rad), PRECISION)
  ]
};

// Generate an array of `length` random vectors between `min` and `max`.
const nrandom$1 = (length, min=0, max=1) =>
  rangef(0, length, () => [random(min, max), random(min, max)]);

// TODO boundingBox
// TODO origin

var vec2d = Object.freeze({
	getX: getX,
	setX: setX,
	getY: getY,
	setY: setY,
	setXY: setXY,
	add: add,
	sub: sub,
	mult: mult,
	inv: inv,
	multX: multX,
	multY: multY,
	div: div,
	distSq: distSq,
	dist: dist,
	lerp: lerp$1,
	magSq: magSq,
	mag: mag,
	dot: dot,
	norm: norm,
	rotation: rotation,
	rot: rot,
	circ: circ,
	nrandom: nrandom$1
});

// Create an hsla color object.
// Validates inputs and makes sure the result is a valid color.
const hsla = (h=0, s=0, l=0, a=1) => ({
  type: 'hsla',
  h: h % 360,
  s: clamp(s, 0, 1),
  l: clamp(l, 0, 1),
  a: clamp(a, 0, 1)
});

// Just an alias for hsla, with opacity at 1.
const hsl = (h=0, s=0, l=0) => hsla(h, s, l, 1);

// Define some basic color constants.
const BLACK = Object.freeze(hsla(0, 0, 0));
const WHITE = Object.freeze(hsla(0, 0, 1));
const TRANSPARENT = Object.freeze(hsla(0, 0, 0, 0));

// Define getter, setter for hue.
const getH = hsla => hsla.h;
const setH = setter(getH, ({s, l, a}, h) => hsla(h, s, l, a));

// Rotate hue along color wheel by `deg`.
//
//     scaleS(color, 0.4)
//
// Returns a new hsla color.
const rotateH = ({h, s, l, a}, deg) => hsla(h + deg, s, l, a);

// Define getter, setter for saturation.
const getS = hsla => hsla.s;
const setS = setter(getS, ({h, l, a}, s) => hsla(h, s, l, a));

// Scale saturation. Multiplies current saturation.
//
//     scaleS(color, 0.4)
//
// Returns a new hsla color.
const scaleS = cursor(getS, setS, scale);

const getL = hsla => hsla.l;
const setL = setter(getL, ({h, s, a}, l) => hsla(h, s, l, a));
const scaleL = cursor(getL, setL, scale);

const getA$1 = hsla => hsla.a;
const setA = setter(getA$1, ({h, s, l}, a) => hsla(h, s, l, a));
const scaleA = cursor(getA$1, setA, scale);

const greyscale = ({h, s, l, a}) => hsla(0, 0, l, a);

const toCSS$1 = ({h, s, l, a}) =>
  `hsla(${h}, ${clamp(s, 0, 1) * 100}%, ${clamp(l, 0, 1) * 100}%, ${clamp(a, 0, 1)})`;

// Linear interpolation between two colors.
// Finds a point between them as determined by scalar.
const lerp$2 = (a, b, scalar) => hsla(
  lerp(a.h, b.h, scalar),
  lerp(a.s, b.s, scalar),
  lerp(a.l, b.l, scalar),
  lerp(a.a, b.a, scalar)
);

// Get the complementary color
const complement = hsla => rotateH(hsla, 180);

const triadic = hsla => [hsla, rotateH(hsla, -120), rotateH(hsla, 120)];

const tetradic = hsla => [
  hsla,
  rotateH(hsla, -90),
  rotateH(hsla, 90),
  rotateH(hsla, 180)
];

// Generate analogous colors. These are colors spread evenly across the color
// wheel.
//
// Spread is the number of degrees (or the width of the slice of the pie)
// that the colors should be sampled from. Narrower means more similar
// analogous colors.
const analogous = (hsla, spread=180) => {
  const slice = (spread % 360) / 4;
  return [
    rotateH(hsla, -2 * slice),
    rotateH(hsla, -1 * slice),
    hsla,
    rotateH(hsla, slice),
    rotateH(hsla, 2 * slice)
  ]
};

// Several shades of the same color
// @TODO s -30, l -20 or -50. Combine in different ways.
const shades = hsla => [
  scaleL(hsla, 0.4),
  scaleL(hsla, 0.2),
  hsla,
  scaleL(hsla, 1.2),
  scaleL(hsla, 1.4)
];

var hsla$1 = Object.freeze({
	hsla: hsla,
	hsl: hsl,
	BLACK: BLACK,
	WHITE: WHITE,
	TRANSPARENT: TRANSPARENT,
	getH: getH,
	setH: setH,
	rotateH: rotateH,
	getS: getS,
	setS: setS,
	scaleS: scaleS,
	getL: getL,
	setL: setL,
	scaleL: scaleL,
	getA: getA$1,
	setA: setA,
	scaleA: scaleA,
	greyscale: greyscale,
	toCSS: toCSS$1,
	lerp: lerp$2,
	complement: complement,
	triadic: triadic,
	tetradic: tetradic,
	analogous: analogous,
	shades: shades
});

/*
Basic tools for working with rgba colors.

Note that because hsla is much easier to work with, all the color tools
are in the hsla library. You typically want to convert rgba values to
hsla to do things like shift hue, lighten, etc.
*/
// Rescale a number in range 0..1 to a number in range 0..255
// Scaled number is clamped (can't go beyond range).
// Scaled number is also rounded.
const scale255 = ratio$$1 => Math.round(rescale(ratio$$1, 0, 1, 0, 255, true));

const rgba = (r=0, g=0, b=0, a=1) => ({
  type: 'rgba',
  r: scale255(r),
  g: scale255(g),
  b: scale255(b),
  a: clamp(a, 0, 1)
});

const toCSS$2 = ({r, g, b, a}) =>
  `rgba(${scale255(r)}, ${scale255(g)}, ${scale255(b)}, ${clamp(a, 0, 1)})`;

const getA$2 = rgba => rgba.a;

var rgba$1 = Object.freeze({
	rgba: rgba,
	toCSS: toCSS$2,
	getA: getA$2
});

/*
Utilities for converting between, to and from CSS color values.
https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

hslaToRgba and rgba2Hsla are based on
https://github.com/Gozala/color.flow/blob/master/src/Color.js
*/
// Get the alpha value for some color type.
const getA = color => (
    color.type === 'hsla'
  ? getA$1(color)
  : color.type === 'rgba'
  ? getA$2(color)
  : 0
);

const isTransparent = color => getA(color) === 0;

// Convert some color type to CSS.
const toCSS = color => (
    color.type === 'hsla'
  ? toCSS$1(color)
  : color.type === 'rgba' ?
    toCSS$2(color)
  : 'transparent'
);

const hslaToRgba = ({h, s, l, a}) => {
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  h = h / degToRad(60);
  const x = chroma * (1 - Math.abs(fmod(h, 2 - 1)));

  const [r, g, b] = (
      h < 0
    ? [0, 0, 0]
    : h < 1
    ? [chroma, x, 0]
    : h < 2
    ? [x, chroma, 0]
    : h < 3
    ? [0, chroma, x]
    : h < 4
    ? [0, x, chroma]
    : h < 5
    ? [x, 0, chroma]
    : h < 6
    ? [chroma, 0, x]
    : [0, 0, 0]
  );

  const m = l - chroma / 2;

  return rgba(
    Math.round(255 * (r + m)),
    Math.round(255 * (g + m)),
    Math.round(255 * (b + m)),
    alpha
  )
};

const rgbaToHsla = ({r, g, b, a}) => {
  r = r / 255;
  g = g / 255;
  b = b / 255;
  const max = Math.max(Math.max(r, g), b);
  const min = Math.min(Math.min(r, g), b);
  const delta = max - min;

  const c = (
      max === r
    ? fmod((g - b) / delta, 6)
    : max === g
    ? (b - r) / delta + 2
    : (r - g) / delta + 4
  );

  const h = degToRad(60) * c;

  const l = (max + min) / 2;
  const s = (
      l === 0
    ? 0
    : delta / (1 - Math.abs(2 * lightness - 1))
  );

  return hsla(h, s, l, alpha)
};

var color = Object.freeze({
	getA: getA,
	isTransparent: isTransparent,
	toCSS: toCSS,
	hslaToRgba: hslaToRgba,
	rgbaToHsla: rgbaToHsla
});

/*
Higher-level shapelist rendering represents more complex draw calls as shape
objects. Provides all of the benefits of:

- Method chaining (just put them in an array)
- Serialization (JSON.stringify)
- Scene graph/DOM (declarative)

It doesn't care whether you bash it, or copy-on-write.

Stops short of being a full vector graphics API though. You should use
SVG for that.
*/
const ORIGIN = Object.freeze([0 , 0]);
const ACTUAL_SIZE = Object.freeze([1, 1]);

const wrapTransform = render => (context, shape) => {
  const {scaleRatio=1, canvas: {width, height}} = context;
  const {translate=ORIGIN, scale=ACTUAL_SIZE, skew=ORIGIN, rotate=0} = shape;
  const [translateX, translateY] = translate;
  const [scaleX, scaleY] = scale;
  const [skewX, skewY] = skew;
  // context.save()
  // Sets transform while retaining cartesian coords
  context.setTransform(
    scaleX * scaleRatio,
    skewX,
    skewY,
    (scaleY * scaleRatio),
    translateX + (width / 2),
    translateY + (height / 2)
  );
  if (rotate > 0 || rotate < 0) {
    context.rotate(rotate);
  }
  render(context, shape);
  // context.restore()
};

const renderTransform = wrapTransform((context, shape) =>
  renderShape(context, shape.shape));

const renderGroup = wrapTransform((context, shape) =>
  renderShapes(context, shape.shapes));

// Invoke fill if color is not transparent.
const renderFill = (context, shape) => {
  const {fill: fill$$1=TRANSPARENT} = shape;
  if (!isTransparent(fill$$1)) {
    fill(context, toCSS(fill$$1));
  }
};

// Invoke stroke if color is not transparent.
const renderStroke = (context, shape) => {
  const {stroke: stroke$$1=TRANSPARENT, strokeWidth=1} = shape;
  if (!isTransparent(stroke$$1)) {
    stroke(context, toCSS(stroke$$1), strokeWidth);
  }
};

const renderEllipse = (context, shape) => {
  const {pos: [x, y]} = shape;
  const {radius: [radiusX, radiusY]} = shape;
  ellipse(context, x, y, radiusX, radiusY);
  renderFill(context, shape);
  renderStroke(context, shape);
};

const renderTriangle = (context, shape) => {
  const {pos0: [x0, y0], pos1: [x1, y1], pos2: [x2, y2]} = shape;
  triangle(context, x0, y0, x1, y1, x2, y2);
  renderFill(context, shape);
  renderStroke(context, shape);
};

const triangle$1 = (pos0, pos1, pos2, fill$$1=TRANSPARENT, stroke$$1=TRANSPARENT, strokeWidth=1) => ({
  type: 'triangle',
  pos0, pos1, pos2, fill: fill$$1, stroke: stroke$$1, strokeWidth
});

// Construct an equilateral triangle
// Deshugars to an ordinary Triangle shape.
const eqtri = (pos, radius, fill$$1, stroke$$1, strokeWidth) =>
  triangle$1(
    circ(pos, radius, 0),
    circ(pos, radius, 120),
    circ(pos, radius, -120),
    fill$$1, stroke$$1, strokeWidth
  );

const renderRect = (context, shape) => {
  const {pos: [x, y], size: [width, height]} = shape;
  rect(context, x, y, width, height);
  renderFill(context, shape);
  renderStroke(context, shape);
};

const renderQuad = (context, shape) => {
  const {tl: [x0, y0], tr: [x1, y1], br: [x2, y2], bl: [x3, y3]} = shape;
  quad(context, x0, y0, x1, y1, x2, y2, x3, y3);
  renderFill(context, shape);
  renderStroke(context, shape);
};

const renderLine = (context, shape) => {
  const {pos0: [x0, y0], pos1: [x1, y1]} = shape;
  line(context, x0, y0, x1, y1);
  renderStroke(context, shape);
};

const renderArc = (context, shape) => {
  const {pos: [x, y], radius} = shape;
  const {startAngle, endAngle, anticlockwise, isClosed=false} = shape;
  arc(context, x, y, radius, startAngle, endAngle, anticlockwise, isClosed);
  if (isClosed) {
    renderFill(context, shape);
  }
  renderStroke(context, shape);
};

const getPos = shape => shape.pos;
const setPos = (shape, vec2d) => set(shape, 'pos', vec2d);

const getSize = shape => shape.size;
const setSize = (shape, vec2d) => set(shape, 'size', vec2d);

// Define a bezier point.
// `pos` defines the position of the point.
// `ctl` defines the control point.
const bpoint = (pos, ctl) => ({
  type: 'bpoint',
  pos, ctl
});

const renderBezier = (context, shape) => {
  const {isClosed=false} = shape;
  const [x0, y0] = shape.bez0.pos;
  const [cx0, cy0] = shape.bez0.ctl;
  const [x1, y1] = shape.bez1.pos;
  const [cx1, cy1] = shape.bez1.ctl;
  bezier(context, cx0, cy0, cx1, cy1, x0, y0, x1, y1, isClosed);
  renderStroke(context, shape);
  if (isClosed) {
    renderFill(context, shape);
  }
};

const renderPoly = (context, shape) => {
  const {isClosed=false} = shape;
  const [p0, ...px] = shape.points;
  const [x0, y0] = p0;
  context.beginPath();
  context.moveTo(x0, y0);
  for (let [x, y] of px) {
    context.lineTo(x, y);
  }
  if (isClosed) {
    context.closePath();
  }
  renderStroke(context, shape);
  if (isClosed) {
    renderFill(context, shape);
  }
};

const renderBackground = (context, shape) => {
  const {canvas: {width, height}} = context;
  rect(context, 0, 0, width, height, true);
  renderFill(context, shape);
};

const renderShapes = (context, shapes) => {
  for (let shape of shapes) {
    renderShape(context, shape);
  }
};

// Pass in any shape object and it will be rendered with its backend.
// Shapes that are not recognized will be ignored.
const renderShape = (context, shape) => {
  const {canvas: {width, height}} = context;
  const {type} = shape;
  if (type === 'clear') {
    clear(context, 0, 0, width, height);
  } else if (type === 'background') {
    renderBackground(context, shape);
  } else if (type === 'ellipse') {
    renderEllipse(context, shape);
  } else if (type === 'triangle') {
    renderTriangle(context, shape);
  } else if (type === 'rect') {
    renderRect(context, shape);
  } else if (type === 'quad') {
    renderQuad(context, shape);
  } else if (type === 'poly') {
    renderPoly(context, shape);
  } else if (type === 'line') {
    renderLine(context, shape);
  } else if (type === 'arc') {
    renderArc(context, shape);
  } else if (type === 'bezier') {
    renderBezier(context, shape);
  } else if (type === 'group') {
    renderGroup(context, shape);
  } else if (type === 'transform') {
    renderTransform(context, shape);
  } else if (type === 'noop') {
    // Do nothing
  } else {
    console.warn('Unrecognized shape: ' + shape.type);
  }
};

var shape = Object.freeze({
	renderTransform: renderTransform,
	renderGroup: renderGroup,
	renderEllipse: renderEllipse,
	renderTriangle: renderTriangle,
	triangle: triangle$1,
	eqtri: eqtri,
	renderRect: renderRect,
	renderQuad: renderQuad,
	renderLine: renderLine,
	renderArc: renderArc,
	getPos: getPos,
	setPos: setPos,
	getSize: getSize,
	setSize: setSize,
	bpoint: bpoint,
	renderBezier: renderBezier,
	renderPoly: renderPoly,
	renderBackground: renderBackground,
	renderShapes: renderShapes,
	renderShape: renderShape
});

const setupCanvas2D = options => {
  const {canvas, width, height, scaleRatio=DEVICE_PIXEL_RATIO} = options;
  const canvasWidth = width * scaleRatio;
  const canvasHeight = height * scaleRatio;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const context = canvas.getContext('2d');
  // Assign scaleRatio to context so we have it for calculations later.
  context.scaleRatio = scaleRatio;
  return context
};

// Given a set of options, configures a canvas element
// for 2D cartesian space.
// Returns a context object containing canvas 2D context
const setupCartesianCanvas = options => {
  const context = setupCanvas2D(options);
  // Transform canvas coords to make them cartesian
  transformCartesian(
    context,
    context.canvas.width,
    context.canvas.height,
    context.scaleRatio
  );
  return context
};

// Read a mouse or other event with client rect coords as cartesian
// coords.
const readEventCartesian = (event, {canvas, scaleRatio}) => [
  event.clientX - ((canvas.width / scaleRatio) / 2),
  (event.clientY - ((canvas.height / scaleRatio) / 2))
];

const IMG_EVENT_OPTIONS = {once: true, capture: false};

// Load an image from a given `src`.
// Returns a promise for the image.
const loadImage = src => {
  return new Promise((resolve, reject) => {
    var img = new Image(); // Create new img element
    img.addEventListener('load', e => resolve(img), IMG_EVENT_OPTIONS);
    // Set source path
    img.src = 'myImage.png';
  })
};

const loadImages$1 = (srcs) => Promise.all(srcs.map(loadImage));

var dom = Object.freeze({
	setupCanvas2D: setupCanvas2D,
	setupCartesianCanvas: setupCartesianCanvas,
	readEventCartesian: readEventCartesian,
	loadImage: loadImage,
	loadImages: loadImages$1
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
  'wheel',
  'devicemotion',
  'deviceorientation',
  'orientationchange'
];

const WINDOW_EVENTS = [
  'keydown',
  'keyup',
  'keypress'
];

const init = options => {
  const sketch = {};
  const {middleware=id} = options;
  const xoptions = middleware(options);
  const {update=id, el, setup, draw} = xoptions;
  const {preload=[], preloaded=id} = xoptions;

  sketch.state = setup();

  if (preload.length) {
    loadImages(preload)
      .then(images => sketch.state = preloaded(sketch.state, images));    
  }

  // Bind event listeners
  for (let event of EVENTS) {
    const handler = xoptions[event];
    if (handler) {
      el.addEventListener(event, e => {
        sketch.state = handler(sketch.state, e);
      });
    }
  }

  for (let event of WINDOW_EVENTS) {
    const handler = xoptions[event];
    if (handler) {
      window.addEventListener(event, e => {
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
exports.rgba = rgba$1;
exports.hsla = hsla$1;
exports.vec2d = vec2d;
exports.sketch = sketch;

return exports;

}({}));
