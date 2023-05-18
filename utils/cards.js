export const generateCards = () => {
  const result = [];
  const cards = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const suits = ["H", "D", "S", "C"];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < cards.length; j++) {
      const card = `${cards[j]}${suits[i]}`;
      result.push(card);
    }
  }
  return result;
};

export const chooseRandomCard = (cards, usedCards = [], numberOfCards = 1) => {
  let notIncludeCards = [...usedCards];

  let result = [];
  for (let i = 0; i < numberOfCards; i++) {
    const filteredCards = cards.filter((c) => !notIncludeCards.includes(c));
    const rand = Math.floor(Math.random() * filteredCards.length);
    const card = filteredCards[rand];
    result.push(card);
    notIncludeCards.push(card);
  }

  return result;
};
