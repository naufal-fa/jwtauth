import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar.js";
import Sidebar from './Sidebar.js';
import Footer from './Footer.js';
import jwt_decode from "jwt-decode";
import axios from 'axios';


const Dashboard = () => {

    const [ name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken()
    }, [])
    
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:3001/token');
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
        } catch (error) {
            if(error.response){
                navigate('/');
            }
        }
    }

  return (
        <div id='app'>
            <Navbar />
            <Sidebar />
            <section className="section is-title-bar">
                <div className="level">
                    <div className="level-left">
                        <div className="level-item">
                        <ul>
                            <li>Admin</li>
                            <li>Dashboard</li>
                        </ul>
                        </div>
                    </div>
                    {/* <div className="level-right">
                        <div className="level-item">
                        <div className="buttons is-right">
                            <a href="https://github.com/vikdiesel/admin-one-bulma-dashboard" target="_blank" className="button is-primary">
                                <span className="icon"><i className="mdi mdi-github-circle"></i></span>
                                <span>GitHub</span>
                            </a>
                        </div>
                        </div>
                    </div> */}
                </div>
            </section>
            <section className="hero is-hero-bar">
                <div className="hero-body">
                    <div className="card">
                        <div className="card-content">
                            <div className="level-item">
                                <h1 className="title">Selamat datang {name}!</h1>
                            </div>
                            <div className="level-item">
                                <h1 className="title">JWT ReactJS & ExpressJS</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <section className="hero is-hero-bar">
                <div className="hero-body">
                    <div className="level">
                        <div className="level-left">
                        <div className="level-item"><h1 className="title">
                            Dashboard
                        </h1></div>
                        </div>
                        <div className="level-right">
                            <div className="level-item"></div>
                        </div>
                    </div>
                </div>
            </section> */}
            {/* <section className="section is-main-section">
                <div className="tile is-ancestor">
                    <div className="tile is-parent">
                        <div className="card tile is-child">
                            <header className="card-header">
                                <p className="card-header-title">
                                <span className="icon"><i className="mdi mdi-account-circle default"></i></span>
                                Edit Profile
                                </p>
                            </header>
                            <div className="card-content">
                                <form>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal"><label className="label">Avatar</label></div>
                                    <div className="field-body">
                                    <div className="field">
                                        <div className="field file">
                                        <label className="upload control">
                                            <a className="button is-primary">
                                            <span className="icon"><i className="mdi mdi-upload default"></i></span>
                                            <span>Pick a file</span>
                                            </a>
                                            <input type="file"></input>
                                        </label>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                    <label className="label">Name</label>
                                    </div>
                                    <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                        <input type="text" autocomplete="on" name="name" value="John Doe" className="input" required></input>
                                        </div>
                                        <p className="help">Required. Your name</p>
                                    </div>
                                    </div>
                                </div>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                    <label className="label">E-mail</label>
                                    </div>
                                    <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                        <input type="email" autocomplete="on" name="email" value="user@example.com" className="input" required></input>
                                        </div>
                                        <p className="help">Required. Your e-mail</p>
                                    </div>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal"></div>
                                    <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                        <button type="submit" className="button is-primary">
                                            Submit
                                        </button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="tile is-parent">
                        <div className="card tile is-child">
                        <header className="card-header">
                            <p className="card-header-title">
                            <span className="icon"><i className="mdi mdi-account default"></i></span>
                            Profile
                            </p>
                        </header>
                        <div className="card-content">
                            <div className="is-user-avatar image has-max-width is-aligned-center">
                            <img src="https://avatars.dicebear.com/v2/initials/john-doe.svg" alt="John Doe"></img>
                            </div>
                            <hr></hr>
                            <div className="field">
                            <label className="label">Name</label>
                            <div className="control is-clearfix">
                                <input type="text" readonly value="John Doe" className="input is-static"></input>
                            </div>
                            </div>
                            <hr></hr>
                            <div className="field">
                            <label className="label">E-mail</label>
                            <div className="control is-clearfix">
                                <input type="text" readonly value="user@example.com" className="input is-static"></input>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                        <span className="icon"><i className="mdi mdi-lock default"></i></span>
                        Change Password
                        </p>
                    </header>
                    <div className="card-content">
                        <form>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                            <label className="label">Current password</label>
                            </div>
                            <div className="field-body">
                            <div className="field">
                                <div className="control">
                                <input type="password" name="password_current" autocomplete="current-password" className="input" required></input>
                                </div>
                                <p className="help">Required. Your current password</p></div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                            <label className="label">New password</label>
                            </div>
                            <div className="field-body">
                            <div className="field">
                                <div className="control">
                                <input type="password" autocomplete="new-password" name="password" className="input" required></input>
                                </div>
                                <p className="help">Required. New password</p>
                            </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                            <label className="label">Confirm password</label>
                            </div>
                            <div className="field-body">
                            <div className="field">
                                <div className="control">
                                <input type="password" autocomplete="new-password" name="password_confirmation" className="input" required></input>
                                </div>
                                <p className="help">Required. New password one more time</p>
                            </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal"></div>
                            <div className="field-body">
                            <div className="field">
                                <div className="control">
                                <button type="submit" className="button is-primary">
                                    Submit
                                </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </section> */}
            {/* <Footer /> */}
        </div>
  )
}

export default Dashboard