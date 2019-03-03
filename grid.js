export const grid = (width, height, cols, rows, x=0, y=0) => {
  const points = []
  const colWidth = width / cols
  const colHeight = height / rows
  for (let i = 0; i < (cols * rows); i++) {
    const colN = i % cols
    const rowN = Math.floor(i / cols)
    points.push([
      (colN * colWidth) + x,
      (rowN * colHeight) + y
    ])
  }
  return points
}