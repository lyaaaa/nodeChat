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

var chatRoomSchema = new mongoose.Schema({
    roomName: {
        type: String
    },
    roomId: {
        type: String
    },
    roomUsers: {
        type: Array
    },
    chatRecord: {
        type: Array
    }
}, { collection: 'chatRoom'});



const userModel = mongoose.model('user', UserSchema)
const chatRoomModel = mongoose.model('room', chatRoomSchema)

module.exports = { userModel, chatRoomModel }