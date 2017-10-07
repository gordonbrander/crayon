Crayon
======

Crayon is my tiny toolkit for 2D canvas. It offers:

- A tiny set of functions for drawing shapes on canvas
- A tiny (optional) scene graph for canvas
- A tiny library for color manipulation
- A tiny 2D vector library
- A tiny collection of common utility functions for creative coding
- A tiny sketch constructor inspired by Processing and Quil

All of these tiny tools are optional. You can pick and choose the ones you want.

TODO:

- A tiny 2D physics library
- Seeded random number generator

Maybe later:

- WebGL backend

Motivation
-----------

There are lots of great canvas libraries with communities and documentation around them. Crayon falls out of my desire to have a library that would be _fun_ for me to write in. These were the things I wanted:

- Easy functions for basic shapes
- No TWO_PI math needed for drawing a circle
- Cartesian coords
- Boilerplate for canvas setup taken care of
- Boilerplate for retina taken care of
- Some handy tools for common creative coding tasks... seeded random, vec2d, color, etc
- Quil-style "fun mode" sketches
- Build higher-level abstractions on top middleware and data manipulation

My taste:

- Simple and nothing magical.
- Solve drudge work with simple functions.
- Avoid wrapping basic tools in fancy classes, where possible.
- A library, not a framework.
- Let's use all those nice ES6 sugars.