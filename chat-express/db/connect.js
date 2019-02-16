const mongoose = require('mongoose');

const url = 'mongodb://localhost/chat';

mongoose.connect(url,{ useNewUrlParser: true });

// 连接失败
mongoose.connection.on("error", function(err){
    console.error("数据库链接失败:"+ err);
});
 
// 连接成功
mongoose.connection.on("open", function(){
    console.log("数据库链接成功");
});



module.exports = mongoose;