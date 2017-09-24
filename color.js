/*
Utilities for writing CSS color values
https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
*/
export const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`
export const rgb = (r, g, b) => `rgb(${r}, ${g}, ${b})`
export const hsla = (h, s, l, a) => `hsla(${h}, ${s * 100}%, ${l * 100}%, ${a})`
export const hsl = (h, s, l) => `hsl(${h}, ${s * 100}%, ${l * 100}%)`