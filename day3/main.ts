const input = await Deno.readTextFile("./input");

const table = [..."_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const part1 = input
  .split("\n")
  .map((rucksack) => [
    [...rucksack.slice(0, rucksack.length / 2)],
    [...rucksack.slice(rucksack.length / 2)],
  ])
  .reduce((prev, [compartment, ...rest]) => {
    return (
      prev +
      compartment
        .filter((value, idx, arr) => arr.indexOf(value) === idx)
        .filter((item) =>
          rest.every((compartment_) => compartment_.indexOf(item) !== -1)
        )
        .reduce((prev_, item) => table.indexOf(item) + prev_, 0)
    );
  }, 0);

console.log(part1);

const part2 = input
  .split("\n")
  .reduce<string[][][]>((prev, rucksack, idx) => {
    const groupId = Math.floor(idx / 3);
    prev[groupId] ??= [];
    prev[groupId].push([...rucksack]);
    return prev;
  }, [])
  .map(([rucksack, ...rest]) => {
    return rucksack
      .filter((value, idx, arr) => arr.indexOf(value) === idx)
      .filter((item) => rest.every((group_) => group_.indexOf(item) !== -1));
  })
  .map((items) =>
    items
      .map((item) => table.indexOf(item))
      .reduce((prev, curr) => prev + curr, 0)
  )
  .reduce((prev, curr) => prev + curr, 0);

console.log(part2);
