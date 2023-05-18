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
        player1: { ...user, chipCount: 10000 },
        playerTurn: user.id,
      });
    } else if (table && !table.player2.email) {
      table.player2 = { ...user, chipCount: 10000 };
      const playingCards = chooseRandomCard(cards, [], 7);
      table.player1.cards = [playingCards[0], playingCards[1]];
      table.player2.cards = [playingCards[2], playingCards[3]];
      table.cards = playingCards.slice(4);
      await table.save();
      io.to(tableId).emit("table-data", table);
    } else {
      socket.to(tableId).emit("table-data", table);
    }
  });
});
