const input = await Deno.readTextFile("./input");

// * part1
// const MARKER_LENGTH = 4;
// * part2
const MARKER_LENGTH = 14;

let start = 0;
let sequence = input.slice(start, start + MARKER_LENGTH);
let found = null;

while (found === null && sequence.length === MARKER_LENGTH) {
  if (
    [...sequence].filter((value, idx, arr) => arr.indexOf(value) === idx)
      .length === MARKER_LENGTH
  ) {
    found = start + MARKER_LENGTH;
  } else {
    start += 1;
    sequence = input.slice(start, start + MARKER_LENGTH);
  }
}

console.log(found);
