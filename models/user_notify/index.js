const mongoose = require("mongoose");
const UserNotifySchema = require('./model')

module.exports = mongoose.model("user_notify", UserNotifySchema);