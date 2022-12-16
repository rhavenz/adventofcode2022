import {
  bgBlack,
  bgRed,
  bgRgb24,
} from "https://deno.land/std@0.123.0/fmt/colors.ts";
import { Color } from "https://deno.land/x/color@v0.2.3/mod.ts";

const input = await Deno.readTextFile("./input");

const elevations = "___abcdefghijklmnopqrstuvwxyz";

const colors = [...elevations].map((_, i, arr) => {
  const value = i / arr.length;
  const h = (1 - value) * 100;
  const s = 100;
  const l = value * 50;

  return Color.hsl(h, s, l);
});

const getCoordinate = (() => {
  const cache: Record<number, { x: number; y: number }> = {};

  return (value: number): { x: number; y: number } => {
    if (cache[value]) {
      return cache[value];
    }

    return (cache[value] = {
      x: value % length,
      y: Math.floor(value / length),
    });
  };
})();
const getValue = (x: number, y: number) => grid_[x + y * length];
const getElevation = (x: number, y: number) =>
  elevations.indexOf(getValue(x, y));

const rows = input.split("\n");
const length = rows[0].length;
const grid = rows.join("");
const grid_ = grid.replace("S", "a").replace("E", "z");
const start = getCoordinate(grid.indexOf("S"));
const end = getCoordinate(grid.indexOf("E"));

const getNextPossibleMoves = (x: number, y: number, step: number) => {
  const elevation = getElevation(x, y);

  return [
    // * top
    { x, y: y - 1, step },
    // * right
    { x: x + 1, y, step },
    // * bottom
    { x, y: y + 1, step },
    // * left
    { x: x - 1, y, step },
  ].filter(({ x: x_, y: y_ }) => {
    if (x_ < 0 || y_ < 0 || x_ > length - 1 || y_ > rows.length - 1) {
      return false;
    }

    if (getElevation(x_, y_) - elevation > 1) {
      return false;
    }

    return true;
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const draw = async (render?: (x: number, y: number) => string) => {
  console.clear();
  let output = "";
  for (let i = 0; i < grid.length; i++) {
    if (i !== 0 && i % length === 0) {
      output += "\n";
    }

    const { x, y } = getCoordinate(i);
    const renderer = render ?? (() => bgBlack(" "));
    output += renderer(x, y);
  }
  console.log(output);
  await sleep(10);
};

// * part 1
const score: Record<string, number> = {};
const queue: Array<{ x: number; y: number; step: number }> = [
  { ...start, step: 0 },
];

let pass = 0;
while (queue.length) {
  const { x, y, step } = queue.shift()!;

  if (score[[x, y].join()] != null) {
    continue;
  }

  score[[x, y].join()] = step;

  if (pass % 20 === 0) {
    await draw((x_, y_) => {
      if (x_ === x && y_ === y) {
        return bgRed(" ");
      }

      const elevation = getElevation(x_, y_);
      const color = colors[elevation].rgbNumber();

      if (score[[x_, y_].join()] != null) {
        return bgRgb24(" ", color);
      } else {
        return bgBlack(" ");
      }
    });
  }

  queue.push(...getNextPossibleMoves(x, y, step + 1));
  pass++;
}

console.log(score[[end.x, end.y].join()]);

// * part 2
let result = Number.MAX_SAFE_INTEGER;
for (const [idx, value] of Object.entries(grid_)) {
  if (value !== "a") {
    continue;
  }

  const score: Record<string, number> = {};
  const queue: Array<{ x: number; y: number; step: number }> = [
    { ...getCoordinate(Number(idx)), step: 0 },
  ];

  let pass = 0;
  while (queue.length) {
    const { x, y, step } = queue.shift()!;

    if (score[[x, y].join()] != null) {
      continue;
    }

    score[[x, y].join()] = step;

    // if (pass % 20 === 0) {
    //   await draw((x_, y_) => {
    //     if (x_ === x && y_ === y) {
    //       return bgRed(" ");
    //     }

    //     const elevation = getElevation(x_, y_);
    //     const color = colors[elevation].rgbNumber();

    //     if (score[[x_, y_].join()] != null) {
    //       return bgRgb24(" ", color);
    //     } else {
    //       return bgBlack(" ");
    //     }
    //   });
    // }

    queue.push(...getNextPossibleMoves(x, y, step + 1));
    pass++;
  }

  if (result > score[[end.x, end.y].join()]) {
    result = score[[end.x, end.y].join()];
  }
}

console.log(result);
