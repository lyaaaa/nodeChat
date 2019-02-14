const mongoose = require('./connect.js');

var UserSchema = new mongoose.Schema({ //定义数据模型
    name: {
        type: String,
        require: true
    },
    pwd: {
        type: String,
        require: true
    },
    birthday: {
        type: String
    },
    headimg: {
       type: String
    }
}, { collection: 'chat'});





const userModel = mongoose.model('user', UserSchema)

module.exports = { userModel }