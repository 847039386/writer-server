const Topic = require('./topic');
const Admin = require('./admin');
const Book = require('./book');
const Category = require('./category');
const User = require('./user');
const UserAuth = require('./user_auth');
const Drama = require('./drama');
const Comment = require('./comment');
const Chapter = require('./chapter')
const Relation = require('./relation')
const DramaLike  = require('./drama_like')
const UserNotify  = require('./user_notify')

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
    DramaLike ,
    UserNotify
}