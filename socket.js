import { Server } from "socket.io";
import Table from "./models/table.js";
import { generateCards, chooseRandomCard } from "./utils/cards.js";

const cards = generateCards();

const io = new Server(8888, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", async (user, tableId) => {
    socket.join(tableId);
    const table = await Table.findOne({ tableId });
    if (!table) {
      const newTable = await Table.create({
        tableId,
        player1: { ...user, chipCount: 9950 },
        playerTurn: user.id,
      });
    } else if (table && !table.player2.email) {
      table.player2 = { ...user, chipCount: 9900 };
      const playingCards = chooseRandomCard(cards, [], 7);
      table.player1.cards = [playingCards[0], playingCards[1]];
      table.player2.cards = [playingCards[2], playingCards[3]];
      table.cards = playingCards.slice(4);
      table.player1.action.actionChips = 50;
      table.player2.action.actionChips = 100;
      table.pot = 150;
      await table.save();
      io.to(tableId).emit("table-data", table);
    } else {
      socket.to(tableId).emit("table-data", table);
    }
  });

  socket.on("action", async (tableId, actionData) => {
    const table = await Table.findOne({ tableId });
    if (actionData.action === "fold") {
      const playingCards = chooseRandomCard(cards, [], 7);
      table.player1.cards = [playingCards[0], playingCards[1]];
      table.player2.cards = [playingCards[2], playingCards[3]];
      table.cards = playingCards.slice(4);

      if (table.playerTurn.toString() === table.player1.id.toString()) {
        table.playerTurn = table.player2.id;
        table.player1.action.actionChips = table.bigBlind;
        table.player2.action.actionChips = table.smallBlind;
        table.player1.chipCount -= table.player1.action.actionChips;
        table.player2.chipCount =
          table.player2.chipCount +
          table.pot -
          table.player2.action.actionChips;
      } else {
        table.playerTurn = table.player1.id;
        table.player1.action.actionChips = table.smallBlind;
        table.player2.action.actionChips = table.bigBlind;
        table.player2.chipCount -= table.player2.action.actionChips;
        table.player1.chipCount =
          table.player1.chipCount +
          table.pot -
          table.player1.action.actionChips;
      }
      table.pot = table.smallBlind + table.bigBlind;
      await table.save();
      io.to(tableId).emit("table-data", table);
    }
  });
});
