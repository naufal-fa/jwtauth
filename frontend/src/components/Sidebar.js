import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    Me();
  }, [])

  const Me = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3001/me');
        setRole(response.data.role);
    } catch (error) {
        
    }
  }

  return (
    <div>
        <aside className="aside is-placed-left is-expanded">
            <div className="aside-tools">
            <div className="aside-tools-label">
                <span><b>JWT</b> ReactJS & ExpressJS</span>
            </div>
            </div>
            <div className="menu is-menu-main">
            <p className="menu-label">General</p>
            <ul className="menu-list">
                <li>
                <NavLink to="/dashboard" className={({isActive}) => isActive ? 'has-icon is-active' : 'has-icon'}>
                    <span className="icon"><i className="mdi mdi-desktop-mac"></i></span>
                    <span className="menu-item-label">Dashboard</span>
                </NavLink>
                </li>
            </ul>
            <p className="menu-label">Feature</p>
            <ul className="menu-list">
                <li>
                    {role == "Admin" ?                     
                    <NavLink to="/user" className={({isActive}) => isActive ? 'has-icon is-active' : 'has-icon'}>
                        <span className="icon has-update-mark"><i className="mdi mdi-table"></i></span>
                        <span className="menu-item-label">Users</span>
                    </NavLink> : ""}
                </li>
                <li>
                    <NavLink to="/product" className={({isActive}) => isActive ? 'has-icon is-active' : 'has-icon'}>
                        <span className="icon"><i className="mdi mdi-square-edit-outline"></i></span>
                        <span className="menu-item-label">Product</span>
                    </NavLink>
                </li>
                {/* <li>
                    <a className="has-icon has-dropdown-icon">
                        <span className="icon"><i className="mdi mdi-view-list"></i></span>
                        <span className="menu-item-label">Submenus</span>
                        <div className="dropdown-icon">
                        <span className="icon"><i className="mdi mdi-plus"></i></span>
                        </div>
                    </a>
                    <ul>
                        <li>
                        <a href="#void">
                            <span>Sub-item One</span>
                        </a>
                        </li>
                        <li>
                        <a href="#void">
                            <span>Sub-item Two</span>
                        </a>
                        </li>
                    </ul>
                </li> */}
            </ul>
            {/* <p className="menu-label">About</p>
            <ul className="menu-list">
                <li>
                <a href="https://github.com/vikdiesel/admin-one-bulma-dashboard" target="_blank" className="has-icon">
                    <span className="icon"><i className="mdi mdi-github-circle"></i></span>
                    <span className="menu-item-label">GitHub</span>
                </a>
                </li>
                <li>
                <a href="https://justboil.me/bulma-admin-template/free-html-dashboard/" className="has-icon">
                    <span className="icon"><i className="mdi mdi-help-circle"></i></span>
                    <span className="menu-item-label">About</span>
                </a>
                </li>
            </ul> */}
            </div>
        </aside>
    </div>
  )
}

export default Sidebar;