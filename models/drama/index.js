const mongoose = require("mongoose");
const DramaSchema = require('./model')

module.exports = mongoose.model("drama", DramaSchema);