import React, { useState, useEffect } from 'react';
import './dashboard.scss';
import logo from '../pictures/pngfind.com-dungeons-and-dragons-png-2663967.png'
import { Link, Navigate } from 'react-router-dom';
import Logout from '../logout/logout';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import axios from 'axios';
import { fetcher } from "../utils/axios";
import WorkspaceContent from './workspaceContent/workspaceContent';
import { Formik, Field, Form, useFormik } from 'formik';


const Dashboard = () => {

    const [workspaces, setWorkspaces] = useState();
    const [message, setMessage] = useState("");
    const [active, setActive] = useState();
    const [workspaceForm, setWorkspaceForm] = useState(false);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const workspacesData = useSWR(`/user/workspace/${userId}/`, fetcher, { refreshInterval: 1000 });

    const firstWorkspace = workspacesData?.data?.find(element => element !== undefined);

    useEffect(() => {
        setWorkspaces(workspacesData?.data);
        setActive(firstWorkspace)
    }, [workspacesData.data, firstWorkspace])

    const changeWorkspace = (e) => {
        let activeWorkspace = workspaces.find(element => element.title === e.target.innerHTML);
        console.log(activeWorkspace);
        setActive(activeWorkspace);
    }

    const addWorkspace = (title, user) => {
        axios
            .post(`http://${process.env.REACT_APP_API_URL}/workspace/`, { title, user })
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                if (err.response) {
                    setMessage(err.response.data)
                }
            })
    }

    const deleteWorkspace = (workspaceId, user) => {
        axios
            .delete(`http://${process.env.REACT_APP_API_URL}/workspace/${workspaceId}/`, { data: { workspaceId, user } })
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                if (err.response) {
                    setMessage(err.response.data)
                }
            })
    }

    const workspace_form = useFormik({
        initialValues: {
            title: '',
        },
        onSubmit: (values) => {
            console.log(values);
            console.log(userId);
            addWorkspace(values.title, userId);
            setWorkspaceForm(!workspaceForm);
        }
    })

    return <div className='dashboard'>
        {workspacesData?.error !== undefined ?
            <Navigate to={"/login"}></Navigate> : null}
        <div className="head_div">
            <img src={logo} alt="" className='logo' />
            <h1 className='appName'>Elysion</h1>
            <div className="logoutDashboard">
                <Logout></Logout>
            </div>
        </div>

        <div className='dashboard_nav'>
            <div className='workspace_nav'>
                {workspaces === undefined ? <h4>...Loading</h4> :
                    workspaces.map((element) => (
                        <div className="workspaces" key={element.title}>
                            <h4 key={element.title}
                                style={active.id === element.id ? { borderBottom: "3px solid #E14646" } : { borderBottom: "none" }}
                                onClick={(event) => changeWorkspace(event)}>{element.title}</h4>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className='delete'
                                onClick={() => deleteWorkspace(element.id, userId)} key={`${element.title}button`}>
                                <title>cross</title>
                                <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
                            </svg>
                        </div>
                    ))
                }
                <form onSubmit={workspace_form.handleSubmit}
                    style={workspaceForm ? { display: "block" } : { display: "none" }}
                    className='workspace_form'>
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" id="title" onChange={workspace_form.handleChange} />
                    <button type="submit">Add</button>
                </form>

                <div className='add_workspace'>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                        onClick={() => setWorkspaceForm(!workspaceForm)}>
                        <title>plus</title>
                        <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
                    </svg>
                    <h4 onClick={() => setWorkspaceForm(!workspaceForm)}>Add Workspace</h4>
                </div>

            </div>
        </div>
        <div className='workspace'>
            {active === undefined ? <h4>...Loading</h4> :
                <WorkspaceContent activeWorkspace={active}></WorkspaceContent>
            }
        </div>
    </div>
}

export default Dashboard;