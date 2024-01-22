import { HugeNum } from "./HugeNum";

export type FieldKeys<T> = {[P in keyof T]: T[P] extends Function ? never : P }[keyof T];
export type Fields<T> = Pick<T, FieldKeys<T>>;

export enum Stages {
  Introduction,
  Adder,
  StackOverflow,
  Register,
  CarryLookaheadAdder,
}

export interface Game {
  stage: Stages;
  levels: Map<string, number>;
  blocks: HugeNum;
  ideas: HugeNum;
  setStage: React.Dispatch<React.SetStateAction<Stages>>;
  setLevels: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  update: (
    action:
      | { action: "tick"; stage: Stages; levels: Map<string, number> }
      | { action: "consume"; amount: HugeNum }
  ) => void;
  purchaseLevel: (key: string) => void;
}