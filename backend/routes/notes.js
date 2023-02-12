const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");

//Route 1 : Get All the notes using  :  GET request /api/note/fetachallnotes : login required
router.get("/fetachallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured while creating user");
  }
});

//Route 1 : Add a note using  :  post request /api/note/addnote : login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Please enter a valid titel").isLength({ min: 3 }),
    body("description", "Description must be more than 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured while creating user");
    }
  }
);

//Route 3 : Update an existing note using  :  PUT request /api/note/updatenote : login required
router.put("/updatenote/:id", fetchuser,  async (req, res) => {
    try {
      const {title, description, tag} = req.body
      // Create a new note object 
      
      const newNote = {};
      if (title){newNote.title=title}
      if (description){newNote.description=description}
      if (tag){newNote.tag=tag}
      
      //Find the note to be updated then update it

      let note = await Note.findById(req.params.id)
      if(!note){ return res.status(400).send("Note not found")} 

      if (note.user.toString() !== req.user.id){
          return res.status(401).send('User not allowed to update note')
      }

      note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
      res.json({note});
    //   const notes = await Note.find({ user: req.user.id });
    //   res.send(notes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured while creating user");
    }
  }
);

//Route 3 : Delete an  existing note using  :  DELETE request /api/note/deletenote : login required
router.delete("/deletenote/:id", fetchuser,  async (req, res) => {
    try {
      //Find the note to be delete then delete it
      let note = await Note.findById(req.params.id)
      if(!note){ return res.status(400).send("Note not found")} 

      // Allow deletion only if user owns this note 

      if (note.user.toString() !== req.user.id){
          return res.status(401).send('User not allowed to delete note')
      }

      note = await Note.findByIdAndDelete(req.params.id)
      res.json({"Success": "Note has been deleted", note: note});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured while creating user");
    }
  }
);
module.exports = router;
