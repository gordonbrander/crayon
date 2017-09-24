import {transformCartesian} from './draw'
import {DEVICE_PIXEL_RATIO} from './utils'

// Cast to px string
const px = n => n + 'px'

export const canvas = (canvasEl, width, height) => {
  const canvasWidth = width * DEVICE_PIXEL_RATIO
  const canvasHeight = height * DEVICE_PIXEL_RATIO
  canvasEl.width = canvasWidth
  canvasEl.height = canvasHeight
  canvasEl.style.width = px(width)
  canvasEl.style.height = px(height)
  const ctx = canvasEl.getContext('2d')
  transformCartesian(ctx, canvasWidth, canvasHeight, DEVICE_PIXEL_RATIO)
  return ctx
}

// Read a mouse or other event with client rect coords as cartesian
// coords.
export const readEventCartesian = (event, canvasEl, scalingFactor) => [
  event.clientX - ((canvasEl.width / scalingFactor) / 2),
  -1 * (event.clientY - ((canvasEl.height / scalingFactor) / 2))
]