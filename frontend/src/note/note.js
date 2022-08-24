import './note.scss'
import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import TextareaAutosize from 'react-textarea-autosize'
import axios from 'axios';
import { useSelector } from 'react-redux';



const Note = (props) => {

    const [title, setTitle] = useState(props.title)
    const [noteText, setNoteText] = useState(props.text)
    const [noteId] = useState(props.id)
    const [editTitle, setEditTitle] = useState(false);
    const [editText, setEditText] = useState(false);
    const [interactService, setInteractService] = useState(props.interact)
    const [htmlId, setHtmlId] = useState(/\s/g.test(props.title) ? props.title.replace(/\s/g, "_") : props.title)

    const account = useSelector((state) => state.auth.account);

    const userId = account?.id;

    useEffect(() => {
        if ((editTitle || editText) === false) {
            interactService.setSizeandPosition({ title: title, id: htmlId }, "Note")
            interactService.setInteractable({ title: title, id: htmlId }, "Note")
        }
        if ((editTitle || editText) === true) {
            interactService.setSizeandPosition({ title: title, id: htmlId }, "Note")
            interactService.unsetInteractable(htmlId)
        }

        if (noteText === "") {
            setNoteText("Add Text");
        }

    }, [editTitle, editText, interactService, htmlId, title, noteText])

    const updateNote = (title, text, component, componentId, user) => {
        axios
            .patch(`http://${process.env.REACT_APP_API_URL}/${component}/${componentId}/`, { title, text, componentId, user })
            .then((response) => {
                console.log(response.status)
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response)
                }
            })

    }


    const formik = useFormik({
        initialValues: {
            title: title,
            text: noteText,
        },
        onSubmit: (values) => {
            if (editTitle) {
                setEditTitle(!editTitle)
            }
            if (editText) {
                setEditText(!editText)
            }
            if (values.title !== title) {
                if (localStorage.getItem(`${htmlId}Notesize`) !== null) {
                    let size = JSON.parse(localStorage.getItem(`${htmlId}Notesize`))
                    localStorage.setItem(`${values.title}Notesize`, JSON.stringify(size))
                }
                if (localStorage.getItem(`${htmlId}Noteposition`) !== null) {
                    let position = JSON.parse(localStorage.getItem(`${htmlId}Noteposition`))
                    localStorage.setItem(`${values.title}Noteposition`, JSON.stringify(position))
                }

                localStorage.removeItem(`${htmlId}Notesize`)
                localStorage.removeItem(`${htmlId}Noteposition`)
                setTitle(values.title);
            }
            if (values.text !== noteText) {
                setNoteText(values.text);
            }

            updateNote(values.title, values.text, "note", noteId, userId);
        }
    })

    return <div className="note" id={htmlId}>
        {editTitle || editText ?
            <div className='edit'>
                <form onSubmit={formik.handleSubmit}>
                    <div className='note_title'>
                        <h2 style={editTitle ? { display: "none" } : { display: "block" }}>{title}</h2>
                        <input type="text" name="title" style={editTitle ? { display: "block" } : { display: "none" }}
                            value={formik.values.title} onChange={formik.handleChange} />
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"
                            onClick={() => setEditTitle(!editTitle)} style={editTitle ? { display: "block" } : { display: "none" }}>
                            <title>pencil</title>
                            <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                        </svg>
                        <button type="submit" style={editTitle ? { display: "block" } : { display: "none" }}>Save</button>
                    </div>
                    <div className='icons'>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"
                            onClick={props.delete} data-title={title}>
                            <title>bin2</title>
                            <path d="M6 32h20l2-22h-24zM20 4v-4h-8v4h-10v6l2-2h24l2 2v-6h-10zM18 4h-4v-2h4v2z"></path>
                        </svg>
                    </div>
                    <div className="note_text">
                        <TextareaAutosize className="textarea" name="text" style={editText ? { display: "block" } : { display: "none" }}
                            value={formik.values.text} onChange={formik.handleChange} />
                        <p style={editText ? { display: "none" } : { display: "block" }}>{noteText}</p>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"
                            onClick={() => setEditText(!editText)} style={editText ? { display: "block" } : { display: "none" }}>
                            <title>pencil</title>
                            <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                        </svg>
                        <button type="submit" style={editText ? { display: "block" } : { display: "none" }}>Save</button>
                    </div>
                </form>
            </div>
            : <div>
                <div className="note_title">
                    <h2>{title}</h2>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" onClick={() => setEditTitle(!editTitle)}>
                        <title>pencil</title>
                        <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                    </svg>
                </div>
                <div className='icons'>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" onClick={props.delete}
                        data-title={title} data-component="note">
                        <title>bin2</title>
                        <path d="M6 32h20l2-22h-24zM20 4v-4h-8v4h-10v6l2-2h24l2 2v-6h-10zM18 4h-4v-2h4v2z"></path>
                    </svg>
                </div>
                <div className='note_text'>
                    <p>{noteText}</p>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" onClick={() => setEditText(!editText)}>
                        <title>pencil</title>
                        <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                    </svg>
                </div>
            </div>}
    </div>

}

export default Note;