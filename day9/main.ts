const lines = await Deno.readTextFile("./input");

const subtract = (a: number, b: number) => a - b;
const add = (a: number, b: number) => a + b;
const sqr = (a: number) => a * a;
const distance = (a: Position, b: Position) =>
  Math.sqrt(sqr(b.y - a.y) + sqr(b.x - a.x));

const getNextTailPosition = (
  head: Position,
  tail: Position,
  prevHead: Position
) => {
  if (distance(head, tail) < 2) {
    return tail;
  }

  return prevHead;
};

type Direction = "U" | "R" | "D" | "L";
type Position = {
  x: number;
  y: number;
};

const count = lines
  .split("\n")
  .reduce(
    (prev, curr) => {
      const [direction, step_] = curr.split(" ");
      const step = Number(step_);
      const axis = direction === "L" || direction === "R" ? "x" : "y";
      const op = direction === "L" || direction === "U" ? subtract : add;

      let i = 0;
      while (i < step) {
        const nextHead = {
          ...prev.head,
          [axis]: op(prev.head[axis], 1),
        };

        prev.history.push(getNextTailPosition(nextHead, prev.tail, prev.head));

        prev.head = nextHead;
        prev.tail = prev.history.at(-1)!;
        i++;
      }

      return prev;
    },
    {
      head: { x: 0, y: 0 },
      tail: { x: 0, y: 0 },
      history: [{ x: 0, y: 0 }],
    }
  )
  .history.map((h) => JSON.stringify(h))
  .filter((value, idx, arr) => arr.indexOf(value) === idx).length;

console.log(count);

// const x = count.history.map((_) => _.x);
// const y = count.history.map((_) => _.y);
// const minX = Math.min(...x);
// const maxX = Math.max(...x);
// const minY = Math.min(...y);
// const maxY = Math.max(...y);

// let output = "";
// for (let i = minY; i <= maxY; i++) {
//   for (let y = minX; y <= maxX; y++) {
//     output += count.history.find((v) => v.y === i && v.x === y) ? "#" : ".";
//   }
//   output += "\n";
// }

// console.log(output);
// console.log([...output].filter((v) => v === "#").length);
