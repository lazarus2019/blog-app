const mongoose = require("mongoose");
const schemaOptions = require("../../config/model/schemaOptions");

const emailMsgSchema = new mongoose.Schema(
  {
    fromEmail: {
      type: String,
      required: true,
    },
    toEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  schemaOptions
);

// compile
const EmailMsg = mongoose.model("EmailMsg", emailMsgSchema);

module.exports = EmailMsg;
