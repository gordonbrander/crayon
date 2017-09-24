const canvasEl = document.querySelector('#canvas')
const width = window.innerWidth
const height = window.innerHeight
const merge = CRAY.utils.merge
const context = CRAY.dom.canvas(canvasEl, width, height)
const render = CRAY.shape.renderer({context, width, height})

CRAY.sketch.init({
  el: canvasEl,

  setup: () => ({
    isMouseDown: false,
    points: []
  }),

  mousedown: (state, e) => merge(state, {
    isMouseDown: true
  }),

  mouseup: (state, e) => merge(state, {
    isMouseDown: false
  }),

  mousemove: (state, e)=> {
    const coords = CRAY.dom.readEventCartesian(event, canvasEl, CRAY.utils.DEVICE_PIXEL_RATIO)
    const {points} = state
    return merge(state, {
      points: [...points, {coords, size: 10}]
    })
  },

  update: state => merge(state, {
    points: state.points
      .map(point => ({coords: point.coords, size: point.size - 0.1}))
      .filter(point => point.size > 0)
  }),

  draw: state => {
    const shapes = state.points.map(point => ({
      type: 'ellipse',
      coords: point.coords,
      size: [point.size, point.size],
      fill: 'black',
      stroke: 'transparent'
    }))

    render([
      {type: 'clear'},
      ...shapes
    ])
  }
})