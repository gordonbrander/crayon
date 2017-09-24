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
  'keydown',
  'keyup',
  'keypress',
  'wheel',
  'devicemotion',
  'deviceorientation',
  'orientationchange'
]

export const init = options => {
  const sketch = {}
  const {middleware=id} = options
  const xoptions = middleware(options)
  const {update=id, el, setup, draw} = xoptions

  sketch.state = setup()

  // Bind event listeners
  for (let event of EVENTS) {
    const handler = xoptions[event]
    if (handler) {
      el.addEventListener(event, e => {
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