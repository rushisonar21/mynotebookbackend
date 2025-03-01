const express = require('express')
const fetchUser = require('../middleware/getUser')
const router = express.Router()
const Notes = require('../models/Notes')
const { body,header, validationResult} = require('express-validator')


//This api will fetch all notes for logged in user
router.get('/fetchAllNotes',fetchUser, async (req,res)=>{
    try{
    let notes = await Notes.find({user: req.user.id})
    return res.status(200).json(notes)
    }
    catch(error){
        return res.status(500).send("Some error occured")
    }
})

//This is api to add note for loggedin user
router.post('/addNote',fetchUser,[
    body('title',"title must be atleast 3 chars").isLength({min:3}),
    body('description', "description must be atleast 5 chars").isLength({min:5})
], async (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    try{
        let user_id = await req.user.id
        let notes = await Notes.create({
            user: req.user.id,
            title: req.body.title,
            description: req.body.description,
            tag: req.tag
        })
        return res.status(200).json(notes)
    }
    catch(error){
        console.log(error.message)
        return res.status(500).send("Some error occured")
    }
})

//This is api to update note for loggedin user(can only update his own note)
router.put('/updateNote/:id',fetchUser,[
    body('title',"title must be atleast 3 chars").isLength({min:3}),
    body('description', "description must be atleast 5 chars").isLength({min:5})
], async (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }
    try{
        let user_id = req.user.id
        let newNote = {}
        let {title, description, tag} = req.body
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}
        let note = await Notes.findById(req.params.id)
        if(!note){return res.status(409).send("Note not found")}
        //checks if the user updating the note and the owner of note are same user
        if(note.user.toString() !== user_id){
            return res.status(401).send("Not allowed")
        }
        //the new:true tells mongoose to return the updated note ,by default it returns the older version
        let updatedNote = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        return res.status(200).json(updatedNote)
    }
    catch(error){
        console.log(error)
        return res.status(500).send("Some error occured")
    }
})

//This api is for delete Note only by loggedin user(can only delete his own note)
router.delete('/deleteNote/:id', fetchUser,async (req,res)=>{
    try{
    let user_id = req.user.id
    let note = await Notes.findById(req.params.id)
    if(!note){return res.status(404).send("Note not found")}
    //checks if the user deleting the note and the owner of note are same user
    if(note.user.toString() !== user_id){
        return res.status(401).send("Not allowed")
    }
    await Notes.findByIdAndDelete(req.params.id)
    return res.status(200).send("Note deleted successfully!!")
    }
    catch(error){
        console.log(error)
        return res.status(500).send("Some error occured")  
    }
})
module.exports = router