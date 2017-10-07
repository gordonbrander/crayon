export const TWO_PI = 2 * Math.PI
export {TWO_PI as TAU}
export const HALF_PI = Math.PI / 2
export const QUARTER_PI = Math.PI / 4

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
export const ratio = (n, begin, end) => n / (end - begin)

// Multiply a number. It's useful to have a functional form of this operation
// for cursors and stuff.
export const mult = (n, x) => n * x

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