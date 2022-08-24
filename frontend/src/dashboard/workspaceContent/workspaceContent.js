import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '../../utils/axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import axios from 'axios'

const WorkspaceContent = (props) => {

    const [content, setContent] = useState();
    const [canvasForm, setCanvasForm] = useState(false);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const canvasData = useSWR(`/workspace/canvas/${props.activeWorkspace.id}/`, fetcher, { refreshInterval: 1000 });

    useEffect(() => {
        setContent(canvasData?.data)
    }, [canvasData]);

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

    return <div className='workspace_content'>
        {content === undefined ? <h4>...Loading</h4> :
            content.map((canvas) => (
                <div key={canvas.title}>
                    <Link to={`/${props.activeWorkspace.id}/${canvas.id}`}
                        state={{
                            workspaceTitle: props.activeWorkspace.title, currentCanvas: canvas.title,
                            workspaceId: props.activeWorkspace.id
                        }}
                        key={canvas.id}>
                        <div className='canvas_picture'>
                            <img src={require("../../pictures/parchment.jpg")} alt="" width="250" height="250" />
                        </div>
                    </Link>
                    <div className='canvas_title' key={canvas.title}>
                        <Link to={`/${props.activeWorkspace.id}/${canvas.id}`}
                            state={{
                                workspaceTitle: props.activeWorkspace.title, currentCanvas: canvas.title,
                                workspaceId: props.activeWorkspace.id
                            }}>
                            <h4>{canvas.title}</h4>
                        </Link>
                        <svg className="delete" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"
                            onClick={() => deleteCanvas(canvas.id, userId)}>
                            <title>cross</title>
                            <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
                        </svg>
                    </div>
                </div>

            ))
        }
        <div className='add_canvas'>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                onClick={() => setCanvasForm(!canvasForm)}>
                <title>plus</title>
                <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
            </svg>
            <h4>Add Canvas</h4>
            <Formik
                initialValues={{
                    title: '',
                }}
                onSubmit={(values) => {
                    setCanvasForm(!canvasForm);
                    addCanvas(values.title, props.activeWorkspace.id);
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

}

export default WorkspaceContent;