import {DEVICE_PIXEL_RATIO, TWO_PI} from './utils'

export const ROUND = 'round'
export const BEVEL = 'bevel'
export const MITER = 'miter'
export const BUTT = 'butt'
export const SQUARE = 'square'

export const stroke = (ctx, strokeColor, strokeWidth=1, dashOffset=0, cap='butt', join='miter') => {
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = strokeWidth
  ctx.lineDashOffset = dashOffset
  ctx.lineJoin = join
}

export const fill = (ctx, fillColor) => {
  if (fillColor !== 'transparent') {
    ctx.fillStyle = fillColor
  }
}

export const shadow = (ctx, offsetX, offsetY, blur=5, shadowColor='black') => {
  ctx.shadowColor = shadowColor
  ctx.shadowOffsetX = offsetX
  ctx.shadowOffsetY = offsetY
  ctx.shadowBlur = blur
}

export const style = (ctx, hasFill, hasStroke) => {
  if (hasFill) {
    ctx.fill()
  }
  if (hasStroke) {
    ctx.stroke()
  }
}

export const rect = (ctx, x, y, width, height, hasFill=true, hasStroke=false) => {
  // Draw rect from center, not top left
  ctx.rect(x - (width / 2), y - (height / 2), width, height)
  style(ctx, hasFill, hasStroke)
}

export const ellipse = (ctx, x, y, radiusX, radiusY, hasFill=true, hasStroke=false) => {
  ctx.beginPath()
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, TWO_PI)
  style(ctx, hasFill, hasStroke)
}

export const triangle = (ctx, x0, y0, x1, y1, x2, y2, hasFill=true, hasStroke=false) => {
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.closePath()
  style(ctx, hasFill, hasStroke)
}

export const quad = (ctx, x0, y0, x1, y1, x2, y2, x3, y3, hasFill=true, hasStroke=false) => {
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineTo(x3, y3)
  ctx.closePath()
  style(ctx, hasFill, hasStroke)
}

export const line = (ctx, x0, y0, x1, y1, hasStroke=true) => {
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  style(ctx, false, hasStroke)
}

export const arc = (ctx, x, y, radius, startAngle, endAngle, anticlockwise, hasStroke=true) => {
  ctx.beginPath()
  ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
  style(ctx, false, hasStroke)
}

export const clear = (ctx, x, y, width, height) => {
  ctx.clearRect(x - (width / 2), y - (height / 2), width, height)
}

// Convert to cartesian coords so that origin (0, 0) is at center.
// An elegant coordinate system for a more civilized age.
// Additionally, you can provide a scalingFactor to compensate for
// retina displays.
// See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform.
export const transformCartesian = (ctx, width, height, scalingFactor) => {
  ctx.setTransform(
    1 * scalingFactor,
    0,
    0,
    -1 * scalingFactor,
    (width / 2),
    (height / 2)
  )
}