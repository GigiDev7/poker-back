import {
  checkRoyalFlush,
  checkStraightFlush,
  checkFourOfKind,
  checkFullHouse,
  checkFlush,
  checkStraight,
  checkThreeOfKind,
  checkTwoPair,
  checkOnePair,
  checkHighCard,
  checkCardCombination,
} from "./checkCardCombinations";

describe("check card combinations utils", () => {
  describe("checking royal flush", () => {
    it("if its royal flush should return it", () => {
      const res = checkRoyalFlush(
        ["AH", "KH"],
        ["10H", "QH", "JH", "2S", "3S"]
      );

      expect(res.isRoyalFlush).toBe(true);
      expect(res.playerHand).toEqual(["AH", "KH", "QH", "JH", "10H"]);
    });
    it("should not return royal flush when its not", () => {
      const res = checkRoyalFlush(
        ["AH", "KH"],
        ["10H", "QH", "JC", "2S", "3S"]
      );

      expect(res.isRoyalFlush).toBe(false);
      expect(res.playerHand).toEqual([]);
    });
  });

  describe("checking straight flush", () => {
    it("should return true if its straight flush", () => {
      const res = checkStraightFlush(
        ["10S", "2C"],
        ["3C", "4C", "AC", "7S", "5C"]
      );

      expect(res.isStraightFlush).toBe(true);
      expect(res.playerHand).toEqual(
        expect.arrayContaining(["AC", "5C", "4C", "3C", "2C"])
      );
    });

    it("should return false if its not straight flush", () => {
      const res = checkStraightFlush(
        ["10S", "2H"],
        ["9S", "8S", "AC", "7S", "JH"]
      );

      expect(res.isStraightFlush).toBe(false);
      expect(res.playerHand).toEqual([]);
    });
  });

  describe("checking four of a kind", () => {
    it("should return true if its four of a kind", () => {
      const res = checkFourOfKind(["AC", "2H"], ["AS", "AH", "JH", "AD", "3H"]);

      expect(res.isFourOfKind).toBe(true);
      expect(res.playerHand).toEqual(
        expect.arrayContaining(["AC", "AH", "AD", "AS", "JH"])
      );
    });

    it("should return false if its not four of a kind", () => {
      const res = checkFourOfKind(["AC", "2H"], ["AS", "AH", "JH", "KD", "3H"]);

      expect(res.isFourOfKind).toBe(false);
      expect(res.playerHand).toEqual([]);
    });
  });

  describe("checking full house", () => {
    it("should return true if its full house", () => {
      const res = checkFullHouse(["AD", "KC"], ["AC", "KD", "AS", "3S", "2S"]);

      expect(res.isFullHouse).toBe(true);
      expect(res.playerHand).toEqual(
        expect.arrayContaining(["AD", "AC", "AS", "KC", "KD"])
      );
    });

    it("should return false if its not full house", () => {
      const res = checkFullHouse(["AD", "KC"], ["AC", "KD", "3S", "2S", "4D"]);

      expect(res.isFullHouse).toBe(false);
      expect(res.playerHand).toEqual([]);
    });
  });

  describe("checking flush", () => {
    it("should return true if its flush", () => {
      const res = checkFlush(["2S", "5S"], ["AD", "KC", "AS", "10S", "7S"]);

      expect(res.isFlush).toBe(true);
      expect(res.playerHand).toEqual(
        expect.arrayContaining(["2S", "5S", "10S", "7S", "AS"])
      );
    });

    it("should return false if its not flush", () => {
      const res = checkFlush(["2S", "5S"], ["AD", "KC", "AS", "10S", "7H"]);

      expect(res.isFlush).toBe(false);
      expect(res.playerHand).toEqual([]);
    });
  });

  describe("checking straight", () => {
    it("should return true if its straight", () => {
      const res = checkStraight(["2S", "3H"], ["7D", "5S", "AH", "JD", "4H"]);

      expect(res.isStraight).toBe(true);
      expect(res.playerHand).toEqual(
        expect.arrayContaining(["2S", "3H", "AH", "5S", "4H"])
      );
    });

    it("should return false if its not straight", () => {
      const res = checkStraight(["2S", "3H"], ["6D", "5S", "KH", "JD", "KH"]);

      expect(res.isStraight).toBe(false);
      expect(res.playerHand).toEqual([]);
    });
  });

  describe("checking three of a kind", () => {
    it("should return true if its three of a kind", () => {
      const res = checkThreeOfKind(
        ["KD", "AD"],
        ["KH", "KS", "2S", "4H", "JD"]
      );

      expect(res.isThreeOfKind).toBe(true);
      expect(res.playerHand).toEqual(
        expect.arrayContaining(["KD", "KH", "KS", "AD", "JD"])
      );
    });

    it("should return false if its not three of a kind", () => {
      const res = checkThreeOfKind(
        ["KD", "AD"],
        ["KH", "9S", "2S", "4H", "JD"]
      );

      expect(res.isThreeOfKind).toBe(false);
      expect(res.playerHand).toEqual([]);
    });
  });

  describe("checking two pairs", () => {
    it("should return true if its two pair", () => {
      const res = checkTwoPair(["9D", "7D"], ["AS", "9S", "AD", "7S", "4D"]);

      expect(res.isTwoPair).toBe(true);
      expect(res.playerHand).toEqual(
        expect.arrayContaining(["AS", "AD", "9D", "9S"])
      );
    });

    it("should return false if its not two pairs", () => {
      const res = checkTwoPair(["9D", "7D"], ["KS", "9S", "AD", "2S", "4D"]);

      expect(res.isTwoPair).toBe(false);
      expect(res.playerHand).toEqual([]);
    });
  });

  describe("checking one pair", () => {
    it("should return true if its one pair", () => {
      const res = checkOnePair(["9S", "7D"], ["KH", "KD", "2S", "3S", "8D"]);

      expect(res.isOnePair).toBe(true);
      expect(res.playerHand).toEqual(
        expect.arrayContaining(["KD", "KH", "9S", "8D", "7D"])
      );
    });

    it("should return false if its not one pair", () => {
      const res = checkOnePair(["9S", "7D"], ["KH", "AD", "2S", "3S", "8D"]);

      expect(res.isOnePair).toBe(false);
      expect(res.playerHand).toEqual([]);
    });
  });

  describe("checking high card", () => {
    it("should return sorted cards", () => {
      const res = checkHighCard(["9D", "7D"], ["JH", "2S", "QS", "AC", "3D"]);

      expect(res).toEqual(["AC", "QS", "JH", "9D", "7D"]);
    });
  });
});

describe("check what card combinations player has", () => {
  it("should return correct card combination that player has", () => {
    const res = checkCardCombination(
      ["AD", "QD"],
      ["2S", "5D", "3D", "4D", "6H"]
    );

    expect(res.combination).toBe("Flush");
  });
});
