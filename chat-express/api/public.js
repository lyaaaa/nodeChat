const express = require('express');
const router = express.Router();
const formidable = require('formidable')
const fs = require('fs');
require('../db/connect.js');

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