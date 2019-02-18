// 聊天数据相关操作
const { chatRoomModel } = require('./model.js');
const { checkToken, timeStr } = require('../common/common.js');

// 保存聊天消息到数据库
function saveChatMsg(socket, msgData){
    // sendTxt:  发送内容;   roomId: 聊天室id
    checkToken(msgData.userToken).then(res => {
        let chatInfo = {
            userInfo: res,
            msgTimeStr: timeStr('YY-M-D-detail'),
            msgTimestamp: (new Date()).getTime(),
            msgInfo: msgData.sendTxt
        }
        chatRoomModel.updateOne({ roomId: msgData.roomId }, { $push: { chatRecord: chatInfo } }, (err, data) => {
            if(!err){
                socket.broadcast.to(msgData.roomId).emit('receiveMsg', chatInfo)
            }
        })
    })
}

// 用户加入聊天室
function joinChatRoom(socket, data){
   checkToken(data.userToken).then(userInfo =>{
       chatRoomModel.findOne({
                       roomId: data.roomId,
                       roomUsers: {$elemMatch: {userName: userInfo.name} }
                    })
                    .exec(function(err, users){
                        if(!err){
                            if(!users){
                                // 不在当前聊天室需要添加到数据库
                                let roomUser = {
                                    userName: userInfo.name,
                                    userId: userInfo._id,
                                    headimg: userInfo.headimg
                                }
                                chatRoomModel.updateOne({ roomId: data.roomId }, { $push: { roomUsers: roomUser } }, (err, data) => {
                                    if(!err){
                                        socket.broadcast.to(data.roomId).emit('receiveMsg', '有人加入了聊天室')      
                                    }
                                })
                            }
                        }
                    })
   })
}

module.exports = { saveChatMsg, joinChatRoom }