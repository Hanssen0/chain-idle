import { Game, HugeNum, Stages } from "@/utils";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const GameContext = createContext<Game>({
  stage: Stages.Introduction,
  levels: new Map(),
  blocks: HugeNum.ZERO,
  ideas: HugeNum.ZERO,
  setStage: () => {},
  setLevels: () => {},
  update: () => {},
  purchaseLevel: () => {},
});

function nextIdeas(stage: Stages, ideas: HugeNum, levels: Map<string, number>) {
  if (stage === Stages.Introduction) {
    return ideas;
  }

  const pLevel = levels.get("p") ?? 0;
  const p = pLevel > 0 ? 50 * pLevel : 1;

  return ideas.add(HugeNum.fromInt(p));
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState(Stages.Introduction);
  const [levels, setLevels] = useState(new Map());
  const [[blocks, ideas], update] = useReducer(
    (
      [blocks, ideas]: [HugeNum, HugeNum],
      i:
        | { action: "tick"; stage: Stages; levels: Map<string, number> }
        | { action: "consume"; amount: HugeNum }
    ): [HugeNum, HugeNum] => {
      if (i.action === "tick") {
        const next = nextIdeas(i.stage, ideas, i.levels);
        return [blocks.add(next.sub(ideas)), next];
      }
      return [blocks, ideas.sub(i.amount)];
    },
    [HugeNum.ZERO, HugeNum.ZERO]
  );
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => !t), 1000);
    return () => clearInterval(interval);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => update({ action: "tick", stage, levels }), [tick]);

  const purchaseLevel = useCallback(
    (key: string) => {
      setLevels((levels) =>
        new Map(levels).set(key, (levels.get(key) ?? 0) + 1)
      );
      update({
        action: "consume",
        amount: getVariableCost(key, levels) ?? HugeNum.ZERO,
      });
    },
    [setLevels, update, levels]
  );

  return (
    <GameContext.Provider
      value={{
        stage,
        levels,
        blocks,
        ideas,
        setStage,
        setLevels,
        update,
        purchaseLevel,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function getVariableCost(key: string, levels: Map<string, number>) {
  const p = levels.get(key) ?? 0;
  return HugeNum.fromInt(1000n).mul(HugeNum.fromInt(p));
}

export function useGame() {
  return useContext(GameContext);
}
