import React, { useState, useEffect } from "react";
import './canvas.scss';
import Note from '../note/note';
import CombatTracker from "../combatTracker/combatTracker";
import logo from '../pictures/pngfind.com-dungeons-and-dragons-png-2663967.png'
import InteractionService from "../services/InteractionService";
import { useSelector } from 'react-redux';
import { useLocation, Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from "../utils/axios";
import Logout from "../logout/logout";
import { Formik, Form, Field, useFormik } from 'formik'
import axios from 'axios';

const Canvas = (props) => {

    const location = useLocation();

    const regexpId = /[1-9]/g;

    const [noteComponents, setNoteComponents] = useState()
    const [combatComponents, setCombatComponents] = useState()
    const [canvasForm, setCanvasForm] = useState(false);
    const [canvases, setCanvases] = useState();
    const [workspaceId, setWorkspaceId] = useState(location.pathname.match(regexpId)[0]);
    const [workspaceTitle, setWorkspaceTitle] = useState();
    const [canvasId, setCanvasId] = useState(location.pathname.match(regexpId)[1]);
    const [activeCanvas, setActiveCanvas] = useState(+location.pathname.match(regexpId)[1])

    const account = useSelector((state) => state.auth.account);

    const userId = account?.id;

    const user = useSWR(`/user/${userId}/`, fetcher)

    const canvasesData = useSWR(`/workspace/canvas/${workspaceId}/`, fetcher, { refreshInterval: 1000 });

    const workspaceData = useSWR(`/workspace/${workspaceId}/`, fetcher)

    const noteData = useSWR(`/canvas/note/${canvasId}/`, fetcher, { refreshInterval: 1000 })

    const combatTrackerData = useSWR(`/canvas/combat_tracker/${canvasId}/`, fetcher, { refreshInterval: 1000 });

    useEffect(() => {
        setCanvases(canvasesData?.data)
        setWorkspaceTitle(workspaceData?.data?.find(element => element !== undefined).title)
        setNoteComponents(noteData?.data)
        setCombatComponents(combatTrackerData?.data)
    }, [canvasesData, workspaceData, noteData, combatTrackerData]);

    const addCanvas = (title, workspace) => {
        axios
            .post(`http://${process.env.REACT_APP_API_URL}/canvas/`, { title, workspace })
            .then((response) => {
                console.log(response.status)
            })
            .catch((err) => {
                if (err) {
                    console.log(err.response)
                }
            })
    }

    const addComponent = (title, component, canvas) => {
        axios
            .post(`http://${process.env.REACT_APP_API_URL}/${component}/`, { title, canvas })
            .then((response) => {
                console.log(response.status)
            })
            .catch((err) => {
                if (err) {
                    console.log(err.response)
                }
            })
    }

    const deleteCanvas = (canvasId, user) => {
        axios
            .delete(`http://${process.env.REACT_APP_API_URL}/canvas/${canvasId}/`, { data: { canvasId, user } })
            .then((response) => {
                console.log(response.status)
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response)
                }
            })
    }

    const deleteComponent = (component, componentId, componentTitle, user) => {

        const capitalize = component.charAt(0).toUpperCase() + component.slice(1)

        if (component === "note") {
            if (localStorage.getItem(`${componentTitle}${capitalize}size`) !== null) {
                localStorage.removeItem(`${componentTitle}${capitalize}size`)
            }
            if (localStorage.getItem(`${componentTitle}${capitalize}position`) !== null) {
                localStorage.removeItem(`${componentTitle}${capitalize}position`)
            }
        }

        if (component === "combatTracker") {
            if (localStorage.getItem(`${componentTitle}CTsize`) !== null) {
                localStorage.removeItem(`${componentTitle}CTsize`)
            }
            if (localStorage.getItem(`${componentTitle}CTposition`) !== null) {
                localStorage.removeItem(`${componentTitle}CTposition`)
            }
        }

        axios
            .delete(`http://${process.env.REACT_APP_API_URL}/${component}/${componentId}/`, { data: { componentId, user } })
            .then((response) => {
                console.log(response.status)
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response)
                }
            })
    }

    const switchCanvas = (id) => {
        setActiveCanvas(id);
        setCanvasId(id);
    }

    const componentForm = useFormik({
        initialValues: {
            component: "",
            title: "",
        },
        onSubmit: (values) => {
            addComponent(values.title, values.component, canvasId);
        }
    })

    return <div className="canvas" id="canvas">
        {canvasesData?.error !== undefined ?
            <Navigate to={"/login"}></Navigate> : null}
        <div className="head_div">
            <img src={logo} alt="" className='logo' />
            <h1 className='appName'>Elysion D&D</h1>
            <div className="logoutDashboard">
                <Logout></Logout>
            </div>
        </div>
        <div className="titles">
            {workspaceTitle === undefined ? <h4>...Loading</h4> :
                <Link to={'/'}>
                    <h2 className="workspaceTitle">{workspaceTitle}</h2>
                </Link>
            }
            <div className="canvases">
                {canvases === undefined ? <h4>...Loading</h4> :
                    canvases.map((canvas) => (
                        <div key={canvas.id}>
                            <Link to={`/${workspaceId}/${canvas.id}`}
                                style={activeCanvas === canvas.id ? { borderBottom: "2px solid red" } : null}
                                onClick={() => switchCanvas(canvas.id)}
                                key={canvas.title}>
                                <h4>{canvas.title}</h4>
                            </Link>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className='deleteCanvas'
                                onClick={() => deleteCanvas(canvas.id, userId)}>
                                <title>cross</title>
                                <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
                            </svg>
                        </div>
                    ))}
                <div>
                    <h4>Add Canvas</h4>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                        className="plus" onClick={() => setCanvasForm(!canvasForm)}>
                        <title>plus</title>
                        <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
                    </svg>
                </div>
                <Formik
                    initialValues={{
                        title: '',
                    }}
                    onSubmit={(values) => {
                        setCanvasForm(!canvasForm);
                        addCanvas(values.title, workspaceId);
                    }}
                >
                    <Form style={canvasForm ? { display: "block" } : { display: "none" }}>
                        <label htmlFor="title">Title:</label>
                        <Field type="text" name="title" id="title" />
                        <button type="submit">Add</button>
                    </Form>
                </Formik>
            </div>
            <form onSubmit={componentForm.handleSubmit} className="componentForm">
                <label htmlFor="component">Add a Component</label>
                <select name="component" onChange={componentForm.handleChange}>
                    <option value="">--Select a Component--</option>
                    <option value="combatTracker">Combat Tracker</option>
                    <option value="note">Note</option>
                </select>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" onChange={componentForm.handleChange} required />
                <button type="submit">Add</button>
            </form>
        </div>

        {noteComponents === undefined ? null :
            noteComponents.map((note, i) => (
                <Note title={note.title} key={note.title} id={note.id} text={note.text}
                    delete={() => deleteComponent("note", note.id, note.title, userId)} interact={InteractionService}></Note>
            ))}
        {combatComponents === undefined ? null :
            combatComponents.map((combat, i) => (
                <CombatTracker title={combat.title} key={combat.title} id={combat.id}
                    delete={() => deleteComponent("combatTracker", combat.id, combat.title, userId)}
                    interact={InteractionService} round={combat.round}></CombatTracker>
            ))}
    </div>
}

export default Canvas;


