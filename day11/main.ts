const input = await Deno.readTextFile("./input");

const monkeys: Record<number, number[]> = {};
const operations: Record<number, string[]> = {};
const moves: Record<number, number[]> = {};
const activities: Record<number, number> = {};

for (const lines of input.split("\n\n")) {
  let monkeyId = -1;

  for (const line of lines.split("\n")) {
    if (line.startsWith("Monkey")) {
      monkeyId = Number(line.split(":")[0].split(" ")[1]);
    }

    if (line.trim().startsWith("Starting items")) {
      monkeys[monkeyId] = line
        .split("Starting items: ")[1]
        .split(",")
        .map(Number);
    }

    if (line.trim().startsWith("Operation")) {
      const rawOperation = line.split("Operation: new = ")[1].split(" ");

      operations[monkeyId] = rawOperation;
    }

    if (line.trim().startsWith("Test")) {
      moves[monkeyId] = [Number(line.split("divisible by ")[1])];
    }

    if (line.trim().startsWith("If true")) {
      moves[monkeyId].push(Number(line.split("throw to monkey ")[1]));
    }

    if (line.trim().startsWith("If false")) {
      moves[monkeyId].push(Number(line.split("throw to monkey ")[1]));
    }
  }
}

console.log({ monkeys, operations, moves });

const getWorryLevel = (old: number, op: string[]) => {
  const op_ = op.map((v) => (v === "old" ? old : v));

  if (op_.indexOf("+") !== -1) {
    return Math.floor((Number(op_[0]) + Number(op_[2])) / 3);
  }

  if (op_.indexOf("*") !== -1) {
    return Math.floor((Number(op_[0]) * Number(op_[2])) / 3);
  }

  throw new Error("Unexpected operation");
};

const getTarget = (worryLevel: number, moveConfig: number[]) => {
  if (worryLevel % moveConfig[0] === 0) {
    return moveConfig[1];
  }

  return moveConfig[2];
};

for (let round = 0; round < 20; round++) {
  for (let turn = 0; turn < Object.keys(monkeys).length; turn++) {
    for (const old of monkeys[turn].concat()) {
      activities[turn] ??= 0;
      activities[turn]++;

      const new_ = getWorryLevel(old, operations[turn]);
      const target = getTarget(new_, moves[turn]);

      monkeys[turn].shift();
      monkeys[target].push(new_);
    }
  }
}

console.log({ monkeys, operations, moves, activities });
