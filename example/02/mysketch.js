const canvasEl = document.querySelector('#canvas')
const width = window.innerWidth
const height = window.innerHeight
const merge = CRAY.utils.merge
const context = CRAY.dom.canvas(canvasEl, width, height)
const renderstate = {context, width, height}
const render = CRAY.shape.renderer(renderstate)

const ellipseSize = [100, 100]

const sketch = CRAY.sketch.init({
  el: canvasEl,

  setup: () => CRAY.utils.interpolate(1, 0, 0.05).map(n => ({
    type: 'ellipse',
    coords: [n * 70, n * 70],
    size: ellipseSize,
    fill: CRAY.color.hsla(0, 0, n, 0.1)
  })),

  draw: state => {
    CRAY.shape.renderShape(renderstate, {type: 'clear'})
    render(state)
  }
})