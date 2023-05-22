import { cardPriority, combinationPriority } from "./cardCombinations.js";
import {
  countCardFrequency,
  helperLowStraight,
  helperRoyalFlush,
  helperStraight,
  sortCards,
} from "./cardHelpers.js";

export const checkRoyalFlush = (playerCards, tableCards) => {
  let isRoyalFlush = false;
  let playerHand = [];

  if (
    playerCards[0][playerCards[0].length - 1] ===
    playerCards[1][playerCards[1].length - 1]
  ) {
    const filteredCards = tableCards.filter(
      (el) => el[el.length - 1] === playerCards[0][playerCards[0].length - 1]
    );
    if (filteredCards.length >= 3) {
      let arr = [...filteredCards, ...playerCards];
      let suit = playerCards[0][playerCards[0].length - 1];
      const { isRoyalFlushHand, royalFlush } = helperRoyalFlush(arr, suit);
      if (isRoyalFlushHand) {
        isRoyalFlush = true;
        playerHand = [...royalFlush];
      }
    }
  } else if (
    playerCards[0][playerCards[0].length - 1] !==
    playerCards[1][playerCards[1].length - 1]
  ) {
    const filteredCardsOne = tableCards.filter(
      (el) => el[el.length - 1] === playerCards[0][playerCards[0].length - 1]
    );
    const filteredCardsTwo = tableCards.filter(
      (el) => el[el.length - 1] === playerCards[1][playerCards[1].length - 1]
    );

    if (filteredCardsOne.length >= 4) {
      let arr = [...filteredCardsOne, playerCards[0]];
      let suit = playerCards[0][playerCards[0].length - 1];
      const { isRoyalFlushHand, royalFlush } = helperRoyalFlush(arr, suit);
      if (isRoyalFlushHand) {
        isRoyalFlush = true;
        playerHand = [...royalFlush];
      }
    }

    if (filteredCardsTwo.length >= 4) {
      let arr = [...filteredCardsTwo, playerCards[1]];
      let suit = playerCards[1][playerCards[1].length - 1];
      const { isRoyalFlushHand, royalFlush } = helperRoyalFlush(arr, suit);

      if (isRoyalFlushHand) {
        isRoyalFlush = true;
        playerHand = [...royalFlush];
      }
    }
  }

  return { isRoyalFlush, playerHand };
};

export const checkStraightFlush = (playerCards, tableCards) => {
  let isStraightFlush = false;
  let playerHand = [];

  if (
    playerCards[0][playerCards[0].length - 1] ===
    playerCards[1][playerCards[1].length - 1]
  ) {
    const filteredCards = tableCards.filter(
      (el) => el[el.length - 1] === playerCards[0][playerCards[0].length - 1]
    );
    if (filteredCards.length >= 3) {
      let sorted = sortCards([...filteredCards, ...playerCards]);
      const { isLowStraight, lowStraightHand } = helperLowStraight(sorted);
      if (isLowStraight) {
        isStraightFlush = true;
        playerHand = [...lowStraightHand];
      }

      const { isSTraightCombination, straightCombinationHand } =
        helperStraight(sorted);
      if (isSTraightCombination) {
        isStraightFlush = true;
        playerHand = [...straightCombinationHand];
      }
    }
  } else if (
    playerCards[0][playerCards[0].length - 1] !==
    playerCards[1][playerCards[1].length - 1]
  ) {
    const filteredCardsOne = tableCards.filter(
      (el) => el[el.length - 1] === playerCards[0][playerCards[0].length - 1]
    );

    const filteredCardsTwo = tableCards.filter(
      (el) => el[el.length - 1] === playerCards[1][playerCards[1].length - 1]
    );

    if (filteredCardsOne.length >= 4) {
      let sorted = sortCards([...filteredCardsOne, playerCards[0]]);

      const { isLowStraight, lowStraightHand } = helperLowStraight(sorted);
      if (isLowStraight) {
        isStraightFlush = true;
        playerHand = [...lowStraightHand];
      }

      const { isSTraightCombination, straightCombinationHand } =
        helperStraight(sorted);
      if (isSTraightCombination) {
        isStraightFlush = true;
        playerHand = [...straightCombinationHand];
      }
    }

    if (filteredCardsTwo.length >= 4) {
      let sorted = sortCards([...filteredCardsTwo, playerCards[1]]);

      const { isLowStraight, lowStraightHand } = helperLowStraight(sorted);
      if (isLowStraight) {
        isStraightFlush = true;
        playerHand = [...lowStraightHand];
      }

      const { isSTraightCombination, straightCombinationHand } =
        helperStraight(sorted);
      if (isSTraightCombination) {
        isStraightFlush = true;
        playerHand = [...straightCombinationHand];
      }
    }
  }

  return { isStraightFlush, playerHand };
};

export const checkFourOfKind = (playerCards, tableCards) => {
  let isFourOfKind = false;
  let playerHand = [];

  let sorted = sortCards([...playerCards, ...tableCards]);
  const cardFrequency = countCardFrequency(sorted);
  const entries = Object.entries(cardFrequency).filter((el) => el[1] === 4);

  if (entries.length) {
    isFourOfKind = true;
    const fours = sorted.filter((el) => el.startsWith(entries[0][0]));
    playerHand = [...fours];
    const leftCards = sorted.filter((el) => !el.startsWith(entries[0][0]));
    playerHand.push(leftCards[0]);
    return { isFourOfKind, playerHand };
  }

  return { isFourOfKind, playerHand };
};

export const checkFullHouse = (playerCards, tableCards) => {
  let isFullHouse = false;
  let playerHand = [];

  let sorted = sortCards([...playerCards, ...tableCards]);
  const cardFrequency = countCardFrequency(sorted);

  const entries = Object.entries(cardFrequency)
    .filter((el) => el[1] >= 2)
    .sort((a, b) => {
      if (a[1] >= b[1]) {
        return -1;
      } else {
        return 1;
      }
    });

  if (entries.length < 2) return { isFullHouse, playerHand };

  if (entries.length === 2) {
    if (entries[0][1] !== 3 && entries[1][1] !== 3)
      return { isFullHouse, playerHand };

    isFullHouse = true;
    const threes = sorted.filter((el) => el.startsWith(entries[0][0]));
    const twos = sorted.filter((el) => el.startsWith(entries[1][0]));
    playerHand = [...threes, ...twos];
    return { isFullHouse, playerHand };
  } else if (entries.length === 3) {
    if (entries[0][1] !== 3 && entries[1][1] !== 3 && entries[2][1])
      return { isFullHouse, playerHand };

    isFullHouse = true;
    const threes = sorted.filter((el) => el.startsWith(entries[0][0]));
    const twos = sorted.filter((el) => el.startsWith(entries[1][0]));
    playerHand = [...threes, ...twos];
    return { isFullHouse, playerHand };
  }

  return { isFullHouse, playerHand };
};

export const checkFlush = (playerCards, tableCards) => {
  let firstSuit = playerCards[0][playerCards[0].length - 1];
  let secondSuit = playerCards[1][playerCards[1].length - 1];

  let isFlush = false;
  let playerHand = [];

  let sorted = sortCards([...playerCards, ...tableCards]);

  if (firstSuit === secondSuit) {
    const filteredCards = sorted.filter((el) => el.endsWith(firstSuit));
    if (filteredCards.length >= 5) {
      isFlush = true;
      playerHand = filteredCards.slice(0, 5);
      return { isFlush, playerHand };
    }
  } else {
    const filteredCardsOne = sorted.filter((el) => el.endsWith(firstSuit));
    const filteredCardsTwo = sorted.filter((el) => el.endsWith(secondSuit));

    if (filteredCardsOne.length >= 5) {
      isFlush = true;
      playerHand = filteredCardsOne.slice(0, 5);
      return { isFlush, playerHand };
    }

    if (filteredCardsTwo.length >= 5) {
      isFlush = true;
      playerHand = filteredCardsTwo.slice(0, 5);
      return { isFlush, playerHand };
    }
  }

  return { isFlush, playerHand };
};

export const checkStraight = (playerCards, tableCards) => {
  let sorted = Array.from(new Set(sortCards([...playerCards, ...tableCards])));

  let isStraight = false;
  let playerHand = [];

  const { isLowStraight, lowStraightHand } = helperLowStraight(sorted);
  if (isLowStraight) {
    isStraight = true;
    playerHand = [...lowStraightHand];
  }

  if (sorted.length >= 5) {
    const { isSTraightCombination, straightCombinationHand } =
      helperStraight(sorted);
    if (isSTraightCombination) {
      isStraight = true;
      playerHand = [...straightCombinationHand];
    }
  }

  return { isStraight, playerHand };
};

export const checkThreeOfKind = (playerCards, tableCards) => {
  let sorted = sortCards([...playerCards, ...tableCards]);

  let isThreeOfKind = false;
  let playerHand = [];

  const cardFrequency = countCardFrequency(sorted);
  const entries = Object.entries(cardFrequency).filter((el) => el[1] === 3);
  if (!entries.length) return { isThreeOfKind, playerHand };

  isThreeOfKind = true;
  const threes = sorted.filter((el) => el.startsWith(entries[0][0]));
  playerHand = [...threes];
  const leftCards = sorted.filter((el) => !el.startsWith(entries[0][0]));

  playerHand.push(leftCards[0], leftCards[1]);
  return { isThreeOfKind, playerHand };
};

export const checkTwoPair = (playerCards, tableCards) => {
  let isTwoPair = false;
  let playerHand = [];

  let sorted = sortCards([...playerCards, ...tableCards]);
  const cardFrequency = countCardFrequency(sorted);
  let entries = Object.entries(cardFrequency).filter((el) => el[1] === 2);

  if (entries.length < 2) return { isTwoPair, playerHand };

  isTwoPair = true;
  if (entries.length === 2) {
    const firstTwos = sorted.filter((el) => el.startsWith(entries[0][0]));
    const secondTwos = sorted.filter((el) => el.startsWith(entries[1][0]));
    playerHand = [...firstTwos, ...secondTwos];
    const leftCards = sorted.filter(
      (el) => !el.startsWith(entries[0][0]) && !el.startsWith(entries[1][0])
    );
    playerHand.push(leftCards[0]);
  }
  if (entries.length === 3) {
    const firstTwos = sorted.filter((el) => el.startsWith(entries[1][0]));
    const secondTwos = sorted.filter((el) => el.startsWith(entries[2][0]));
    playerHand = [...firstTwos, ...secondTwos];
    const leftCards = sorted.filter(
      (el) => !el.startsWith(entries[1][0]) && !el.startsWith(entries[2][0])
    );
    playerHand.push(leftCards[0]);
  }

  return { isTwoPair, playerHand };
};

export const checkOnePair = (playerCards, tableCards) => {
  let isOnePair = false;
  let playerHand = [];

  let sorted = sortCards([...playerCards, ...tableCards]);
  const cardFrequency = countCardFrequency(sorted);
  let entries = Object.entries(cardFrequency).filter((el) => el[1] === 2);

  if (!entries.length) return { isOnePair, playerHand };

  isOnePair = true;
  const ones = sorted.filter((el) => el.startsWith(entries[0][0]));
  playerHand = [...ones];

  const leftCards = sorted.filter((el) => !el.startsWith(entries[0][0]));

  playerHand.push(leftCards[0], leftCards[1], leftCards[2]);
  return { isOnePair, playerHand };
};

export const checkHighCard = (playerCards, tableCards) => {
  let playerHand = [];

  const sorted = sortCards([...playerCards, ...tableCards]);
  playerHand = sorted.slice(0, 5);

  return playerHand;
};

export const checkCardCombination = (playerCards, tableCards) => {
  let playerHand = {
    cards: [],
    combination: "",
  };

  const royalFlush = checkRoyalFlush(playerCards, tableCards);
  if (royalFlush.isRoyalFlush) {
    playerHand.cards = [...royalFlush.playerHand];
    playerHand.combination = "Royal Flush";
    return playerHand;
  }

  const straightFlush = checkStraightFlush(playerCards, tableCards);
  if (straightFlush.isStraightFlush) {
    playerHand.cards = [...straightFlush.playerHand];
    playerHand.combination = "Straight Flush";
    return playerHand;
  }

  const fourOfKind = checkFourOfKind(playerCards, tableCards);
  if (fourOfKind.isFourOfKind) {
    playerHand.cards = [...fourOfKind.playerHand];
    playerHand.combination = "Four of a kind";
    return playerHand;
  }

  const fullHouse = checkFullHouse(playerCards, tableCards);
  if (fullHouse.isFullHouse) {
    playerHand.cards = [...fullHouse.playerHand];
    playerHand.combination = "Full House";
    return playerHand;
  }

  const flush = checkFlush(playerCards, tableCards);
  if (flush.isFlush) {
    playerHand.cards = [...flush.playerHand];
    playerHand.combination = "Flush";
    return playerHand;
  }

  const straight = checkStraight(playerCards, tableCards);
  if (straight.isStraight) {
    playerHand.cards = [...straight.playerHand];
    playerHand.combination = "Straight";
    return playerHand;
  }

  const threeOfKind = checkThreeOfKind(playerCards, tableCards);
  if (threeOfKind.isThreeOfKind) {
    playerHand.cards = [...threeOfKind.playerHand];
    playerHand.combination = "Three of a kind";
    return playerHand;
  }

  const twoPairs = checkTwoPair(playerCards, tableCards);
  if (twoPairs.isTwoPair) {
    playerHand.cards = [...twoPairs.playerHand];
    playerHand.combination = "Two Pair";
    return playerHand;
  }

  const onePair = checkOnePair(playerCards, tableCards);
  if (onePair.isOnePair) {
    playerHand.cards = [...onePair.playerHand];
    playerHand.combination = "One Pair";
    return playerHand;
  }

  const highCard = checkHighCard(playerCards, tableCards);
  playerHand.cards = [...highCard];
  playerHand.combination = "High Card";
  return playerHand;
};

export const checkWinner = (player1, player2) => {
  let winner = 0;

  const player1Combination = player1.combination;
  const player2Combination = player2.combination;

  const player1CombPriority = combinationPriority[player1Combination];
  const player2CombPriority = combinationPriority[player2Combination];

  if (player1CombPriority < player2CombPriority) {
    winner = 1;
  } else if (player1CombPriority > player2CombPriority) {
    winner = 2;
  } else {
    const player1Cards = player1.cards;
    const player2Cards = player2.cards;
    for (let i = 0; i < 5; i++) {
      const player1C =
        player1Cards.length === 3
          ? player1Cards[i].slice(0, 2)
          : player1Cards[i][0];
      const player2C =
        player2Cards.length === 3
          ? player2Cards[i].slice(0, 2)
          : player2Cards[i][0];
      if (cardPriority[player1C] < cardPriority[player2C]) {
        winner = 1;
        break;
      } else if (cardPriority[player1C] > cardPriority[player2C]) {
        winner = 2;
        break;
      }
    }
  }

  return winner;
};
