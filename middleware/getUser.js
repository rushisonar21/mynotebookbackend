const jwt = require('jsonwebtoken')
const JWT_SECRET = "RUSHIMYNOTEBOOK124"

const fetchUser = (req, res, next)=> {
    const token = req.header('auth_token')
    if(!token){
       return res.status(400).send("Add auth_token to header")
    }
    try{
    //descriptes the jwt token and gives you the data you stored in it back
    const data = jwt.verify(token,JWT_SECRET)
    req.user = data.user
    next();    
    }
    catch(error){
        return res.status(401).send("Invalid authToken") 
    }

}

module.exports = fetchUser