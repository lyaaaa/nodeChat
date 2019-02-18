const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const {
    userModel
} = require('../db/model.js');

const { checkToken, timeStr } = require('../common/common.js');


function getUser(name, pwd) {
    return new Promise((resolve, reject) => {
        userModel.findOne({
            name: name
        }, function (err, data) {
            if (err) {

            } else {
                if (!data) {
                    reject({
                        code: -1,
                        msg: '没有用户'
                    })
                } else {
                    if (pwd == data.pwd) {
                        let tokenName = {
                            name: data.name
                        }
                        let token = jwt.sign(tokenName, 'secret', {
                            expiresIn : 60 * 60 * 24 // 授权时效24小时
                        });
                        resolve({
                            code: 0,
                            data: data,
                            token: token
                        })
                    } else {
                        reject({
                            code: 1,
                            msg: '密码错误'
                        })
                    }
                }
            }
        })
    })
}
  
// 登录
router.post('/login', async function (req, res) {
    try {
        let data = await getUser(req.body.name, req.body.pwd)
        res.json(data)
    } catch (err) {
        res.json(err)
    }
})

// 注册
router.post('/register', function (req, res) {
    userModel.find({
        name: req.body.name
    }, function (err, data) {
        if(err){
            res.json(err)
        }
        if (data.length == 0) {
            let birthday = timeStr('YY-M-D')
            var newUser = new userModel({
                name: req.body.name,
                pwd: req.body.pwd,
                birthday: birthday
            })
            newUser.save(function (error) {
                if (error) {
                    res.json({
                        code: -2,
                        errMsg: '注册失败'
                    })
                } else {
                    res.json({
                        code: 0,
                        errMsg: '注册成功'
                    })
                }
            })
        } else {
            res.json({
                code: -3,
                errMsg: '已有该用户'
            })
        }
    })
})


// 获取用户信息
router.post('/myInfo',async function(req, res){
    let token = req.headers.authorization.split('Bearer ')[1]
    try {
      let userData = await checkToken(token)
      res.json({
        code: 0,
        data: userData
      })
    } catch(err){
        res.json({
            code: -1,
            data: data
        })
    }
})

// 编辑用户头像
router.post('/editHeadimg',async function(req, res){
    try {
      let token = req.headers.authorization.split('Bearer ')[1]
      let decoded = await checkToken(token)
      userModel.updateOne({'name': decoded.name}, { 'headimg': req.body.headimg }, (err, dbres) => {
          if(err){
            res.json({
                code: -4,
                errMsg: '修改失败'
            })
          }else{
            res.json({
                code: 0,
                headimg: req.body.headimg
            }) 
          }
      })
    } catch(err){
      res.json({
          code: -1,
          data: err
      })
    }
})

module.exports = router;