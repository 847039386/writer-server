const mongoose      = require("mongoose");
const config        = require('../config')
mongoose.connect(`mongodb://${config.db.host || 'localhost'}:${config.db.port || 27017 }/${config.db.database || 'drama'}`, {
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
const ReplyComment  = require('./reply_comment');
const Drama         = require('./drama');
const Topic         = require('./topic');
const User          = require('./user');
const Relation      = require('./relation');
const Collect      = require('./collect');
const UserNotify      = require('./user_notify');
const Log      = require('./log');


exports.Admin           = Admin;
exports.Book            = Book;
exports.Category        = Category;
exports.Chapter         = Chapter;
exports.Comment         = Comment;
exports.Drama           = Drama;
exports.Topic           = Topic;
exports.User            = User;
exports.Relation        = Relation;
exports.Collect       = Collect;
exports.UserNotify      = UserNotify
exports.ReplyComment    = ReplyComment;
exports.Log    = Log;