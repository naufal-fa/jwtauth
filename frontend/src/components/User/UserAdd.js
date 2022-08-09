import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Navbar from "../Navbar.js";
import Sidebar from '../Sidebar.js';

const UserAdd = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState('');
    const [preview, setPreview] = useState('');
    const [role, setRole] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    });

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:3001/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate('/')
            }
        }
    }

    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(async (config) => {
        const currentData = new Date();
        if (expire * 1000 < currentData.getTime()) {
            const response = await axios.get('http://localhost:3001/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const submitUser = async (e) => {
        e.preventDefault();
        if(file === null) {
            setFile(null);
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("file", file);
        await axios.post('http://localhost:3001/user/add', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        navigate('/user');
    }

    const backClick = () => {
        navigate(-1);
    }

    const loadImage = (e) => {
        const image = e.target.files[0];

        setFile(image);
        setPreview(URL.createObjectURL(image));
    }

    return (
        <div id="app">
            <Navbar />
            <Sidebar />
            <section className="section is-title-bar">
                <div className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <ul>
                                <li>Admin</li>
                                <li>Product</li>
                            </ul>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <div className="buttons is-right">
                                <button onClick={backClick} className="button is-danger">
                                    <span className="icon"><i className="mdi mdi-arrow-left"></i></span>
                                    <span>Kembali</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                            <span className="icon"><i className="mdi mdi-book-information-variant default"></i></span>
                            Form Tambah User
                        </p>
                    </header>
                    <div className="card-content">
                        <form onSubmit={submitUser}>
                            <div className="field is-horizontal">
                                <div className="field-label is-normal">
                                    <label className="label">Name</label>
                                </div>
                                <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                        <input className="input" type="text" placeholder="Name" value={name} onChange={ (e) => setName(e.target.value) }></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="field is-horizontal">
                                <div className="field-label is-normal">
                                    <label className="label">Email</label>
                                </div>
                                <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                        <input className="input" type="email" placeholder="Email" value={email} onChange={ (e) => setEmail(e.target.value) }></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="field is-horizontal">
                                <div className="field-label is-normal">
                                    <label className="label">Password</label>
                                </div>
                                <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                        <input className="input" type="text" placeholder="Password" onChange={ (e) => setPassword(e.target.value) }></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="field has-check is-horizontal">
                                <div className="field-label">
                                    <label className="label">Role</label>
                                </div>
                                <div className="field-body">
                                    <div className="field">
                                    <div className="field is-grouped-multiline is-grouped">
                                        <div className="control">
                                            <label className="b-radio radio">
                                                <input type="radio" name="sample-radio" value="Admin" onChange={ (e) => setRole(e.target.value) }></input>
                                                <span className="check"></span>
                                                <span className="control-label">Admin</span>
                                            </label>
                                        </div>
                                        <div className="control">
                                            <label className="b-radio radio">
                                                <input type="radio" name="sample-radio" value="User" onChange={ (e) => setRole(e.target.value) }/>
                                                <span className="check"></span>
                                                <span className="control-label">User</span>
                                            </label>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="field is-horizontal">
                                <div className="field-label is-normal"><label className="label">Image</label></div>
                                <div className="field-body">
                                    <div className="field">
                                        <div className="field file">
                                            <label className="upload control">
                                                <a className="button is-primary">
                                                    <span className="icon"><i className="mdi mdi-upload"></i></span>
                                                    <span>Pick a file</span>
                                                </a>
                                                <input className="file-input" onChange={loadImage} type="file"></input>
                                            </label>
                                        </div>
                                        <p className="help is-danger">
                                            "The image must be less than 10 MB and .png, .jpg, jpeg"
                                        </p>
                                        <br/>
                                        <div className="column is-one-fifth">
                                            {preview ? (
                                                <figure className="image is-square">
                                                    <img className="is-rounded" src={preview} alt="Preview Image"/>
                                                </figure>
                                            ) : (
                                                ""
                                            )}
                                        </div>
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
            </section>
        </div>
    )
}

export default UserAdd;