import {cursor, setter} from './utils.js'
import {clamp, mult, lerp as lerpn} from './math.js'

// Create an hsla color object.
// Validates inputs and makes sure the result is a valid color.
export const hsla = (h=0, s=0, l=0, a=1) => ({
  type: 'hsla',
  h: h % 360,
  s: clamp(s, 0, 1),
  l: clamp(l, 0, 1),
  a: clamp(a, 0, 1)
})

// Just an alias for hsla, with opacity at 1.
export const hsl = (h=0, s=0, l=0) => hsla(h, s, l, 1)

// Define some basic color constants.
export const BLACK = Object.freeze(hsla(0, 0, 0))
export const WHITE = Object.freeze(hsla(0, 0, 1))
export const TRANSPARENT = Object.freeze(hsla(0, 0, 0, 0))

// Define getter, setter for hue.
export const getH = hsla => hsla.h
export const setH = setter(getH, ({s, l, a}, h) => hsla(h, s, l, a))

// Rotate hue along color wheel by `deg`.
//
//     rotateH(color, 0.4)
//
// Returns a new hsla color.
export const rotateH = ({h, s, l, a}, deg) => hsla(h + deg, s, l, a)

// Define getter, setter for saturation.
export const getS = hsla => hsla.s
export const setS = setter(getS, ({h, l, a}, s) => hsla(h, s, l, a))

// Scale saturation. Multiplies current saturation.
//
//     scaleS(color, 0.4)
//
// Returns a new hsla color.
export const scaleS = cursor(getS, setS, mult)

export const getL = hsla => hsla.l
export const setL = setter(getL, ({h, s, a}, l) => hsla(h, s, l, a))
export const scaleL = cursor(getL, setL, mult)

export const getA = hsla => hsla.a
export const setA = setter(getA, ({h, s, l}, a) => hsla(h, s, l, a))
export const scaleA = cursor(getA, setA, mult)

export const greyscale = ({h, s, l, a}) => hsla(0, 0, l, a)

export const toCSS = ({h, s, l, a}) =>
  `hsla(${h}, ${clamp(s, 0, 1) * 100}%, ${clamp(l, 0, 1) * 100}%, ${clamp(a, 0, 1)})`

// Linear interpolation between two colors.
// Finds a point between them as determined by scalar.
export const lerp = (a, b, scalar) => hsla(
  lerpn(a.h, b.h, scalar),
  lerpn(a.s, b.s, scalar),
  lerpn(a.l, b.l, scalar),
  lerpn(a.a, b.a, scalar)
)

// Get the complementary color
export const complement = hsla => rotateH(hsla, 180)

export const triadic = hsla => [hsla, rotateH(hsla, -120), rotateH(hsla, 120)]

export const tetradic = hsla => [
  hsla,
  rotateH(hsla, -90),
  rotateH(hsla, 90),
  rotateH(hsla, 180)
]

// Generate analogous colors. These are colors spread evenly across the color
// wheel.
//
// Spread is the number of degrees (or the width of the slice of the pie)
// that the colors should be sampled from. Narrower means more similar
// analogous colors.
export const analogous = (hsla, spread=180) => {
  const slice = (spread % 360) / 4
  return [
    rotateH(hsla, -2 * slice),
    rotateH(hsla, -1 * slice),
    hsla,
    rotateH(hsla, slice),
    rotateH(hsla, 2 * slice)
  ]
}

// Several shades of the same color
// @TODO s -30, l -20 or -50. Combine in different ways.
export const shades = hsla => [
  scaleL(hsla, 0.4),
  scaleL(hsla, 0.2),
  hsla,
  scaleL(hsla, 1.2),
  scaleL(hsla, 1.4)
]