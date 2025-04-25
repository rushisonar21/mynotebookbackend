const mongoose = require('mongoose')
const mongoURI = 'mongodb+srv://myNoteBook:x8G6obwLYlMonfB7@cluster0.sjlxdny.mongodb.net/'

const connectToMongoose =async ()=>{
    result = await mongoose.connect(mongoURI)
    return (console.log("successfy connected mongoose"))
}

module.exports = connectToMongoose;