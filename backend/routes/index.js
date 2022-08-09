import express from "express";
import { getUsers, Register, Login, Logout, createUser, updateUser, deleteUser, getUserByID, Me } from "../controllers/Users.js";
import { getAllProducts, createProduct, getProductByID, updateProduct, deleteProduct } from "../controllers/Products.js";
import { verifyUser, isAdmin } from "../middleware/VerifyUser.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

// CRUD Login
router.get("/me", Me);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

// CRUD Products
router.get('/product', verifyUser, getAllProducts); // Verify Token
router.get('/product/:id', verifyUser, getProductByID);
router.post('/product/add', verifyUser, createProduct);
router.patch('/product/edit/:id', verifyUser, updateProduct);
router.delete('/product/delete/:id', verifyUser, deleteProduct);

// CRUD User
router.get('/user', verifyUser, isAdmin, getUsers); // Verify Token
router.get('/user/:id', verifyUser, isAdmin, getUserByID);
router.post('/user/add', verifyUser, isAdmin, createUser);
router.patch('/user/edit/:id', verifyUser, isAdmin, updateUser);
router.delete('/user/delete/:id', verifyUser, isAdmin, deleteUser);

export default router;