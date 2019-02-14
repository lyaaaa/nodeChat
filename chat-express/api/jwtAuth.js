const expressJwt = require("express-jwt");

const jwtAuth = expressJwt({secret: 'secret'}).unless({path: [
                                                "/login/login", 
                                                "/login/register"
                                             ]});

module.exports = jwtAuth;
