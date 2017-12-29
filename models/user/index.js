const mongoose = require("mongoose");
const UserSchema = require('./model')

module.exports = mongoose.model("user", UserSchema);