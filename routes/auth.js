const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body,header, validationResult, query} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "RUSHIMYNOTEBOOK124"
const fetchUser = require('../middleware/getUser')

//api to create new user
router.post('/createUser',[
   body('name', "name should be of atleast 3 characters").isLength({min:3}),
   body('email', "invalid email").isEmail(),
   body('password', "password should be atleast of 5 characters").isLength({min: 5})
], async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
   }
   try{
   //checks if user exists in db  
   let user = await User.findOne({email: req.body.email});
   if(user){
      return res.status(409).json({"Error":"User already exists with same email. Use different EmailId"})
   }
   const salt = await bcrypt.genSalt(10);
   const password = await bcrypt.hash(req.body.password, salt);
   user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: password
   })
   data = {
      "user":{
         "id":user.id
      }
   }
   const authToken = jwt.sign(data,JWT_SECRET)
   return res.status(200).json({authToken})
   }
   catch(error){
      console.log(error)
      return res.status(500).json({"error":"some error occured"})
   }
});

//api to login
router.post('/login',[
   body('email', "invalid email").isEmail(),
   body('password', "password cannot be blank").exists()
], async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.send({ errors: errors.array() });
   }
   try{
   //checks if user exists in db   
   let user = await User.findOne({email: req.body.email});
   if(!user){
      return res.status(409).json({"Error":"Pls use correct email and password"})
   }
   const verifyPassword = await bcrypt.compare(req.body.password, user.password)
   if (verifyPassword){
      data = {
         "user":{
            "id":user.id
         }
      }
      const authToken = jwt.sign(data,JWT_SECRET)
      return res.status(200).json({authToken})
   }
   return res.status(409).json({"Error":"Pls use correct email and password"})
   }
   catch(error){
      console.log(error)
      return res.status(500).json({"error":"some error occured"})
   }
});

//api to get loggedin user details
router.get('/getUserDetails',fetchUser,async (req,res)=>{
   try{
      const user_id = req.user.id
      let user = await User.findById(user_id).select("-password")
      return res.status(200).json(user)
   }
   catch(error){
      console.log(error)
      return res.status(500).json({"error":"some error occured"}) 
   }
})
module.exports = router