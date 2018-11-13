const mongoose = require("mongoose");
const LogSchema = require('./model')

module.exports = mongoose.model("log", LogSchema);