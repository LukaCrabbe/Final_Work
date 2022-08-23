import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authSlice from "../store/slices/auth";
import useSWR from 'swr';
import { fetcher } from "../utils/axios";
import './logout.scss'

const Logout = () => {

    const userMenu = useRef(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropDown, setDropDown] = useState(false)

    const account = useSelector((state) => state.auth.account);

    const handleLogout = () => {
        dispatch(authSlice.actions.logout());
        navigate("/login");
    }

    const toggleDropdown = () => {
        setDropDown(!dropDown)
        console.log(userMenu.current)
        userMenu.current.classList.toggle("hide");
        userMenu.current.classList.toggle("dropdown");
    }


    return <div className='logout'>
        <div className="user">
            <h4>{account.username}</h4>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                className='picture' onClick={() => toggleDropdown()}>
                <title>user</title>
                <path d="M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z"></path>
            </svg>
        </div>
        <div className="hide" ref={userMenu}>
            <div className='user_link'>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                    onClick={() => handleLogout()}>
                    <title>exit</title>
                    <path d="M24 20v-4h-10v-4h10v-4l6 6zM22 18v8h-10v6l-12-6v-26h22v10h-2v-8h-16l8 4v18h8v-6z"></path>
                </svg>
                <h4 onClick={() => handleLogout()}>Log out</h4>
            </div>
        </div>
    </div>
}

export default Logout