var Config = require('../config')
var Redis = require('ioredis');
var redis = new Redis({
    host : Config.redis.host || '127.0.0.1',
    port : Config.redis.port || 6379,
    keyPrefix : Config.redis.keyPrefix || 'drama:'
});

module.exports = () => async (ctx, next) => {
    ctx.redis = redis;
    await next()
}