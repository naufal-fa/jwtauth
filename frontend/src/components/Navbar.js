import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import axios from 'axios';

const Navbar = () => {

  
  const [ name, setName] = useState('');
  const [ preview, setPreview] = useState('');
  const [ expire, setExpire] = useState([]);
  const [ token, setToken] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
      refreshToken();
      Me();
  }, [])
  
  const refreshToken = async () => {
      try {
          const response = await axios.get('http://localhost:3001/token');
          setToken(response.data.accessToken)
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
      } catch (error) {
          if(error.response){
              navigate('/');
          }
      }
  }

  const Me = async () => {
    try {
      const response = await axios.get('http://localhost:3001/me');
      setPreview(response.data.url);
      setName(response.data.name)
    } catch (error) {
      if(error.response){
        navigate('/');
      }
    }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use( async(config) => {
      const currentDate = new Date();
      if(expire * 1000 < currentDate.getTime()){
          const response = await axios.get('http://localhost:3001/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setName(decoded.name);
          setExpire(decoded.exp);
      }
      return config;
  }, (error) => {
      return Promise.reject(error) //
  });

  const Logout = async () => {
    try {
        await axios.delete('http://localhost:3001/logout');
        navigate('/');
    } catch (error) {
        console.info(error);
    }
  }

  return (
    <nav id="navbar-main" className="navbar is-fixed-top">
      <div className="navbar-brand">
        <a className="navbar-item is-hidden-desktop jb-aside-mobile-toggle">
            <span className="icon"><i className="mdi mdi-forwardburger mdi-24px"></i></span>
        </a>
        {/* <div className="navbar-item has-control">
            <div className="control"><input placeholder="Search everywhere..." className="input"></input></div>
        </div> */}
      </div>
      <div className="navbar-brand is-right">
      <a className="navbar-item is-hidden-desktop jb-navbar-menu-toggle" data-target="navbar-menu">
          <span className="icon"><i className="mdi mdi-dots-vertical"></i></span>
      </a>
      </div>
      <div className="navbar-menu fadeIn animated faster" id="navbar-menu">
        <div className="navbar-end">
          {/* <div className="navbar-item has-dropdown has-dropdown-with-icons has-divider is-hoverable">
            <a className="navbar-link is-arrowless">
                <span className="icon">
                <i className="mdi mdi-menu"></i>
                </span>
                <span>Sample Menu</span>
                <span className="icon">
                <i className="mdi mdi-chevron-down"></i>
                </span>
            </a>
            <div className="navbar-dropdown">
                <a href="profile.html" className="navbar-item is-active">
                  <span className="icon"><i className="mdi mdi-account"></i></span>
                  <span>My Profile</span>
                </a>
                <a className="navbar-item">
                  <span className="icon"><i className="mdi mdi-settings"></i></span>
                  <span>Settings</span>
                </a>
                <a className="navbar-item">
                  <span className="icon"><i className="mdi mdi-email"></i></span>
                  <span>Messages</span>
                </a>
                <hr className="navbar-divider"></hr>
                <a className="navbar-item">
                  <span className="icon"><i className="mdi mdi-logout"></i></span>
                  <span>Log Out</span>
                </a>
            </div>
          </div> */}
          <div className="navbar-item has-dropdown has-dropdown-with-icons has-divider has-user-avatar is-hoverable">
            <a className="navbar-link is-arrowless">
                <div className="is-user-avatar">
                <img src={preview !== null ? preview : "http://localhost:3000/images/user/user.png"} alt={name.toUpperCase()}></img>
                </div>
                <div className="is-user-name">
                <span>{name.toUpperCase()}</span>
                </div>
                <span className="icon"><i className="mdi mdi-chevron-down"></i></span>
            </a>
            <div className="navbar-dropdown">
                {/* <a href="profile.html" className="navbar-item is-active">
                  <span className="icon"><i className="mdi mdi-account"></i></span>
                  <span>My Profile</span>
                </a>
                <a className="navbar-item">
                  <span className="icon"><i className="mdi mdi-settings"></i></span>
                  <span>Settings</span>
                </a>
                <a className="navbar-item">
                  <span className="icon"><i className="mdi mdi-email"></i></span>
                  <span>Messages</span>
                </a>
                <hr className="navbar-divider"></hr> */}
                <a onClick={Logout} className="navbar-item is-danger">
                  <span className="icon"><i className="mdi mdi-logout"></i></span>
                  <span>Log Out</span>
                </a>
          </div>
          </div>
          {/* <a href="https://justboil.me/bulma-admin-template/free-html-dashboard/" title="About" className="navbar-item has-divider is-desktop-icon-only">
            <span className="icon"><i className="mdi mdi-help-circle-outline"></i></span>
            <span>About</span>
          </a>
          <a title="Log out" className="navbar-item is-desktop-icon-only">
            <span className="icon"><i className="mdi mdi-logout"></i></span>
            <span>Log out</span>
          </a> */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;