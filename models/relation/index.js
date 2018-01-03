const mongoose = require("mongoose");
const RelationSchema = require('./model')

module.exports = mongoose.model("relation", RelationSchema);