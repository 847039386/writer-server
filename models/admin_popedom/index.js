const mongoose = require("mongoose");
const AdminPopedomSchema = require('./model')

module.exports = mongoose.model("admin_popedom", AdminPopedomSchema);