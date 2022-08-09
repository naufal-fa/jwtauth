import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Navbar from "../Navbar.js";
import Sidebar from '../Sidebar.js';

const ProductAdd = () => {

    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState('');
    const [preview, setPreview] = useState('');
    const [token, setToken] = useState([]);
    const [expire, setExpire] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

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

    axiosJWT.interceptors.request.use( async(config) => { //untuk melakukan pengecekan sebelum req
        const currentDate = new Date()  // ambil waktu sekarang
        if(expire * 1000 < currentDate.getTime()){ // dikali 1000 karena dalam milisecond 
            const response = await axios.get('http://localhost:3001/token') // jika waktu expire lebih kecil maka panggil API token
            // update token untuk authorization yang di header
            config.headers.Authorization = `Bearer ${response.data.accessToken}` //ambil access token baru dari API 
            setToken(response.data.accessToken) // set kembali token baru untuk digunakan lagi untuk refreshToken
            const decoded = jwt_decode(response.data.accessToken) // decode token baru
            setExpire(decoded.exp) // perbarui data expire dengan decode token baru
        }
        return config
    }, (error) => {
        return Promise.reject(error) //
    })

    const submitProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price);
        formData.append("file", file);
        await axios.post('http://localhost:3001/product/add', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        navigate('/product');
    }

    const loadImage = (e) => {
        const image = e.target.files[0];

        setFile(image);
        setPreview(URL.createObjectURL(image));
    }

    const backClick = () => {
        navigate(-1);
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
                        Form Tambah Product
                        </p>
                    </header>
                    <div className="card-content">
                        <form onSubmit={submitProduct}>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                            <label className="label">Title</label>
                            </div>
                            <div className="field-body">
                            <div className="field">
                                <div className="control">
                                <input type="text" className="input" value={title} placeholder="Title" onChange={ (e) => setTitle(e.target.value) } required></input>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                            <label className="label">Price</label>
                            </div>
                            <div className="field-body">
                            <div className="field">
                                <div className="control">
                                <input type="text" name="password" className="input" value={price} placeholder="Price" onChange={ (e) => setPrice(e.target.value) } required></input>
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
                                                <img src={preview} alt="Preview Image"/>
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

export default ProductAdd;