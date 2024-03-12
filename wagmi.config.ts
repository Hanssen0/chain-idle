import { defineConfig } from "@wagmi/cli";
import { abi as GameABI } from "./assets/abis/Game.json";

export default defineConfig({
  out: "src/utils/abis.ts",
  contracts: [
    {
      name: "game",
      abi: GameABI,
    },
  ],
  plugins: [],
});
