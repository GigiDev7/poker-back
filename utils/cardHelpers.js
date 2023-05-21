import { cardPriority } from "./cardCombinations.js";

export const sortCards = (cards) => {
  return [...cards].sort((a, b) => {
    let st = a.slice(0, a.length - 1);
    let st2 = b.slice(0, b.length - 1);

    if (cardPriority[st] > cardPriority[st2]) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const countCardFrequency = (cardsArr) => {
  let frequencyObj = {};

  for (let card of cardsArr) {
    let st = card.slice(0, card.length - 1);
    frequencyObj[st] ? frequencyObj[st]++ : (frequencyObj[st] = 1);
  }

  return frequencyObj;
};

export const helperRoyalFlush = (cardsArr, suit) => {
  const royalFlush = [
    `A${suit}`,
    `K${suit}`,
    `Q${suit}`,
    `J${suit}`,
    `10${suit}`,
  ];

  const isRoyalFlushHand = royalFlush.every((el) => cardsArr.includes(el));

  return { isRoyalFlushHand, royalFlush };
};

export const helperLowStraight = (cardsArr) => {
  let isLowStraight = false;
  let lowStraightHand = [];
  if (
    cardsArr[cardsArr.length - 1].startsWith("2") &&
    cardsArr[cardsArr.length - 2].startsWith("3") &&
    cardsArr[cardsArr.length - 3].startsWith("4") &&
    cardsArr[cardsArr.length - 4].startsWith("5") &&
    cardsArr[0].startsWith("A")
  ) {
    isLowStraight = true;
    lowStraightHand = [
      cardsArr[cardsArr.length - 4],
      cardsArr[cardsArr.length - 3],
      cardsArr[cardsArr.length - 2],
      cardsArr[cardsArr.length - 1],
      cardsArr[0],
    ];
  }

  return { isLowStraight, lowStraightHand };
};

export const helperStraight = (cardsArr) => {
  let isSTraightCombination = false;
  let straightCombinationHand = [];

  for (let i = 0; i < 4; i++) {
    let prev = i;
    let cur = i + 1;
    let temp = 1;
    while (cur < cardsArr.length && temp < 5) {
      let prevCard = cardsArr[prev].slice(0, cardsArr[prev].length - 1);
      let curCard = cardsArr[cur].slice(0, cardsArr[cur].length - 1);
      let prevPr = cardPriority[prevCard];
      let curPr = cardPriority[curCard];
      if (curPr - prevPr === 1) {
        temp++;
        prev++;
        cur++;
      } else {
        break;
      }
    }
    if (temp >= 5) {
      isSTraightCombination = true;
      straightCombinationHand = cardsArr.slice(i, i + 5);
      break;
    } else {
      temp = 1;
    }
  }

  return { isSTraightCombination, straightCombinationHand };
};
