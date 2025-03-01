const mongoose = require('mongoose')
const mongoURI = 'mongodb://localhost:27017/myNotebook'

const connectToMongoose =async ()=>{
    result = await mongoose.connect(mongoURI)
    return (console.log("successfy connected mongoose"))
}

module.exports = connectToMongoose;