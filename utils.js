export const TWO_PI = 2 * Math.PI
export {TWO_PI as TAU}
export const HALF_PI = Math.PI / 2
export const QUARTER_PI = Math.PI / 4

export const DEVICE_PIXEL_RATIO = (
    'devicePixelRatio' in window
  ? window.devicePixelRatio
  : 1
)

export const copy = o => Object.assign({}, o)

// Merge 2 objects together, creating a new object.
// Properties of `b` win any collision.
export const merge = (a, b) => Object.assign({}, a, b)

const _set = (o, k, v) => {
  const copy = Object.assign({}, o)
  o[k] = v
  return o
}

// Set value of a field on an object.
// This function is copy-on-write. It only returns new object if value
// has actually changed.
export const set = (o, k, v) => o[k] !== v ? _set(o, k, v) : o

export const id = x => x

// Create a setter function that will only invoke `set` if new
// `value` is different from old value as read by `get`.
// This can be used to create setters for specific fields, or
// even a setter for fields deep within a structure.
export const setter = (get, set) => (outer, value) =>
  get(outer) === value ? outer : set(outer, value)

// Create a function that can get and set a property within a data structure,
// returning a new version of that data structure if the property has changed.
export const cursor = (get, set, update) => (outer, value) =>
  set(outer, update(get(outer), value))

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
export const ratio = (n, begin, end) => n / (end - begin)

// Multiply a number. It's useful to have a functional form of this operation
// for cursors and stuff.
export const scale = (n, x) => n * x

// Re-scale a number — project it from one scale to another.
// `isBounded` will constraint the result to the range.
export const rescale = (n0, a0, b0, a1, b1, isBounded=false) => {
  const n1 = (b1 - a1) * ratio(n0, a0, b0)
  return isBounded ? clamp(n1, a1, b1) : n1
}

export const fmod = (float, n) => {
  const int = Math.floor(float)
  return int % n + float - int
}

export const lerp = (a, b, scalar) => ((b - a) * scalar) + a

// Clamp a 360 degree value. Negative degrees rotate the other direction.
export const degrees = n => (360 + n) % 360

// Convert radians to degrees
export const radToDeg = rad => rad * (180 / Math.PI)

// Convert degrees to radians
export const degToRad = deg => degrees(deg) * (Math.PI / 180)

// Round to nearest x.
// Factor is typically a multiple of 10.
export const round = (n, factor=1) => Math.round(n * factor) / factor

export const rangef = (f, begin, end, step=1, extra) => {
  const numbers = []
  // Make sure step is a positive number.
  step = Math.abs(step)
  if (begin < end) {
    for (let i = begin; i <= end; i = i + step) {
      numbers.push(f(i, extra))
    }
  } else {
    for (let i = begin; i >= end; i = i - step) {
      numbers.push(f(i, extra))
    }
  }
  return numbers
}

// Generate a list of numbers, from `begin` to `end`, counting by `step`.
// `begin` and `end` are inclusive.
export const range = (begin, end, step=1) => rangef(id, begin, end, step)

// Generate a pseudo-random number between range `min` and `max`.
export const random = (min=0, max=1) => Math.random() * (max - min) + min

// Generate a pseudo-random integer between range `min` and `max`.
export const randomInt = (min=0, max=1) => Math.floor(random(min, max))

// Choose a random element from an array
export const choice = array =>
  array.length > 0 ? array[randomIntBetween(0, array.length)] : null

// Generate an array of `length` random numbers.
export const nrandom = (length, min=0, max=1) =>
  rangef(0, length, () => random(min, max))