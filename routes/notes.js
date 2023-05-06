const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//Route 1 : get all notes
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

//Route 2 : Add a new notes using post request
router.post(
  "/addnote",
  [
    body("title", "Title must have minimum 2 character").isLength({ min: 2 }),
    body("description", "Description must have minimum 5 character").isLength({
      min: 5,
    }),
  ],
  fetchUser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //Storing result after validation
      const errors = validationResult(req);
      //if error array is not empty that means there must be unvalid value
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.send(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route : 3 Update an existing note
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //Create new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be Updated
    let note = await Note.findById(req.params.id);
    //if the note is not found
    if (!note) {
      return res.status(404).send(`Note doesn't exist`);
    }

    //if a editor is not valid user
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send(`You are an invalid user`);
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route : 4 Delete an existing note
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    //find the note to be deleted
    let note = await Note.findById(req.params.id);
    //if the note is not found
    if (!note) {
      return res.status(404).send(`Note doesn't exist`);
    }

    //if a deletor is not valid user
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send(`You are an invalid user`);
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.send({"Message":"Successfully deleted"});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
