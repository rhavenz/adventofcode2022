const lines = await Deno.readTextFile("./input");

const rootDir = new Map<
  string,
  Array<
    { type: "file"; name: string; size: number } | { type: "dir"; pwd: string }
  >
>();

let pwd = "/";

for (const line of lines.split("\n")) {
  if (line.startsWith("$")) {
    const [, cmd, ...args] = line.split(" ");
    if (cmd === "cd") {
      pwd =
        args[0] === "/"
          ? "/"
          : args[0] === ".."
          ? pwd.lastIndexOf("/") === 0
            ? "/"
            : pwd.slice(0, pwd.lastIndexOf("/"))
          : pwd === "/"
          ? `${pwd}${args[0]}`
          : `${pwd}/${args[0]}`;
    }

    continue;
  }

  const isDir = line.startsWith("dir");
  if (!isDir) {
    const [size, fileName] = line.split(" ");
    const directory = rootDir.get(pwd) ?? [];
    if (
      !directory.find((item) => item.type === "file" && item.name === fileName)
    ) {
      rootDir.set(
        pwd,
        directory.concat({ type: "file", name: fileName, size: Number(size) })
      );
    }
  } else {
    const [, dirName] = line.split(" ");
    const directory = rootDir.get(pwd) ?? [];
    const pwd_ = `${pwd}${pwd === "/" ? "" : "/"}${dirName}`;
    if (!directory.find((item) => item.type === "dir" && item.pwd === pwd_)) {
      rootDir.set(
        pwd,
        directory.concat({
          type: "dir",
          pwd: pwd_,
        })
      );
    }
  }
}

const getDirectorySize = (path: string) => {
  const size: number =
    rootDir.get(path)?.reduce((a, b) => {
      return a + (b.type === "file" ? b.size : getDirectorySize(b.pwd));
    }, 0) ?? 0;

  return size;
};

const sizeByDirectory = [...rootDir.keys()].map(getDirectorySize);

// * part1
console.log(sizeByDirectory.filter((i) => i <= 100000).reduce((a, b) => a + b));

// ---------------

const MAX = 70000000;
const REQUIRED = 30000000;

const needed = REQUIRED - (MAX - getDirectorySize("/"));

// * part2
console.log(
  [...rootDir.keys()]
    .map(getDirectorySize)
    .sort((a, b) => a - b)
    .filter((size) => size >= needed)[0]
);
