const mongoose = require("mongoose");
const ReplyCommentSchema = require('./model')

module.exports = mongoose.model("reply_comment", ReplyCommentSchema);