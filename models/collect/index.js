const mongoose = require("mongoose");
const CollectSchema = require('./model')

module.exports = mongoose.model("collect", CollectSchema);