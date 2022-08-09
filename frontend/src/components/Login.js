import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from "../config/Firebase.js";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', {
                email: email,
                password: password,
                loginWith: false
            })
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    const auth = getAuth();
    const handleLoginWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
        .then(async (result) => {
            const response = await axios.post('http://localhost:3001/login', {
                email: result.user.email,
                loginWith: true
            });
            if(response.data.status === "No User"){
                navigate('/register', {state: {email: result.user.email, name: result.user.displayName}})
            }else if(response.data.status === "User Valid"){
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        }).catch(error => {
            alert(error.message);
        })
    }

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-4-desktop box">
                    <form onSubmit={ Auth }>
                        <div className="has-text-centered has-text-danger">{msg}</div>
                        <div className="field mt-5">
                            <label className="label">Masukkan email</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder='Masukkan email anda' value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="field mt-5">
                            <label className="label">Masukkan password</label>
                            <div className="controls">
                                <input type="password" className="input" placeholder='Masukkan password anda' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <p className='is-size-7 level-right'>Dont have account? <a href='/register'>Click here!</a></p>
                        </div>
                        <div className="field mt-5">
                            <button className="button is-success is-fullwidth">Login</button>
                        </div>
                    </form>
                    <hr></hr>
                    <div className="field mt-5">
                        <button onClick={handleLoginWithGoogle} className="button is-fullwidth">Login with Google</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Login