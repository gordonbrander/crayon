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
import * as draw from './draw.js'
import {circ, isSame, add} from './vec2d.js'
import {set} from './utils.js'
import {isTransparent, toCSS} from './color.js'
import {hsla, TRANSPARENT} from './hsla.js'

const ORIGIN = Object.freeze([0 , 0])
const ACTUAL_SIZE = Object.freeze([1, 1])

export const getPos = shape => shape.pos
export const setPos = (shape, vec2d) => set(shape, 'pos', vec2d)

export const getSize = shape => shape.size
export const setSize = (shape, vec2d) => set(shape, 'size', vec2d)

// Define a bezier point.
// `pos` defines the position of the point.
// `ctl` defines the control point.
export const bpoint = (pos, ctl) => ({
  type: 'bpoint',
  pos, ctl
})

export const ellipse = (pos, raidus, fill=TRANSPARENT, stroke=TRANSPARENT, strokeWidth=1) => ({
  type: 'ellipse',
  pos, radius, fill, stroke, strokeWidth
})

export const triangle = (pos0, pos1, pos2, fill=TRANSPARENT, stroke=TRANSPARENT, strokeWidth=1) => ({
  type: 'triangle',
  pos0, pos1, pos2, fill, stroke, strokeWidth
})

// Construct an equilateral triangle
// Deshugars to an ordinary Triangle shape.
export const eqtri = (pos, radius, fill, stroke, strokeWidth) => triangle(
  circ(pos, radius, 0),
  circ(pos, radius, 120),
  circ(pos, radius, -120),
  fill, stroke, strokeWidth
)

const wrapTransform = render => (context, shape) => {
  const {scaleRatio=1, canvas: {width, height}} = context
  const {translate=ORIGIN, scale=ACTUAL_SIZE, skew=ORIGIN, rotate=0} = shape
  const [translateX, translateY] = translate
  const [scaleX, scaleY] = scale
  const [skewX, skewY] = skew
  // context.save()
  // Sets transform while retaining cartesian coords
  context.setTransform(
    scaleX * scaleRatio,
    skewX,
    skewY,
    (scaleY * scaleRatio),
    translateX + (width / 2),
    translateY + (height / 2)
  )
  if (rotate > 0 || rotate < 0) {
    context.rotate(rotate)
  }
  render(context, shape)
  // context.restore()
}

export const renderTransform = wrapTransform((context, shape) =>
  renderShape(context, shape.shape))

export const renderGroup = wrapTransform((context, shape) =>
  renderShapes(context, shape.shapes))

// Invoke fill if color is not transparent.
const renderFill = (context, shape) => {
  const {fill=TRANSPARENT} = shape
  if (!isTransparent(fill)) {
    draw.fill(context, toCSS(fill))
  }
}

// Invoke stroke if color is not transparent.
const renderStroke = (context, shape) => {
  const {stroke=TRANSPARENT, strokeWidth=1} = shape
  if (!isTransparent(stroke)) {
    draw.stroke(context, toCSS(stroke), strokeWidth)
  }
}

export const renderEllipse = (context, shape) => {
  const {pos: [x, y]} = shape
  const {radius: [radiusX, radiusY]} = shape
  draw.ellipse(context, x, y, radiusX, radiusY)
  renderFill(context, shape)
  renderStroke(context, shape)
}

export const renderTriangle = (context, shape) => {
  const {pos0: [x0, y0], pos1: [x1, y1], pos2: [x2, y2]} = shape
  draw.triangle(context, x0, y0, x1, y1, x2, y2)
  renderFill(context, shape)
  renderStroke(context, shape)
}

export const renderRect = (context, shape) => {
  const {pos: [x, y], size: [width, height]} = shape
  draw.rect(context, x, y, width, height)
  renderFill(context, shape)
  renderStroke(context, shape)
}

export const renderQuad = (context, shape) => {
  const {tl: [x0, y0], tr: [x1, y1], br: [x2, y2], bl: [x3, y3]} = shape
  draw.quad(context, x0, y0, x1, y1, x2, y2, x3, y3)
  renderFill(context, shape)
  renderStroke(context, shape)
}

export const renderLine = (context, shape) => {
  const {pos0: [x0, y0], pos1: [x1, y1]} = shape
  draw.line(context, x0, y0, x1, y1)
  renderStroke(context, shape)
}

export const renderArc = (context, shape) => {
  const {pos: [x, y], radius} = shape
  const {startAngle, endAngle, anticlockwise, isClosed=false} = shape
  draw.arc(context, x, y, radius, startAngle, endAngle, anticlockwise, isClosed)
  if (isClosed) {
    renderFill(context, shape)
  }
  renderStroke(context, shape)
}

export const renderBezier = (context, shape) => {
  const {isClosed=false} = shape
  const [x0, y0] = shape.bez0.pos
  const [cx0, cy0] = shape.bez0.ctl
  const [x1, y1] = shape.bez1.pos
  const [cx1, cy1] = shape.bez1.ctl
  draw.bezier(context, cx0, cy0, cx1, cy1, x0, y0, x1, y1, isClosed)
  renderStroke(context, shape)
  if (isClosed) {
    renderFill(context, shape)
  }
}

export const renderPoly = (context, shape) => {
  const {isClosed=false} = shape
  const [p0, ...px] = shape.points
  const [x0, y0] = p0
  context.beginPath()
  context.moveTo(x0, y0)
  for (let [x, y] of px) {
    context.lineTo(x, y)
  }
  if (isClosed) {
    context.closePath()
  }
  renderStroke(context, shape)
  if (isClosed) {
    renderFill(context, shape)
  }
}

export const renderBackground = (context, shape) => {
  const {canvas: {width, height}} = context
  draw.rect(context, 0, 0, width, height, true)
  renderFill(context, shape)
}

export const renderShapes = (context, shapes) => {
  for (let shape of shapes) {
    renderShape(context, shape)
  }
}

// Pass in any shape object and it will be rendered with its backend.
// Shapes that are not recognized will be ignored.
export const renderShape = (context, shape) => {
  const {canvas: {width, height}} = context
  const {type} = shape
  if (type === 'clear') {
    draw.clear(context, 0, 0, width, height)
  } else if (type === 'background') {
    renderBackground(context, shape)
  } else if (type === 'ellipse') {
    renderEllipse(context, shape)
  } else if (type === 'triangle') {
    renderTriangle(context, shape)
  } else if (type === 'rect') {
    renderRect(context, shape)
  } else if (type === 'quad') {
    renderQuad(context, shape)
  } else if (type === 'poly') {
    renderPoly(context, shape)
  } else if (type === 'line') {
    renderLine(context, shape)
  } else if (type === 'arc') {
    renderArc(context, shape)
  } else if (type === 'bezier') {
    renderBezier(context, shape)
  } else if (type === 'group') {
    renderGroup(context, shape)
  } else if (type === 'transform') {
    renderTransform(context, shape)
  } else if (type === 'noop') {
    // Do nothing
  } else {
    console.warn('Unrecognized shape: ' + shape.type)
  }
}