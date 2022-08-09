import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const state = useLocation().state;
    const [name, setName] = useState(!state ? '' : state.name);
    const [email, setEmail] = useState(!state ? '' : state.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');

    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/users', {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            });
            navigate('/');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-4-desktop">
                    <form onSubmit={ Register } className="box">
                        <div className="has-text-centered has-text-danger">{msg}</div>
                        <div className="field mt-5">
                            <label className="label">Masukkan email</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder='Masukkan email anda' value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="field mt-5">
                            <label className="label">Masukkan nama</label>
                            <div className="controls">
                                <input type="text" className="input" placeholder='Masukkan nama anda' value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>
                        </div>
                        <div className="field mt-5">
                            <label className="label">Masukkan password</label>
                            <div className="controls">
                                <input type="password" className="input" placeholder='Masukkan password anda' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div className="field mt-5">
                            <label className="label">Konfirmasi password</label>
                            <div className="controls">
                                <input type="password" className="input" placeholder='Konfirmasi password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div className="field mt-5">
                            <button className="button is-success is-fullwidth">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Register