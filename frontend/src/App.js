import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import ProductAdd from "./components/Product/ProductAdd.js";
import ProductEdit from "./components/Product/ProductEdit.js";
import ProductsList from "./components/Product/ProductsList.js";
import UserAdd from "./components/User/UserAdd.js";
import UserEdit from "./components/User/UserEdit.js";
import UserList from "./components/User/UserList.js";
import "./css/main.css";
import "./js/main.js";

function App() {
  return (
    <BrowserRouter>
      <link rel="stylesheet" href="https://cdn.materialdesignicons.com/4.9.95/css/materialdesignicons.min.css"></link>
      <link rel="dns-prefetch" href="https://fonts.gstatic.com"></link>
      <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css"></link>
      <Routes>
        <Route exact path="/" element={<Login/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/dashboard" element={<Dashboard/>}/>
        <Route exact path="/product" element={<ProductsList/>}/>
        <Route exact path="/product/add" element={<ProductAdd/>}/>
        <Route exact path="/product/edit/:id" element={<ProductEdit />}/>
        <Route exact path="/user" element={<UserList/>}/>
        <Route exact path="/user/add" element={<UserAdd/>}/>
        <Route exact path="/user/edit/:id" element={<UserEdit />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
