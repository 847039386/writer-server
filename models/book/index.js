const mongoose = require("mongoose");
const BookSchema = require('./model')

module.exports = mongoose.model("book", BookSchema);