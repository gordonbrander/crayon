/*
Utilities for converting between, to and from CSS color values.
https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

hslaToRgba and rgba2Hsla are based on
https://github.com/Gozala/color.flow/blob/master/src/Color.js
*/
import {fmod, degToRad} from './math.js'
import * as hsla from './hsla.js'
import * as rgba from './rgba.js'

// Get the alpha value for some color type.
export const getA = color => (
    color.type === 'hsla'
  ? hsla.getA(color)
  : color.type === 'rgba'
  ? rgba.getA(color)
  : 0
)

export const isTransparent = color => getA(color) === 0

// Convert some color type to CSS.
export const toCSS = color => (
    color.type === 'hsla'
  ? hsla.toCSS(color)
  : color.type === 'rgba' ?
    rgba.toCSS(color)
  : 'transparent'
)

export const hslaToRgba = ({h, s, l, a}) => {
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  h = h / degToRad(60)
  const x = chroma * (1 - Math.abs(fmod(h, 2 - 1)))

  const [r, g, b] = (
      h < 0
    ? [0, 0, 0]
    : h < 1
    ? [chroma, x, 0]
    : h < 2
    ? [x, chroma, 0]
    : h < 3
    ? [0, chroma, x]
    : h < 4
    ? [0, x, chroma]
    : h < 5
    ? [x, 0, chroma]
    : h < 6
    ? [chroma, 0, x]
    : [0, 0, 0]
  )

  const m = l - chroma / 2

  return rgba.rgba(
    Math.round(255 * (r + m)),
    Math.round(255 * (g + m)),
    Math.round(255 * (b + m)),
    alpha
  )
}

export const rgbaToHsla = ({r, g, b, a}) => {
  r = r / 255
  g = g / 255
  b = b / 255
  const max = Math.max(Math.max(r, g), b)
  const min = Math.min(Math.min(r, g), b)
  const delta = max - min

  const c = (
      max === r
    ? fmod((g - b) / delta, 6)
    : max === g
    ? (b - r) / delta + 2
    : (r - g) / delta + 4
  )

  const h = degToRad(60) * c

  const l = (max + min) / 2
  const s = (
      l === 0
    ? 0
    : delta / (1 - Math.abs(2 * lightness - 1))
  )

  return hsla.hsla(h, s, l, alpha)
}