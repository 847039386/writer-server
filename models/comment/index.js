const mongoose = require("mongoose");
const CommentSchema = require('./model')

module.exports = mongoose.model("comment", CommentSchema);