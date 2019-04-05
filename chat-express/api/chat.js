const express = require('express');
const router = express.Router();
const {
    chatRoomModel
} = require('../db/model.js');
const {
    checkToken
} = require('../common/common');
// 查询当前所有聊天室
router.post('/allRooms', function (req, res) {
    chatRoomModel.find({}, function (err, data) {
        if (!err) {
            res.json(data)
        } else {
            res.json(err)
        }
    })
})

// 获取聊天室聊天记录
router.post('/chatRecord', function (req, res) {
    chatRoomModel.findOne({
        roomId: req.body.roomId
    }, function (err, data) {
        if (!err) {
            res.json({
                code: 0,
                data: data.chatRecord
            })
        }
    })
})

// 退出聊天室
router.post('/outChatRoom', async function (req, res) {
    try {
        let userInfo = await checkToken(req.body.userToken);
        chatRoomModel.updateOne({
            roomId: req.body.roomId
        }, {
            $pull: {
                'roomUsers': {
                    'userId': userInfo._id
                }
            }
        }, function (err, data) {
            if (!err) {
                res.json({
                    code: 0,
                    data: '退出成功'
                })
            }
        })
    } catch (err) {
        res.json({
            code: -1,
            data: data
        })
    }

})


module.exports = router;