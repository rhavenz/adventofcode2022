const input = await Deno.readTextFile("./input");

/**
 * A X Rock
 * B Y Paper
 * C Z Scissors
 */

/**
 * R > S
 * S > P
 * P > R
 */

const score = input.split("\n").reduce((score, round) => {
  const me = round[2];
  const shapeScore = me === "X" ? 1 : me === "Y" ? 2 : me === "Z" ? 3 : 0;
  const isDraw = round === "A X" || round === "B Y" || round === "C Z";
  const isWin = round === "C X" || round === "B Z" || round === "A Y";
  const roundScore = isDraw ? 3 : isWin ? 6 : 0;

  return score + shapeScore + roundScore;
}, 0);

// part 1
console.log("-----------");
console.log(score);

/**
 * A X To lose
 * B Y Draw
 * C Z To win
 */

const score_ = input.split("\n").reduce((score, round) => {
  const p1 = round[0];
  const isWin = (x: string) => x === "C X" || x === "B Z" || x === "A Y";
  const isDraw = (x: string) => x === "A X" || x === "B Y" || x === "C Z";
  const isLose = (x: string) => !isWin(x) && !isDraw(x);
  const selector =
    round[2] === "Z" ? isWin : round[2] === "Y" ? isDraw : isLose;
  const selectedShape = ["X", "Y", "Z"].find((shape) =>
    selector(`${p1} ${shape}`)
  );
  const shapeScore =
    selectedShape === "X"
      ? 1
      : selectedShape === "Y"
      ? 2
      : selectedShape === "Z"
      ? 3
      : 0;
  const roundScore = round[2] === "Z" ? 6 : round[2] === "Y" ? 3 : 0;

  return score + shapeScore + roundScore;
}, 0);

// part 1
console.log("-----------");
console.log(score_);
