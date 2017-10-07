import {DEVICE_PIXEL_RATIO} from './utils'
import {TWO_PI} from './math'

export const ROUND = 'round'
export const BEVEL = 'bevel'
export const MITER = 'miter'
export const BUTT = 'butt'
export const SQUARE = 'square'

export const stroke = (context, strokeColor, strokeWidth=1, cap='butt', join='miter') => {
  context.strokeStyle = strokeColor
  context.lineWidth = strokeWidth
  context.lineCap = cap
  context.lineJoin = join
  context.stroke()
}

export const dashStroke = (context, segments, dashOffset=0, strokeColor, strokeWidth=1, cap='butt', join='miter') => {
  context.strokeStyle = strokeColor
  context.lineWidth = strokeWidth
  context.lineCap = cap
  context.lineJoin = join
  context.setLineDash(segments)
  context.lineDashOffset = dashOffset
  context.stroke()
}

export const fill = (context, fillColor) => {
  context.fillStyle = fillColor
  context.fill()
}

export const ellipse = (context, x, y, radiusX, radiusY) => {
  context.beginPath()
  context.ellipse(x, y, radiusX, radiusY, 0, 0, TWO_PI)
}

export const triangle = (context, x0, y0, x1, y1, x2, y2) => {
  context.beginPath()
  context.moveTo(x0, y0)
  context.lineTo(x1, y1)
  context.lineTo(x2, y2)
  context.closePath()
}

export const quad = (context, x0, y0, x1, y1, x2, y2, x3, y3) => {
  context.beginPath()
  context.moveTo(x0, y0)
  context.lineTo(x1, y1)
  context.lineTo(x2, y2)
  context.lineTo(x3, y3)
  context.closePath()
}

export const rect = (context, x, y, width, height) => {
  // Draw rect from center, not top left
  context.beginPath()
  context.rect(x - (width / 2), y - (height / 2), width, height)
}

export const fivegon = (context, x0, y0, x1, y1, x2, y2, x3, y3, x4, y4) => {
  context.beginPath()
  context.moveTo(x0, y0)
  context.lineTo(x1, y1)
  context.lineTo(x2, y2)
  context.lineTo(x3, y3)
  context.lineTo(x4, y4)
  context.closePath()
}

export const sixgon = (context, x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5) => {
  context.beginPath()
  context.moveTo(x0, y0)
  context.lineTo(x1, y1)
  context.lineTo(x2, y2)
  context.lineTo(x3, y3)
  context.lineTo(x4, y4)
  context.lineTo(x5, y5)
  context.closePath()
}

export const line = (context, x0, y0, x1, y1) => {
  context.beginPath()
  context.moveTo(x0, y0)
  context.lineTo(x1, y1)
}

export const bezier = (context, cpx0, cpy0, cpx1, cpy1, x0, y0, x1, y1, isClosed=false) => {
  context.beginPath()
  context.moveTo(x0, y0)
  context.bezierCurveTo(cpx0, cpy0, cpx1, cpy1, x1, y1)
  if (isClosed) {
    context.closePath()
  }
}

export const arc = (context, x, y, radius, startAngle, endAngle, anticlockwise, isClosed=false) => {
  context.beginPath()
  context.arc(x, y, radius, startAngle, endAngle, anticlockwise)
  if (isClosed) {
    context.closePath()
  }
}

export const clear = (context, x, y, width, height) => {
  context.clearRect(x - (width / 2), y - (height / 2), width, height)
}

export const image = (context, img, x, y) => {
  const width = img.naturalWidth
  const height = img.naturalHeight
  // Draw rect from center, not top left
  context.drawImage(img, x - (width / 2), y - (height / 2))
}

// Convert to cartesian coords so that origin (0, 0) is at center.
// An elegant coordinate system for a more civilized age.
// Additionally, you can provide a scalingFactor to compensate for
// retina displays.
// See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform.
export const transformCartesian = (context, width, height, scalingFactor) => {
  context.setTransform(
    1 * scalingFactor,
    0,
    0,
    -1 * scalingFactor,
    (width / 2),
    (height / 2)
  )
}