import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Navbar from "../Navbar.js";
import Sidebar from '../Sidebar.js';

const ProductsList = () => {

    const [products, setProduct] = useState([]);
    const [token, setToken] = useState([]);
    const [expire, setExpire] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getProducts();
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

    const getProducts = async () => {
        const response = await axiosJWT.get('http://localhost:3001/product', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setProduct(response.data);
    }

    const deleteProduct = async (id) => {
        await axiosJWT.delete('http://localhost:3001/product/delete/' + id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        getProducts();
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
                            <li>Product</li>
                        </ul>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                        <div className="buttons is-right">
                            <Link to="/product/add" className="button is-primary">
                                <span className="icon"><i className="mdi mdi-plus-circle"></i></span>
                                <span>Add Product</span>
                            </Link>
                        </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="hero is-hero-bar">
                <div className="hero-body">
                    <div className="level">
                        <div className="level-left">
                        <div className="level-item"><h1 className="title">
                            Product List
                        </h1></div>
                        </div>
                        <div className="level-right">
                            <div className="level-item"></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section is-main-section">
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                            <span className="icon"><i className="mdi mdi-table default"></i></span>
                            Products
                        </p>
                    </header>
                    <div className="card-content">
                        <div className="field is-horizontal">
                            <table className="table is-striped is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { products.map((product, index) => (
                                    <tr key={ product.id }>
                                        <td>{ index + 1 }</td>
                                        <td>{ product.title }</td>
                                        <td>{ product.price }</td>
                                        <td className="is-actions-cell">
                                            <div className="buttons">
                                                <Link to={'/product/edit/' + product.id} className="button is-small is-primary" type="button">
                                                    <span className="icon"><i className="mdi mdi-eye"></i></span>
                                                </Link>
                                                <button onClick={() => deleteProduct(product.id)} className="button is-small is-danger jb-modal" data-target="sample-modal" type="button">
                                                    <span className="icon"><i className="mdi mdi-trash-can"></i></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    )) }
                                </tbody>
                            </table>
                        </div>
                        <hr></hr>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProductsList;