const express = require('express');
const app = express();
var bodyParser = require("body-parser");  
const login = require('./api/login.js')
const public = require('./api/public.js')
const port = 3000;
const jwtAuth = require('./api/jwtAuth.js')

var Server = app.listen(port, function(err){
    if(!err){
        console.log('启动成功')
    }
});
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
    socket.on('disconnect', function(){
      console.log('a user disconnected');
    });

    socket.on('addRoom', function(data){
        console.log(data, socket.id)
    })
    
    socket.on('login', function(data){
        console.log('用户已经登录')
    });
    

 
});