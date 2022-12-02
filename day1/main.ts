const input = await Deno.readTextFile("./input");
const bags = input
  .split("\n\n")
  .map((bag) => bag.split("\n"))
  .map((bag) => bag.map((x) => parseInt(x)))
  .map((bag) => bag.reduce((p, c) => p + c, 0));

// part 1
console.log(Math.max(...bags));

// part 2
console.log(
  bags
    .sort((a, b) => a - b)
    .slice(-3)
    .reduce((p, c) => p + c, 0)
);
