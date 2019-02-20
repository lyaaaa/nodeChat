const express = require('express');
const router = express.Router();
const formidable = require('formidable')
const fs = require('fs');

// 七牛云配置
const qiniu = require('qiniu');
const ACCESS_KEY = ''
const SECRET_KEY  = ''
const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY)

var qnConfig = new qiniu.conf.Config();
// 空间对应的机房
qnConfig.zone = qiniu.zone.Zone_z0;

var formUploader = new qiniu.form_up.FormUploader(qnConfig);
var putExtra = new qiniu.form_up.PutExtra();

function upToken(){
   var options = {
    scope: '',
    expires: 7200
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  return uploadToken
}

// 上传图片到地牛云
function upFileQiniu(qnToken, key, filePath){
    formUploader.putFile(qnToken, key, filePath, putExtra, function(respErr,
        respBody, respInfo) {
        if (respErr) {
           throw respErr;
        }
        if (respInfo.statusCode == 200) {
            console.log(respBody);
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
        }
    });
}





router.post('/upimg', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err){
            res.json({
                code: -1,
                errMsg: '文件类型错误'
            })
        }
        let imgPath = files.file.path
        let imgName = files.file.name
        // var qnToken = upToken()
        // upFileQiniu(qnToken, imgName, imgPath)
        var readerStream = fs.createReadStream(imgPath);
        var writerStream = fs.createWriteStream(`public/${imgName}`);
        readerStream.pipe(writerStream);
        res.json({
            code: 0,
            data: `http://localhost:3000/static/${imgName}`
        })
    })
})

module.exports = router; 