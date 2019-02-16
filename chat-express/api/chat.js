const express = require('express');
const router = express.Router();
const {
    chatRoomModel
} = require('../db/model.js');

// 查询当前所有聊天室
router.post('/allRooms', function(req, res){
    chatRoomModel.find({}, function(err, data){
        if(!err){
            res.json(data)
        }else{
            res.json(err)
        }
    })
})


module.exports = router;