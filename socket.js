import { Server } from "socket.io";
import Table from "./models/table.js";
import { generateCards, chooseRandomCard } from "./utils/cards.js";
import {
  checkHandsAndGetWinner,
  freshHandStart,
} from "./utils/gameActionHelpers.js";

const cards = generateCards();

const io = new Server(8888, {
  cors: {
    origin: ["http://localhost:5173", "https://react-wsop.netlify.app"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join", async (user, tableId) => {
    socket.join(tableId);
    const table = await Table.findOne({ tableId });
    if (!table) {
      await Table.create({
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

    let wasHandFinished = false;

    //fold
    if (actionData.action === "fold") {
      freshHandStart(table);
    }

    //all in
    if (actionData.action === "all-in") {
      table.lastAction = "all-in";
      if (table.playerTurn.toString() === table.player1.id.toString()) {
        table.player1.action.actionChips += table.player1.chipCount;
        table.pot += table.player1.chipCount;
        table.player1.chipCount = 0;
        table.playerTurn = table.player2.id;
      } else {
        table.player2.action.actionChips += table.player2.chipCount;
        table.pot += table.player2.chipCount;
        table.player2.chipCount = 0;
        table.playerTurn = table.player1.id;
      }
    }

    //call
    if (actionData.action === "call") {
      if (!table.lastAction) {
        table.lastAction = "call";
        if (table.playerTurn.toString() === table.player1.id.toString()) {
          table.playerTurn = table.player2.id;
          table.player1.action.actionChips = table.bigBlind;
          table.player1.chipCount -= table.bigBlind - table.smallBlind;
          table.pot += table.bigBlind - table.smallBlind;
        } else {
          table.playerTurn = table.player1.id;
          table.player2.action.actionChips = table.bigBlind;
          table.player2.chipCount -= table.bigBlind - table.smallBlind;
          table.pot += table.bigBlind - table.smallBlind;
        }
      } else if (table.lastAction === "all-in") {
        if (table.playerTurn.toString() === table.player1.id.toString()) {
          table.playerTurn = table.player2.id;
          if (
            table.player2.action.actionChips ===
            table.player1.action.actionChips + table.player1.chipCount
          ) {
            table.pot += table.player1.chipCount;
            table.player1.action.actionChips = 0;
            table.player1.chipCount = 0;
            table.player2.action.actionChips = 0;
          } else if (
            table.player2.action.actionChips >
            table.player1.action.actionChips + table.player1.chipCount
          ) {
            table.pot += table.player1.chipCount;
            table.player2.chipCount =
              table.player2.action.actionChips -
              (table.player1.action.actionChips + table.player1.chipCount);
            table.pot -= table.player2.chipCount;
            table.player1.action.actionChips = 0;
            table.player1.chipCount = 0;
            table.player2.action.actionChips = 0;
          } else if (
            table.player2.action.actionChips <
            table.player1.action.actionChips + table.player1.chipCount
          ) {
            table.pot +=
              table.player2.action.actionChips -
              table.player1.action.actionChips;
            table.player1.chipCount =
              table.player1.action.actionChips +
              table.player1.chipCount -
              table.player2.action.actionChips;
            table.player1.action.actionChips = 0;
            table.player2.action.actionChips = 0;
          }
        } else {
          table.playerTurn = table.player1.id;
          if (
            table.player1.action.actionChips ===
            table.player2.action.actionChips + table.player2.chipCount
          ) {
            table.pot += table.player2.chipCount;
            table.player2.action.actionChips = 0;
            table.player2.chipCount = 0;
            table.player1.action.actionChips = 0;
          } else if (
            table.player1.action.actionChips >
            table.player2.action.actionChips + table.player2.chipCount
          ) {
            table.pot += table.player2.chipCount;
            table.player1.chipCount =
              table.player1.action.actionChips -
              (table.player2.action.actionChips + table.player2.chipCount);
            table.pot -= table.player1.chipCount;
            table.player2.action.actionChips = 0;
            table.player2.chipCount = 0;
            table.player1.action.actionChips = 0;
          } else if (
            table.player1.action.actionChips <
            table.player2.action.actionChips + table.player2.chipCount
          ) {
            table.pot +=
              table.player1.action.actionChips -
              table.player2.action.actionChips;
            table.player2.chipCount =
              table.player2.action.actionChips +
              table.player2.chipCount -
              table.player1.action.actionChips;
            table.player2.action.actionChips = 0;
            table.player1.action.actionChips = 0;
          }
        }

        table.lastAction = "";
        if (table.cards.length !== 5) {
          const resultCards = chooseRandomCard(
            cards,
            [...table.cards, ...table.player1.cards, ...table.player2.cards],
            5 - table.cards.length
          );
          table.cards.push(...resultCards);
        }
        io.to(tableId).emit("table-data", table);

        //finished one hand
        wasHandFinished = true;
        checkHandsAndGetWinner(table);
      } else if (table.lastAction === "raise") {
        if (table.playerTurn.toString() === table.player1.id.toString()) {
          table.playerTurn = table.player2.id;
          if (
            table.player2.action.actionChips >=
            table.player1.chipCount + table.player1.action.actionChips
          ) {
            table.pot += table.player1.chipCount;
            table.player1.action.actionChips = 0;
            table.player1.chipCount = 0;
            table.player2.action.actionChips = 0;

            table.lastAction = "";
            if (table.cards.length !== 5) {
              const resultCards = chooseRandomCard(
                cards,
                [
                  ...table.cards,
                  ...table.player1.cards,
                  ...table.player2.cards,
                ],
                5 - table.cards.length
              );
              table.cards.push(...resultCards);
            }
            io.to(tableId).emit("table-data", table);

            //finished one hand
            wasHandFinished = true;
            checkHandsAndGetWinner(table);
          } else {
            table.pot +=
              table.player2.action.actionChips -
              table.player1.action.actionChips;
            table.player1.chipCount -=
              table.player2.action.actionChips -
              table.player1.action.actionChips;
            table.player1.action.actionChips = 0;
            table.player2.action.actionChips = 0;

            if (table.cards.length === 5) {
              table.lastAction = "";
              io.to(tableId).emit("table-data", table);
              //finished one hand
              wasHandFinished = true;
              checkHandsAndGetWinner(table);
            } else {
              const resultCards = chooseRandomCard(cards, [
                ...table.cards,
                ...table.player1.cards,
                ...table.player2.cards,
              ]);
              table.cards.push(resultCards[0]);
            }
          }
        } else {
          table.playerTurn = table.player1.id;
          if (
            table.player1.action.actionChips >=
            table.player2.chipCount + table.player2.action.actionChips
          ) {
            table.pot += table.player2.chipCount;
            table.player2.action.actionChips = 0;
            table.player2.chipCount = 0;
            table.player1.action.actionChips = 0;

            table.lastAction = "";
            if (table.cards.length !== 5) {
              const resultCards = chooseRandomCard(
                cards,
                [
                  ...table.cards,
                  ...table.player1.cards,
                  ...table.player2.cards,
                ],
                5 - table.cards.length
              );
              table.cards.push(...resultCards);
            }
            io.to(tableId).emit("table-data", table);

            //finished one hand
            wasHandFinished = true;
            checkHandsAndGetWinner(table);
          } else {
            table.pot +=
              table.player1.action.actionChips -
              table.player2.action.actionChips;
            table.player2.chipCount -=
              table.player1.action.actionChips -
              table.player2.action.actionChips;
            table.player2.action.actionChips = 0;
            table.player1.action.actionChips = 0;

            if (table.cards.length === 5) {
              table.lastAction = "";
              io.to(tableId).emit("table-data", table);

              wasHandFinished = true;
              checkHandsAndGetWinner(table);
            } else {
              const resultCards = chooseRandomCard(cards, [
                ...table.cards,
                ...table.player1.cards,
                ...table.player2.cards,
              ]);
              table.cards.push(resultCards[0]);
            }
          }
        }

        table.lastAction = "";
      }
    }

    //check
    if (actionData.action === "check") {
      if (table.lastAction === "check") {
        if (table.playerTurn.toString() === table.player1.id.toString()) {
          table.playerTurn = table.player2.id;
        } else {
          table.playerTurn = table.player1.id;
        }
        table.lastAction = "";
        if (table.cards.length === 5) {
          table.lastAction = "";
          io.to(tableId).emit("table-data", table);

          wasHandFinished = true;
          checkHandsAndGetWinner(table);
        } else {
          const resultCards = chooseRandomCard(cards, [
            ...table.cards,
            ...table.player1.cards,
            ...table.player2.cards,
          ]);
          table.cards.push(resultCards[0]);
        }
      } else if (!table.lastAction) {
        if (table.playerTurn.toString() === table.player1.id.toString()) {
          table.playerTurn = table.player2.id;
        } else {
          table.playerTurn = table.player1.id;
        }
        table.lastAction = "check";
      } else if (table.lastAction === "call") {
        if (table.playerTurn.toString() === table.player1.id.toString()) {
          table.playerTurn = table.player2.id;
        } else {
          table.playerTurn = table.player1.id;
        }
        const resultCards = chooseRandomCard(cards, [
          ...table.cards,
          ...table.player1.cards,
          ...table.player2.cards,
        ]);
        table.player1.action.actionChips = 0;
        table.player2.action.actionChips = 0;
        table.cards.push(resultCards[0]);
        table.lastAction = "";
      }
    }

    //raise
    if (actionData.action === "raise") {
      if (table.playerTurn.toString() === table.player1.id.toString()) {
        table.playerTurn = table.player2.id;
        table.pot =
          table.pot - table.player1.action.actionChips + actionData.chips;
        table.player1.chipCount =
          table.player1.chipCount +
          table.player1.action.actionChips -
          actionData.chips;
        table.player1.action.actionChips = actionData.chips;
      } else {
        table.playerTurn = table.player1.id;
        table.pot =
          table.pot - table.player2.action.actionChips + actionData.chips;
        table.player2.chipCount =
          table.player2.chipCount +
          table.player2.action.actionChips -
          actionData.chips;
        table.player2.action.actionChips = actionData.chips;
      }

      table.lastAction = "raise";
    }

    await table.save();

    if (!wasHandFinished) {
      io.to(tableId).emit("table-data", table);
    } else {
      io.to(tableId).emit("finished-hand");
      setTimeout(() => {
        io.to(tableId).emit("table-data", table);
      }, 3000);
    }

    wasHandFinished = false;
  });
});
