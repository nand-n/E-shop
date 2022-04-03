const expressJwt = require('express-jwt')

function authJwt(){
   const secret= process.env.SECRET
    return expressJwt({
        secret,
        algorithms:['RS256']
    })
}

module.exports = authJwt