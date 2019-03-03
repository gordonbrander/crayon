import {range, rangef, take} from './utils.js'

export const configure = randomf => {
  // Generate a pseudo-random number between range `min` and `max`.
  const random = (min=0, max=1) => randomf() * (max - min) + min

  // Generate a pseudo-random integer between range `min` and `max`.
  const randomInt = (min=0, max=1) => Math.floor(random(min, max))

  // Choose a random element from an array
  const choice = array =>
    array.length > 0 ? array[randomInt(0, array.length - 1)] : null

  // Shuffle elements in array randomly, returning new array.
  const shuffle = array => {
    const shuffled = array.slice()
    for (var i = 0; i < shuffled.length; i++) {
        const j = randomInt(0, array.length - 1)
        const x = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = x;
    }
    return shuffled;
  }

  const _compareNumbers = (a, b) => a > b ? 1 : -1

  // Sample n random elements from array. Retains original order of
  // elements.
  const sample = (array, n) => {
    const indexes = range(0, array.length - 1)
    const shuffled = shuffle(indexes)
    return take(shuffled, n).sort(_compareNumbers).map(i => array[i])
  }

  // Generate an array of `length` random numbers.
  const nrandom = (length, min=0, max=1) =>
    rangef(0, length, () => random(min, max))

  return {random, randomInt, choice, nrandom, shuffle, sample}
}

const _random = configure(Math.random)

export const {
  random, randomInt, choice, nrandom, shuffle, sample
} = _random