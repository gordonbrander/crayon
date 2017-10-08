import {rangef} from './utils'

const ORIGIN = Object.freeze([0 , 0])

export const gridPos = (n, width, height, cols, rows, origin=ORIGIN) => {
  n = Math.max(n, 1)
  cols = Math.max(1, cols)
  rows = Math.max(1, rows)
  width = Math.abs(width)
  height = Math.abs(height)
  const [ox, oy] = origin
  const uw = width / cols
  const uh = height / rows
  const ncol = n % cols
  const nrow = Math.ceil(n / cols)

  return [
    ((ncol * uw) + (uw / 2)) - (width / 2) + ox,
    ((nrow * uh) - (uh / 2)) - (height / 2) - oy
  ]
}

// TODO
// export const snapToGrid = (pos, width, height, cols, rows) => {}

// Returns an array of vec2d arrays.
export const grid = (shape, width, height, cols, rows, origin=ORIGIN) => {
  const f = n => gridPos(n, width, height, cols, rows, origin)
  return rangef(f, 1, cols * rows)
}