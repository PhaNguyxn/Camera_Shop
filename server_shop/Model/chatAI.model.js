const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({

  idUser: String,

  messages: [
    {
      role: String,
      text: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

});

module.exports = mongoose.model("ChatAI", ChatSchema);