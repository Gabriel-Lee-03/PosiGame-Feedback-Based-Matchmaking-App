const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const playerSchema = new Schema(
  {
    _id: {  
      name: {
        type: String,
        required: true,
      }
    },
    gameId: {
      type: String,
      required: true,
    },
    friendliness: {
      type: Number,
      required: true,
    },
    goodTeammate: {
      type: Boolean,
      default: true,
    },
  }, 
  { 
    collection : 'test_players' 
  }
);

module.exports =  model("TestPlayer", playerSchema);
