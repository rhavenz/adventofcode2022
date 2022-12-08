const input = await Deno.readTextFile("./input");

const grid = input
  .split("\n")
  .reduce<Array<number[]>>(
    (prev, curr) => prev.concat([curr.split("").map(Number)]),
    []
  );

const isVisibleFromLeft = (rowIdx: number, columnIdx: number) => {
  const threeHeight = grid[rowIdx][columnIdx];
  const subRow = grid[rowIdx].slice(0, columnIdx);

  return subRow.every((threeHeight_) => threeHeight_ < threeHeight);
};

const isVisibleFromRight = (rowIdx: number, columnIdx: number) => {
  const threeHeight = grid[rowIdx][columnIdx];
  const subRow = grid[rowIdx].slice(columnIdx + 1);

  return subRow.every((threeHeight_) => threeHeight_ < threeHeight);
};

const isVisibleFromTop = (rowIdx: number, columnIdx: number) => {
  const threeHeight = grid[rowIdx][columnIdx];

  const subCol = [];
  for (let rowIdx_ = 0; rowIdx_ < rowIdx; rowIdx_++) {
    subCol.push(grid[rowIdx_][columnIdx]);
  }

  return subCol.every((threeHeight_) => threeHeight_ < threeHeight);
};

const isVisibleFromBottom = (rowIdx: number, columnIdx: number) => {
  const threeHeight = grid[rowIdx][columnIdx];

  const subCol = [];
  for (let rowIdx_ = rowIdx + 1; rowIdx_ < grid.length; rowIdx_++) {
    subCol.push(grid[rowIdx_][columnIdx]);
  }

  return subCol.every((threeHeight_) => threeHeight_ < threeHeight);
};

const result1 = grid.reduce((curr, row, idx) => {
  const result_ = row.reduce((curr_, _, idx_) => {
    return (
      curr_ +
      ([
        isVisibleFromTop,
        isVisibleFromRight,
        isVisibleFromBottom,
        isVisibleFromLeft,
      ].some((fn) => fn(idx, idx_))
        ? 1
        : 0)
    );
  }, 0);

  return curr + result_;
}, 0);

console.log(result1);

// * part2

const scoreLeft = (rowIdx: number, columnIdx: number) => {
  const threeHeight = grid[rowIdx][columnIdx];
  const subRow = grid[rowIdx].slice(0, columnIdx).reverse();
  const idx = subRow.findIndex((threeHeight_) => threeHeight_ >= threeHeight);

  return subRow.slice(0, idx === -1 ? undefined : idx + 1).length;
};

const scoreRight = (rowIdx: number, columnIdx: number) => {
  const threeHeight = grid[rowIdx][columnIdx];
  const subRow = grid[rowIdx].slice(columnIdx + 1);
  const idx = subRow.findIndex((threeHeight_) => threeHeight_ >= threeHeight);

  return subRow.slice(0, idx === -1 ? undefined : idx + 1).length;
};

const scoreTop = (rowIdx: number, columnIdx: number) => {
  const threeHeight = grid[rowIdx][columnIdx];

  const subCol = [];
  for (let rowIdx_ = 0; rowIdx_ < rowIdx; rowIdx_++) {
    subCol.push(grid[rowIdx_][columnIdx]);
  }

  subCol.reverse();

  const idx = subCol.findIndex((threeHeight_) => threeHeight_ >= threeHeight);

  return [...subCol].slice(0, idx === -1 ? undefined : idx + 1).length;
};

const scoreBottom = (rowIdx: number, columnIdx: number) => {
  const threeHeight = grid[rowIdx][columnIdx];

  const subCol = [];
  for (let rowIdx_ = rowIdx + 1; rowIdx_ < grid.length; rowIdx_++) {
    subCol.push(grid[rowIdx_][columnIdx]);
  }

  const idx = subCol.findIndex((threeHeight_) => threeHeight_ >= threeHeight);

  return subCol.slice(0, idx === -1 ? undefined : idx + 1).length;
};

const result2 = grid.map((row, idx) => {
  const result_ = row.map((_, idx_) =>
    [scoreTop, scoreRight, scoreBottom, scoreLeft]
      .map((fn) => fn(idx, idx_))
      .reduce((a, b) => a * b)
  );

  return result_;
}, 0);

console.log(Math.max(...result2.flat()));
