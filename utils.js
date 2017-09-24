export const TWO_PI = 2 * Math.PI
export {TWO_PI as TAU}
export const HALF_PI = Math.PI / 2
export const QUARTER_PI = Math.PI / 4

export const DEVICE_PIXEL_RATIO = (
    'devicePixelRatio' in window
  ? window.devicePixelRatio
  : 1
)

export const merge = (object, patch) => Object.assign({}, object, patch)

export const id = x => x

export const randomBetween = (min, max) => Math.random() * (max - min) + min

// Generate a list of numbers, from `begin` to `end`, counting by `step`.
// `begin` and `end` are inclusive.
export const interpolate = (begin, end, step=1) => {
  const numbers = []
  // Make sure step is a positive number.
  step = Math.abs(step)
  if (begin < end) {
    for (let i = begin; i <= end; i = i + step) {
      numbers.push(i)
    }
  } else {
    for (let i = begin; i >= end; i = i - step) {
      numbers.push(i)
    }
  }
  return numbers
}