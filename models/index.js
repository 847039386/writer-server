const mongoose      = require("mongoose");
const config        = require('../config')
mongoose.connect(`mongodb://${config.db.host}:${config.db.port || 27017 }/${config.db.database}`, {
    poolSize :20,
    useMongoClient :true,
}, function (err) {
    if (err) {
        process.exit(1);
    }
});
mongoose.Promise = global.Promise;


const Admin         = require('./admin');
const Book          = require('./book');
const Category      = require('./category');
const Chapter       = require('./chapter');
const Comment       = require('./comment');
const Drama         = require('./drama');
const Topic         = require('./topic');
const User          = require('./user');
const UserAuth      = require('./user_auth');
const Relation      = require('./relation');

exports.Admin           = Admin;
exports.Book            = Book;
exports.Category        = Category;
exports.Chapter         = Chapter;
exports.Comment         = Comment;
exports.Drama           = Drama;
exports.Topic           = Topic;
exports.User            = User;
exports.UserAuth        = UserAuth;
exports.Relation        = Relation;