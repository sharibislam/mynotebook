import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInital = []

      const [notes, setNotes] = useState(notesInital)

      // Get all avliable notes 

      const getAllNotes = async () =>{
        // TODO add note using API
        const response = await fetch(`${host}/api/note/fetachallnotes`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token')
          }
        });
        const json = await response.json();
        console.log(json)
        setNotes(json)
      }
      // Add note
      
      const addNote = async (title, description, tag) =>{
        // TODO add note using API
        const response = await fetch(`${host}/api/note/addnote`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token')
          },
         
          body: JSON.stringify({title,description,tag}) 
        });
        const note = await response.json();
        setNotes(notes.concat(note))
      }
      //Delete note

      const deleteNote = async (id) =>{
        const response = await fetch(`${host}/api/note/deletenote/${id}`, {
          method: 'DELETE', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token')
          }
        });
        const json = await response.json();
        console.log(json)

          console.log("Deleting node with id"+id);
          const newNotes = notes.filter((note) => {return note._id!==id})
          setNotes(newNotes)
      }
      //Edit note

      const editNote = async (id, title, description, tag) =>{
        const response = await fetch(`${host}/api/note/updatenote/${id}`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token')
          },
         
          body: JSON.stringify({title, description, tag}) 
        });
        const json = await response.json();
        console.log(json);
        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id===id){
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            break;
          }                    
        }
        setNotes(newNotes)
      }
      
    return(
        <NoteContext.Provider value = {{notes, addNote, deleteNote, editNote, getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;