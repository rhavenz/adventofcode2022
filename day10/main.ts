const lines = await Deno.readTextFile("./input");

const getCpu = () => {
  let x = 1;
  let cycle = 0;
  let strength: number[] = [];
  let output = "";

  const loop = () => {
    strength = [...strength, (cycle + 1) * x];
    const pos = cycle % 40;
    output += [x - 1, x, x + 1].includes(pos) ? "#" : ".";
    cycle++;
  };

  return {
    insctructions: {
      addx(value: number) {
        loop();
        loop();
        x += value;
      },
      noop() {
        loop();
      },
    },
    getSignalStrengthReport() {
      return [...strength];
    },
    getOutput() {
      return output;
    },
  };
};

const cpu = getCpu();
for (const instruction of lines.split("\n")) {
  const [instruction_, value_] = instruction.split(" ");
  if (instruction_ === "addx") {
    cpu.insctructions.addx(Number(value_));
  } else {
    cpu.insctructions.noop();
  }
}

let result: number[] = [];
for (const [idx, signal] of Object.entries(cpu.getSignalStrengthReport())) {
  const cycleNumber = Number(idx) + 1;

  if (
    cycleNumber === 20 ||
    (cycleNumber > 20 && (cycleNumber - 20) % 40 === 0)
  ) {
    result = [...result, signal];
  }
}

// * part1
console.log(result.reduce((a, b) => a + b));

// * part2
console.log("\n=====================\n");

const output = cpu.getOutput();
let i = 0;
while (i < 6) {
  const start = i * 40;
  const end = start + 40;
  console.log(output.slice(start, end));
  i++;
}

console.log("\n=====================\n");
