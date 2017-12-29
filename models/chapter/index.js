const mongoose = require("mongoose");
const ChapterSchema = require('./model')

module.exports = mongoose.model("chapter", ChapterSchema);