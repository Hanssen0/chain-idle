import { Fields, Game, Stages } from "./types";

export const STORIES = [
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
    hasUnlocked: (game: Fields<Game>) => game.stage >= Stages.Adder,
  },
  {
    type: "BuyAvailable",
    header: "Stack Overflow",
    body: [
      '"This seems like it might work!"\n',
      "The chain in your mind grows longer",
      "Your genius idea needs a piece of paper",
    ],
    hasUnlocked: (game: Fields<Game>) => game.stage >= Stages.StackOverflow,
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
    hasUnlocked: (game: Fields<Game>) => game.stage >= Stages.Register,
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
    hasUnlocked: (game: Fields<Game>) => game.stage >= Stages.CarryLookaheadAdder,
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
