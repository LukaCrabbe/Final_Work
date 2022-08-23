import React, { useState, useEffect } from "react";
import './canvas.scss';
import Note from '../note/note';
import CombatTracker from "../combatTracker/combatTracker";
import InteractionService from "../services/InteractionService";
import { useSelector } from 'react-redux';
import { useLocation, Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from "../utils/axios";
import Logout from "../logout/logout";
import { Formik, Form, Field } from 'formik'
import axios from 'axios';
// import {UserResponse} from "../utils/types";
// import {RootState} from "../store";

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
                console.log(response)
            })
            .catch((err) => {
                if (err) {
                    console.log(err.data)
                }
            })
    }

    const addComponent = (title, component, canvas) => {
        axios
            .post(`http://${process.env.REACT_APP_API_URL}/${component}/`, { title, canvas })
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                if (err) {
                    console.log(err.data)
                }
            })
    }

    const deleteCanvas = (canvasId, user) => {
        axios
            .delete(`http://${process.env.REACT_APP_API_URL}/canvas/${canvasId}/`, { data: { canvasId, user } })
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.data)
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
                console.log(response)
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response.data)
                }
            })
    }

    const switchCanvas = (id) => {
        setActiveCanvas(id);
        setCanvasId(id);
    }

    return <div className="canvas" id="canvas">
        {canvasesData?.error !== undefined ?
            <Navigate to={"/login"}></Navigate> : null}
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
                            <button className="delete" onClick={() => deleteCanvas(canvas.id, userId)}>X</button>
                        </div>

                    ))}
                <div>
                    <h4>Add Canvas</h4>
                    <button onClick={() => setCanvasForm(!canvasForm)}><span>+</span></button>
                </div>
                <Formik
                    initialValues={{
                        title: '',
                    }}
                    onSubmit={(values) => {
                        console.log(values);
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
        </div>
        <Formik
            initialValues={{
                component: "",
                title: "",
            }}
            onSubmit={(values) => {
                console.log(values)
                addComponent(values.title, values.component, canvasId)
            }}
        >
            <Form>
                <label htmlFor="component">Add a Component</label>
                <Field as="select" name="component">
                    <option value="">--Select a Component--</option>
                    <option value="combatTracker">Combat Tracker</option>
                    <option value="note">Note</option>
                </Field>
                <label htmlFor="title">Title</label>
                <Field type="text" name="title" id="title" required />
                <button type="submit">Add</button>
            </Form>
        </Formik>
        <Logout></Logout>
        {user.data ? <p>Welcome, {user.data?.username}</p> : <p>Loading ...</p>}
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


