const mongoose = require("mongoose");
const UserAuthSchema = require('./model')

module.exports = mongoose.model("user_auth", UserAuthSchema);