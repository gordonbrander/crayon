/*
Basic tools for working with rgba colors.

Note that because hsla is much easier to work with, all the color tools
are in the hsla library. You typically want to convert rgba values to
hsla to do things like shift hue, lighten, etc.
*/
import {rescale, clamp} from './utils'

// Rescale a number in range 0..1 to a number in range 0..255
// Scaled number is clamped (can't go beyond range).
// Scaled number is also rounded.
const scale255 = ratio => Math.round(rescale(ratio, 0, 1, 0, 255, true))

export const rgba = (r=0, g=0, b=0, a=1) => ({
  type: 'rgba',
  r: scale255(r),
  g: scale255(g),
  b: scale255(b),
  a: clamp(a, 0, 1)
})

export const toCSS = ({r, g, b, a}) =>
  `rgba(${scale255(r)}, ${scale255(g)}, ${scale255(b)}, ${clamp(a, 0, 1)})`

export const getA = rgba => rgba.a