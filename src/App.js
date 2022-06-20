import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
//import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    const [notes, setNotes] = React.useState(//[]
        //returning a function defines it will run only once during initilization.
        () => (JSON.parse(localStorage.getItem("notes")) || [])
        )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    /*const [state, setState] = React.useState(
        () => console.log("Initialization. When returning a function only runs once during initilization!!!")
    )*/

    React.useEffect(()=>{
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    //updates notes without rearranging notes.
    /*function updateNote(text) {
        setNotes(oldNotes => oldNotes.map(oldNote => {
            console.log([{id: currentNoteId, body: text }, ...notes.filter((item)=>item.id===currentNoteId ? false : true)])
            console.log([{id: currentNoteId, body: text }, ...notes])
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote
        }))
    }*/

    //update and rearrange notes order putting the updated one first. Teacher method.
    /*function updateNote(text) {
        // Try to rearrange the most recently-modified
        // not to be at the top
        setNotes(oldNotes => {
            const newArray = []
            for(let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if(oldNote.id === currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })*/

    //update and rearrange notes but my method.    
    function updateNote(text) {
        setNotes(oldNotes =>
            [{id: currentNoteId, body: text }, ...oldNotes.filter((item)=>item.id===currentNoteId ? false : true)]
        )
    }
    
    /*function findCurrentNoteIndex() {
        return notes.findIndex(note => {
            return note.id === currentNoteId
        }) || 0
    }*/

    function deleteNote() {
        setNotes(
            oldNotes => notes.filter((item)=>item.id===currentNoteId ? false : true)
        )
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
