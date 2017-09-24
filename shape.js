/*
A shapelist renderer with groups provides all of the benefits of:

- Method chaining (just put them in an array)
- Serialization (JSON.stringify)
- Scene graph/DOM (declarative)

Additionally, it doesn't care whether you bash it, or copy-on-write.
*/
import * as draw from './draw'

export const renderEllipse = (ctx, shape) => {
  const [x, y] = shape.coords
  const [width, height] = shape.size
  const {fill='black', stroke='transparent', strokeWidth=1} = shape
  draw.fill(ctx, shape.fill)
  draw.stroke(ctx, stroke, strokeWidth)
  draw.ellipse(ctx, x, y, width, height, fill !== 'transparent', stroke !== 'transparent')
}

export const renderShapes = (state, shapes) => {
  for (let shape of shapes) {
    renderShape(state, shape)
  }
}

export const renderShape = (state, shape) => {
  const {context, width, height} = state
  const {type} = shape
  if (type === 'clear') {
    draw.clear(context, 0, 0, width, height)
  } else if (type === 'ellipse') {
    renderEllipse(context, shape)
  }
}

export const renderGroup = (state, group) => {
  // if (group.scale) {
  //   scale(group.scale)
  // }
  // if (group.translate) {
  //   translate(group.translate[0], group.translate[1])
  // }
  // if (group.rotate) {
  //   rotate(group.rotate)
  // }
  renderShapes(state, group.shapes)  
}

export const renderer = state => shapes => renderShapes(state, shapes)