// 公用方法

const jwt = require('jsonwebtoken');
const { userModel } = require('../db/model.js');

// 校验用户token, 并返回用户信息
function checkToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secret', (err, decoded) => {
            if(err){
                reject({
                    errMsg: 'token失效'
                })
            }else{
                userModel.findOne({name: decoded.name},{
                    pwd: 0
                }, (err, userInfo) => {
                    if(!err){
                        resolve(userInfo)
                    }else{
                        reject({
                            errMsg: '没有该用户'
                        })
                    }
                })
            }
        })
    })
}

// 获取时间字符串
function timeStr(type){
    let nowDate = new Date();
    let str = ''
    switch (type){
        case 'YY-M-D':
        str = `${nowDate.getFullYear()}-${nowDate.getMonth() + 1}-${nowDate.getDate()}`
        break;
        case 'YY-M-D-detail':
        str = `${nowDate.getFullYear()}-${nowDate.getMonth() + 1}-${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`
        break;
    }
    return str
}

module.exports = { checkToken, timeStr }
