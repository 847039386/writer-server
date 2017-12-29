const mongoose = require("mongoose");
const CategorySchema = require('./model')

module.exports = mongoose.model("category", CategorySchema);