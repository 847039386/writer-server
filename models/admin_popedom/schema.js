const mongoose = require("mongoose");

const AdminPopedomSchema = new mongoose.Schema({
    name : { type :String },                // 权限名称
});

module.exports = AdminPopedomSchema;

