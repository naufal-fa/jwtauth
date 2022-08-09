import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Navbar from "../Navbar.js";
import Sidebar from '../Sidebar.js';

const ProductEdit = () => {

    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState('');
    const [preview, setPreview] = useState('');
    const [token, setToken] = useState([]);
    const [expire, setExpire] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        refreshToken();
        getProductByID();
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
            const response = await axios.get('http://localhost:3001/token'); // jika waktu expire lebih kecil maka panggil API token
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


    const getProductByID = async (e) => {
        const response = await axiosJWT.get(`http://localhost:3001/product/${id}`);
        setTitle(response.data.title);
        setPrice(response.data.price);
        setPreview(response.data.url);
        setFile(response.data.image);
    }

    const submitProduct = async (e) => {
        e.preventDefault();
        await axiosJWT.patch(`http://localhost:3001/product/edit/${id}`, {
            title: title,
            price: price,
            file: file
        });
        navigate('/product');
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
                        Form Ubah Product
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
                        <div className="column is-one-fifth">
                            {preview ? (
                                <figure className="image is-square">
                                    <img src={preview} alt="Preview Image"/>
                                </figure>
                            ) : (
                                ""
                            )}
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

export default ProductEdit;