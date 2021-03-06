export const copy = o => Object.assign({}, o)

// Merge 2 objects together, creating a new object.
// Properties of `b` win any collision.
export const merge = (a, b) => Object.assign({}, a, b)

const _set = (o, k, v) => {
  const copy = Object.assign({}, o)
  copy[k] = v
  return copy
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

export const rangef = (f, begin, end, step=1) => {
  const numbers = []
  // Make sure step is a positive number.
  step = Math.abs(step)
  if (begin < end) {
    for (let i = begin; i <= end; i = i + step) {
      numbers.push(f(i))
    }
  } else {
    for (let i = begin; i >= end; i = i - step) {
      numbers.push(f(i))
    }
  }
  return numbers
}

// Generate a list of numbers, from `begin` to `end`, counting by `step`.
// `begin` and `end` are inclusive.
export const range = (begin, end, step=1) => rangef(id, begin, end, step)

export const take = (array, n) => {
  const taken = []
  const length = Math.min(n + 1, array.length)
  for (let i = 0; i < length; i++) {
    taken.push(array[i])
  }
  return taken
}