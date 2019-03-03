/* Simple 2D vector math with arrays. Just the basics. */
import {setter} from './utils'
import {radToDeg, degToRad, round, lerp as lerpn} from './math'

const PRECISION = 100000000

// Check for value equality between two vec2d arrays.
export const isSame = ([x0, y0], [x1, y1]) =>
  x0 === x1 && y0 === y1

export const getX = ([x, y]) => x
export const setX = setter(getX, ([x, y], n) => [n, y])

export const getY = ([x, y]) => y
export const setY = setter(getY, ([x, y], n) => [x, n])

// Update x and y fields in a vec2d.
// Returns a new vector if this would actually change anything.
export const setXY = (v, x, y) => v.x !== x || v.y !== y ? [x, y] : v

// Mutate add
const add_ = (v, [x1, y1]) => {
  v[0] = v[0] + x1
  v[1] = v[1] + y1
}

export const add = ([x0, y0], [x1, y1]) => [x0 + x1, y0 + y1]
export const sub = ([x0, y0], [x1, y1]) => [x0 - x1, y0 - y1]
export const mult = ([x, y], scalar) => [x * scalar, y * scalar]
export const scale = mult
// Return the inverse of a vector
export const inv = v => mult(v, -1)
export const multX = ([x, y], scalar) => [x * scalar, y]
export const multY = ([x, y], scalar) => [x, y * scalar]
export const div = ([x, y], scalar) => [x / scalar, y / scalar]

export const distSq = ([x0, y0], [x1, y1]) => {
  const dx = x0 - x1
  const dy = y0 - y1
  return (dx * dx) + (dy * dy)
}

// Calculate the euclidian disance between two vectors
export const dist = (a, b) => Math.sqrt(distSq(a, b))

// Linear interpolation between two vec2Ds
export const lerp = ([x0, y0], [x1, y1], scalar) => [
  lerpn(x0, x1, scalar),
  lerpn(y0, y1, scalar)
]

export const magSq = ([x, y]) => (x * x) + (y * y)

// Calculate the length/magnitude of a vector
export const mag = v => Math.sqrt(magSq(v))

export const dot = ([x0, y0], [x1, y1]) => (x0 * x1) + (y0 * y1)

export const norm = v => div(v, mag(v))

export const rotation = ([x, y]) => radToDeg(Math.atan2(y, x))

// Calculate points along a circle.
// `[x, y]` defines the origin of the circle.
// `radius` defines the circle.
// `deg` defines the angle of rotation in degrees.
export const circ = ([x, y], radius, deg) => {
  const rad = degToRad(deg)
  return [
    round(x + radius * Math.cos(rad), PRECISION),
    round(y + radius * Math.sin(rad), PRECISION)
  ]
}

// Calculate the centroid (center point) of a polygon
// (as an array of array vec2d points).
// Note this is the centerpoint by shape, not the centerpoint by mass.
// https://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon
export const centroid = points =>
  mult(points.reduce(add_, [0, 0]), 1 / points.length)


// Rotate an array of vec2d points along their center axis.
// export const rotate = (points, deg) => {
//   const c = centroid(points)
//   // FIXME this isn't right because I need to figure out current angle
//   // of rotation.
//   return points.map(v => circ(c, dist(c, v), deg))
// }

// Calculate the slope of a line between two points.
// https://math.stackexchange.com/questions/707673/find-angle-in-degrees-from-one-point-to-another-in-2d-space
export const slope = ([x0, y0], [x1, y1]) => (y1 - y0) / (x1 - x0)

// Generate an array of `length` random vectors between `min` and `max`.
export const nrandom = (length, min=0, max=1) =>
  rangef(0, length, () => [random(min, max), random(min, max)])

// TODO boundingBox
// TODO origin