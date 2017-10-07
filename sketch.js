import {id} from './utils'

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
]

const WINDOW_EVENTS = [
  'keydown',
  'keyup',
  'keypress'
]

export const init = options => {
  const sketch = {}
  const {middleware=id} = options
  const xoptions = middleware(options)
  const {update=id, el, setup, draw} = xoptions
  const {preload=[], preloaded=id} = xoptions

  sketch.state = setup()

  if (preload.length) {
    loadImages(preload)
      .then(images => sketch.state = preloaded(sketch.state, images))    
  }

  // Bind event listeners
  for (let event of EVENTS) {
    const handler = xoptions[event]
    if (handler) {
      el.addEventListener(event, e => {
        sketch.state = handler(sketch.state, e)
      })
    }
  }

  for (let event of WINDOW_EVENTS) {
    const handler = xoptions[event]
    if (handler) {
      window.addEventListener(event, e => {
        sketch.state = handler(sketch.state, e)
      })
    }
  }

  const tick = () => {
    sketch.state = update(sketch.state)
    draw(sketch.state)
    requestAnimationFrame(tick)
  }
  tick()

  return sketch
}