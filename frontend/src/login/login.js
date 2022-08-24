import React, { useState } from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './login.scss'
import authSlice from '../store/slices/auth';
import logo from '../pictures/pngfind.com-dungeons-and-dragons-png-2663967.png'



const Login = () => {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogin = (email, password) => {

    axios
      .post(`http://${process.env.REACT_APP_API_URL}/auth/login/`, { email, password })
      .then((res) => {
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        dispatch(authSlice.actions.setAccount(res.data.user));
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err.response.status);
        setMessage(err.response.data.detail.toString());
      });
  }

  const handleRegister = (username, email, password) => {

    axios
      .post(`http://${process.env.REACT_APP_API_URL}/auth/register/`, { username, email, password })
      .then((res) => {
        dispatch(
          authSlice.actions.setAuthTokens({
            toke: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        dispatch(authSlice.actions.setAccount(res.data.user));
        setLoading(false);
        setRegister(!register);
      })
      .catch((err) => {
        console.log(err.response.status);
        setMessage(err.response.data.detail.toString());
      });

  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      handleLogin(values.email, values.password);
    },
    validationSchema: Yup.object({
      email: Yup.string().trim().required("An email address is required"),
      password: Yup.string().trim().required("A password is required")
    })
  })

  const registerForm = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      handleRegister(values.username, values.email, values.password);
    }
  })


  return <div className='login_page'>
    <div className="login_head">
      <img src={logo} alt="" className='logo' />
      <h1 className='appName'>Elysion D&D</h1>
    </div>
    {register ?
      <div className='register'>
        <h2>Register</h2>
        <form onSubmit={registerForm.handleSubmit}>
          <input type="text" name="username" id="username" placeholder='Username'
            value={registerForm.values.username} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur}
          />
          <input type="email" name="email" id="email" placeholder='Email'
            value={registerForm.values.email} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur}
          />
          <input type="password" name="password" id="password" placeholder='Password'
            value={registerForm.values.password} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur}
          />
          <button type="submit" disabled={loading}>Register</button>
        </form>
      </div> :
      <div className='login'>
        <h2>Log In</h2>
        <form onSubmit={formik.handleSubmit}>
          <input type="email" name="email" id="email" placeholder='Email'
            value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
          />
          {formik.errors.email ? <div>{formik.errors.email}</div> : null}
          <input type="password" name="password" id="password" placeholder='Password'
            value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
          />
          {formik.errors.password ? <div>{formik.errors.password}</div> : null}
          <button type="submit" disabled={loading}>Login</button>
          <button onClick={() => setRegister(!register)}>Register</button>
        </form>
      </div>
    }
  </div>
}

export default Login;