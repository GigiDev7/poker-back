import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  player1: {
    email: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    id: {
      type: mongoose.Types.ObjectId,
    },
    chipCount: {
      type: Number,
    },
    cards: {
      type: [String],
      default: [],
    },
    combination: {
      cards: [String],
      combination: String,
    },
    action: {
      actionType: {
        type: String,
        enum: ["call", "check", "raise", "fold", "all-in"],
      },
      actionChips: {
        type: Number,
        default: 0,
      },
    },
  },
  player2: {
    email: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    id: {
      type: mongoose.Types.ObjectId,
    },
    chipCount: {
      type: Number,
    },
    cards: {
      type: [String],
      default: [],
    },
    combination: {
      cards: [String],
      combination: String,
    },
    action: {
      actionType: {
        type: String,
        enum: ["call", "check", "raise", "fold", "all-in"],
      },
      actionChips: {
        type: Number,
        default: 0,
      },
    },
  },
  pot: {
    type: Number,
    required: true,
    default: 0,
  },
  playerTurn: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cards: {
    type: [String],
    default: [],
  },
  tableId: {
    type: String,
    required: true,
  },
  lastAction: {
    type: String,
    enum: ["call", "check", "raise", "fold", "all-in"],
  },
});

tableSchema.index({ tableId: 1 });

const Table = mongoose.model("Table", tableSchema);

export default Table;
