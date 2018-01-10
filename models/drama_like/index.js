const mongoose = require("mongoose");
const DramaLikeSchema = require('./model')

module.exports = mongoose.model("drama_like", DramaLikeSchema);