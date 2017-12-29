const mongoose = require("mongoose");
const TopicSchema = require('./model')

module.exports = mongoose.model("topic", TopicSchema);