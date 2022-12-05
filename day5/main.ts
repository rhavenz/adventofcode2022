const input = await Deno.readTextFile("./input");

// [
//   "[M]                     [N] [Z]    ",
//   "[F]             [R] [Z] [C] [C]    ",
//   "[C]     [V]     [L] [N] [G] [V]    ",
//   "[W]     [L]     [T] [H] [V] [F] [H]",
//   "[T]     [T] [W] [F] [B] [P] [J] [L]",
//   "[D] [L] [H] [J] [C] [G] [S] [R] [M]",
//   "[L] [B] [C] [P] [S] [D] [M] [Q] [P]",
//   "[B] [N] [J] [S] [Z] [W] [F] [W] [R]",
//   " 1   2   3   4   5   6   7   8   9 ",
// ];

const [state, actions] = input.split("\n\n").map((lines) => lines.split("\n"));

const headers = state[state.length - 1];
const lines = state.slice(0, state.indexOf(headers)).reverse();
const headerEntries = headers
  .split(" ")
  .filter(Boolean)
  .map((entry) => headers.indexOf(entry));

const stacks = headerEntries.map((id) => ({
  id: Number(headers[id]),
  state: lines.map((line) => line[id].trim()).filter(Boolean),
}));

// * part1
console.log(
  actions
    // .slice(0, 1)
    .reduce((prev, action) => {
      const [, size, , from, , to] = action.split(" ").map(Number);
      console.log({ size, from, to });

      const from_ = prev.find((stack) => stack.id === from)!;
      const to_ = prev.find((stack) => stack.id === to)!;

      to_.state = to_.state.concat(from_.state.slice(0 - size).reverse());
      from_.state = from_.state.slice(0, 0 - size);

      return prev;
    }, stacks)
    .map((stack) => stack.state.slice(-1))
    .flat()
    .join("")
);

// * part2
console.log(
  actions
    // .slice(0, 1)
    .reduce((prev, action) => {
      const [, size, , from, , to] = action.split(" ").map(Number);
      console.log({ size, from, to });

      const from_ = prev.find((stack) => stack.id === from)!;
      const to_ = prev.find((stack) => stack.id === to)!;

      to_.state = to_.state.concat(from_.state.slice(0 - size));
      from_.state = from_.state.slice(0, 0 - size);

      return prev;
    }, stacks)
    .map((stack) => stack.state.slice(-1))
    .flat()
    .join("")
);
