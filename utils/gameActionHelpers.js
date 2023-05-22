import { chooseRandomCard, generateCards } from "./cards.js";
import { checkCardCombination, checkWinner } from "./checkCardCombinations.js";

const cards = generateCards();

export const freshHandStart = (table) => {
  const playingCards = chooseRandomCard(cards, [], 7);
  table.player1.cards = [playingCards[0], playingCards[1]];
  table.player2.cards = [playingCards[2], playingCards[3]];
  table.cards = playingCards.slice(4);
  table.lastAction = "";
  table.winner = "";

  if (table.playerTurn.toString() === table.player1.id.toString()) {
    table.playerTurn = table.player2.id;
    table.player1.action.actionChips = table.bigBlind;
    table.player2.action.actionChips = table.smallBlind;
    table.player1.chipCount -= table.player1.action.actionChips;
    table.player2.chipCount =
      table.player2.chipCount + table.pot - table.player2.action.actionChips;
  } else {
    table.playerTurn = table.player1.id;
    table.player1.action.actionChips = table.smallBlind;
    table.player2.action.actionChips = table.bigBlind;
    table.player2.chipCount -= table.player2.action.actionChips;
    table.player1.chipCount =
      table.player1.chipCount + table.pot - table.player1.action.actionChips;
  }
  table.pot = table.smallBlind + table.bigBlind;
};

export const checkHandsAndGetWinner = (table) => {
  //check player combinations
  const player1Hand = checkCardCombination(table.player1.cards, table.cards);
  const player2Hand = checkCardCombination(table.player2.cards, table.cards);

  const winner = checkWinner(player1Hand, player2Hand);

  if (winner === 1) {
    table.player1.chipCount += table.pot;
    table.pot = 0;
  } else if (winner === 2) {
    table.player2.chipCount += table.pot;
    table.pot = 0;
  } else {
    table.player1.chipCount += table.pot / 2;
    table.player2.chipCount += table.pot / 2;
  }

  //declare winner if there is one
  if (table.player1.chipCount === 0) {
    table.winner = table.player2.id.toString();
  } else if (table.player2.chipCount === 0) {
    table.winner = table.player1.id.toString();
  } else {
    freshHandStart(table);
  }
};
