const lines = await Deno.readTextFile("./input");

const subtract = (a: number, b: number) => a - b;
const add = (a: number, b: number) => a + b;
const sqr = (a: number) => a * a;
const distance = (a: Position, b: Position) =>
  Math.sqrt(sqr(b.y - a.y) + sqr(b.x - a.x));

const getNextTailPosition = (head: Position, tail: Position) => {
  const distance_ = distance(head, tail);

  if (distance_ === 2) {
    return [
      {
        x: tail.x - 1,
        y: tail.y,
      },
      {
        x: tail.x + 1,
        y: tail.y,
      },
      {
        x: tail.x,
        y: tail.y - 1,
      },
      {
        x: tail.x,
        y: tail.y + 1,
      },
    ].filter((v) => distance(head, v) === 1)[0];
  }

  if (distance_ > 2) {
    return [
      {
        x: tail.x - 1,
        y: tail.y - 1,
      },
      {
        x: tail.x + 1,
        y: tail.y - 1,
      },
      {
        x: tail.x - 1,
        y: tail.y + 1,
      },
      {
        x: tail.x + 1,
        y: tail.y + 1,
      },
    ].filter((v) => distance(head, v) < 2)[0];
  }

  return tail;
};

type Direction = "U" | "R" | "D" | "L";
type Position = {
  x: number;
  y: number;
};

const result = lines.split("\n").reduce(
  (prev, curr) => {
    const [direction_, step_] = curr.split(" ");
    const direction = direction_ as Direction;
    const step = Number(step_);
    const axis = direction === "L" || direction === "R" ? "x" : "y";
    const operator = direction === "L" || direction === "U" ? subtract : add;

    let i = 0;
    while (i < step) {
      let z = 0;
      while (z < prev.knots.length - 1) {
        const [head, tail] = prev.knots.slice(z, z + 2);

        const head_ =
          z === 0
            ? {
                ...head,
                [axis]: operator(head[axis], 1),
              }
            : head;

        const tail_ = getNextTailPosition(head_, tail);

        prev.knots[z] = head_;
        prev.knots[z + 1] = tail_;
        prev.history[z].push(head_);
        prev.history[z + 1].push(tail_);
        z++;
      }
      i++;
    }

    return prev;
  },
  {
    knots: ["H", 1].map((_) => ({ x: 0, y: 0 })),
    history: ["H", 1].map((_) => [{ x: 0, y: 0 }]),
  }
);

const x = result.history.flat().map((_) => _.x);
const y = result.history.flat().map((_) => _.y);
const minX = Math.min(...x);
const maxX = Math.max(...x);
const minY = Math.min(...y);
const maxY = Math.max(...y);

let output = "";
for (let y_ = minY; y_ <= maxY; y_++) {
  for (let x_ = minX; x_ <= maxX; x_++) {
    output += result.history.at(-1)!.find((v) => v.y === y_ && v.x === x_)
      ? "#"
      : ".";
  }
  output += "\n";
}

console.log("===============\n");
console.log(output);
console.log("===============\n");
console.log([...output].filter((v) => v === "#").length);
