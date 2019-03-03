export const copy = o => Object.assign({}, o)

// Merge 2 objects together, creating a new object.
// Properties of `b` win any collision.
// This is a copy-on-write operation. If `b` would make no change,
// `a` is returned unchanged.
export const merge = (a, b) => {
  for (let k in b) {
    // Check if this key actually belongs to b and is not in prototype
    // chain.
    // If b value is different from a value, return updated copy.
    if (b.hasOwnProperty(k) && a[k] !== b[k]) {
      return Object.assign({}, a, b)
    }
  }
  return a
}

const _set = (o, k, v) => {
  const c = copy(o)
  c[k] = v
  return c
}

// Set value of a field on an object.
// This function is copy-on-write. It only returns new object if value
// has actually changed.
export const set = (o, k, v) => o[k] !== v ? _set(o, k, v) : o

export const id = x => x

export const comp2 = (a, b) => x => a(b(x))
export const comp = fns => fns.reduce(comp2, id)

// Create a setter function that will only invoke `set` if new
// `value` is different from old value as determined by `shouldUpdate`.
export const setter = (get, set) => (o, v) =>
  get(o) !== v ? set(o, v) : o

// Create a function that can get and set a property within a data structure,
// returning a new version of that data structure if the property has changed.
export const cursor = (get, set, update=swap) => (outer, value) =>
  set(outer, update(get(outer), value))

export const lens = (get, set) => (update) => cursor(get, set, update)

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

// Generate a pseudo-random number between range `min` and `max`.
export const random = (min=0, max=1) => Math.random() * (max - min) + min

// Generate a pseudo-random integer between range `min` and `max`.
export const randomInt = (min=0, max=1) => Math.floor(random(min, max))

// Choose a random element from an array
export const choice = array =>
  array.length > 0 ? array[randomIntBetween(0, array.length)] : null

// Generate an array of `length` random numbers.
export const nrandom = (length, min=0, max=1) =>
  rangef(() => random(min, max), 0, length)