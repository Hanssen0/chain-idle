import { Fields, Game, Stages } from "./types";

export const STORIES: {
  type: string;
  header: string;
  body: string[];
  hasUnlocked: (game: Fields<Game>) => boolean;
}[] = [
  {
    type: "Introduction",
    header: "Adder",
    body: [
      "You were born with a keen nose for mathematics\n",
      "Today, you are reading a book about the hash function",
      "You suddenly think",
      '"Maybe we can divide the data into small pieces."',
      '"Each piece of data contains the hash of the previous one."',
      '"Thus concatenating all the data?"\n',
      "A chain of data comes into your mind",
    ],
    hasUnlocked: (game) => game.stage >= Stages.Adder,
  },
  {
    type: "BuyAvailable",
    header: "Stack Overflow",
    body: [
      '"This seems like it might work!"\n',
      "The chain in your mind grows longer",
      "Your genius idea needs a piece of paper",
    ],
    hasUnlocked: (game) => game.stage >= Stages.StackOverflow,
  },
  {
    type: "FirstBuy",
    header: "Register",
    body: [
      "Papers!",
      "You can finally remember the results you just calculated\n",
      "With your efficiency significantly improved",
      "You can't wait to do the following calculation",
    ],
    hasUnlocked: (game) => game.stage >= Stages.Register,
  },
  {
    type: "NewBlocks",
    header: "Carry-lookahead Adder",
    body: [
      "The chain you create grows as expected",
      "You feel delighted\n",
      "As generating more and more new lovely chunks of data",
      "You realize the calculations can be more efficient",
    ],
    hasUnlocked: (game) => game.stage >= Stages.CarryLookaheadAdder,
  },
  {
    type: "ConnectWalletNeeded",
    header: "Two's Complement",
    body: [
      "Your understanding of the data chain is getting deeper",
      "You are planning to divide data blocks into records...\n\n",
      "Chain Idle is a game on the blockchain",
      "Before experiencing the content next",
      "You need to connect to the blockchain to interact with it",
    ],
    hasUnlocked: (game) => game.stage >= Stages.TwosComplement,
  },
  {
    type: "Registered",
    header: "Multiplier",
    body: [
      "The unified data structure accelerates your calculation dramatically",
      "To commemorate this breakthrough",
      'You name it "Blockchain"\n',
      "Maybe you should share your masterpiece with others?",
    ],
    hasUnlocked: (game) => game.stage >= Stages.Multiplier,
  },
];

export const KNOWLEDGES = [
  {
    type: "ChainIdle",
    header: "Chain Idle",
    link: "https://hanssens-library.gitbook.io/chain-idle/knowledges/chain-idle",
    hasUnlocked: () => true,
  },
  {
    type: "Links",
    header: "Links",
    link: "https://hanssens-library.gitbook.io/chain-idle/knowledges/links",
    hasUnlocked: () => true,
  },
];
