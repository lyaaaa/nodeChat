const express = require('express');
const app = express();
var bodyParser = require("body-parser");  
const login = require('./api/login.js')
const public = require('./api/public.js')
const port = 3000;
const jwtAuth = require('./api/jwtAuth.js')

var Server = app.listen(port);
var io = require('socket.io');
var ws = io.listen(Server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));  

app.use('/static',express.static('public'))

app.use(jwtAuth)
app.use('/login',login)
app.use('/public', public) 

app.use((err, req, res, next) => {
    if(err){
        if(err.name == 'UnauthorizedError'){
            res.status(err.status || 500);
            res.json({
                code: -1,
                errMsg: '用户没有登录'
            })
        }
    }else{
        console.log('req', req)
    }
})


ws.on('connection', function(socket){
    console.log('用户已经连接');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('receiveMsg', function(msg){
      console.log('message: ' + msg);
      socket.emit('sendMsg', msg);
    }); 
});