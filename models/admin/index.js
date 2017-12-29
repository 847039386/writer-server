const mongoose = require("mongoose");
const AdminSchema = require('./model')

module.exports = mongoose.model("admin", AdminSchema);