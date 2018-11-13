const Topic = require('./topic');
const Admin = require('./admin');
const Book = require('./book');
const Category = require('./category');
const User = require('./user');
const UserAuth = require('./user_auth');
const Drama = require('./drama');
const Comment = require('./comment');
const ReplyComment = require('./reply_comment');
const Chapter = require('./chapter')
const Relation = require('./relation')
const Collect  = require('./collect')
const UserNotify  = require('./user_notify')
const Log  = require('./log')

module.exports = {
    Topic ,
    Admin ,
    Book ,
    Category ,
    User ,
    UserAuth ,
    Drama ,
    Comment ,
    Chapter ,
    Relation ,
    Collect ,
    UserNotify,
    ReplyComment,
    Log
}