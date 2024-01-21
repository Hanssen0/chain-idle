export * from "./types";
export * from "./HugeNum";

export function randomHex(length = 1) {
  return Array.from(
    Array(length),
    () => "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
}

export function d(instructions: [string, number[]][]) {
  return instructions
    .map(([ins, points]) => `${ins}${points.join(",")}`)
    .join();
}
