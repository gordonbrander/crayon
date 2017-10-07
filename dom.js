import {transformCartesian} from './draw'
import {DEVICE_PIXEL_RATIO} from './utils'

export const setupCanvas2D = options => {
  const {canvas, width, height, scaleRatio=DEVICE_PIXEL_RATIO} = options
  const {smooth=true} = options
  const canvasWidth = width * scaleRatio
  const canvasHeight = height * scaleRatio
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = smooth
  // Assign scaleRatio to context so we have it for calculations later.
  context.scaleRatio = scaleRatio
  return context
}

// Given a set of options, configures a canvas element
// for 2D cartesian space.
// Returns a context object containing canvas 2D context
export const setupCartesianCanvas = options => {
  const context = setupCanvas2D(options)
  // Transform canvas coords to make them cartesian
  transformCartesian(
    context,
    context.canvas.width,
    context.canvas.height,
    context.scaleRatio
  )
  return context
}

// Read a mouse or other event with client rect coords as cartesian
// coords.
export const readEventCartesian = (event, {canvas, scaleRatio}) => [
  event.clientX - ((canvas.width / scaleRatio) / 2),
  (event.clientY - ((canvas.height / scaleRatio) / 2))
]

const IMG_EVENT_OPTIONS = {once: true, capture: false}

// Load an image from a given `src`.
// Returns a promise for the image.
export const loadImage = src => {
  return new Promise((resolve, reject) => {
    var img = new Image(); // Create new img element
    img.addEventListener('load', e => resolve(img), IMG_EVENT_OPTIONS)
    // Set source path
    img.src = 'myImage.png'
  })
}

export const loadImages = (srcs) => Promise.all(srcs.map(loadImage))