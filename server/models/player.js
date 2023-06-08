const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gameId: {
      type: String,
      required: true,
    },
    friendliness: {
      type: Number,
      required: true,
    },
    ratingCount: {
      type: Number,
      default: true,
    },
    totalScore: {
      type: Number,
      default: true,
    },
  }, 
  { 
    collection : 'players' 
  }
);

module.exports =  model("Player", playerSchema);
