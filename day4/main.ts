const input = await Deno.readTextFile("./input");

const part1 = input
  .split("\n")
  .map((value) =>
    value.split(",").map((value_) => value_.split("-").map(Number))
  )
  .map(([left, right]) =>
    left[0] === right[0] || left[1] === right[1]
      ? true
      : left[0] < right[0]
      ? left[1] > right[1]
      : left[1] < right[1]
  )
  .filter(Boolean);

console.log(part1.length);

const part2 = input
  .split("\n")
  .map((value) =>
    value.split(",").map((value_) => value_.split("-").map(Number))
  )
  .map(([left, right]) =>
    left[0] === right[0] || left[1] === right[1]
      ? true
      : left[0] < right[0]
      ? left[1] >= right[0]
      : left[0] <= right[1]
  )
  .filter(Boolean);

console.log(part2.length);
