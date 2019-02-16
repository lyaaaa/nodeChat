const express = require('express');
const app = express();
var bodyParser = require("body-parser");

// api接口
const login = require('./api/login.js');
const public = require('./api/public.js');
const chat = require('./api/chat.js');

const port = 3000;
const jwtAuth = require('./api/jwtAuth.js')
require('./db/connect.js');

const {
    chatRoomModel
} = require('./db/model.js');

var Server = app.listen(port, function (err) {
    if (!err) {
        console.log('启动成功')
    }
});
var io = require('socket.io');
var ws = io.listen(Server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/static', express.static('public'))

app.use(jwtAuth)
// api接口
app.use('/login', login)
app.use('/public', public)
app.use('/chat', chat)

app.use((err, req, res, next) => {
    if (err) {
        if (err.name == 'UnauthorizedError') {
            res.status(err.status || 500);
            res.json({
                code: -1,
                errMsg: '用户没有登录'
            })
        }
    } else {
        console.log('req', req)
    }
})


ws.on('connection', function (socket) {
    socket.on('disconnect', function () {
        // 用户断开连接;  
    });
    // 新建聊天室
    socket.on('addRoom', function (data) {
        let roomObj = {
            roomName: data.roomName,
            roomId: socket.id,
            roomUsers: [data.user]
        }
        var chatRoom = new chatRoomModel(roomObj)
        chatRoom.save(function (err) {
            if (!err) {
                socket.join(roomObj.roomId);
                ws.emit('newRoom', roomObj)
            } else {
                console.log(err)
            }
        })
    })

    socket.on('login', function (data) {
        console.log('用户已经登录')
    });
});