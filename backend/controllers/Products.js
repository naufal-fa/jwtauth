import Product from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import path from "path";
import fs from "fs";

export const getAllProducts = async (req, res) => {
    try {
        let response;
        if(req.role === "Admin"){
            response = await Product.findAll({
                include: [{
                    model: Users
                }]
            });
        }else if(req.role === "User"){
            response = await Product.findAll({
                where: {
                    userId: req.userId 
                },
                include: [{
                    model: Users
                }]
            })
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getProductByID = async (req, res) => {
    try {
        const product = await Product.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(product[0]);
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const createProduct = async (req, res) => {
    const { title, price } = req.body;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://localhost:3000/images/product/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];
  
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({message: "Invalid Images"});
    if(fileSize > 10000000) return res.status(422).json({msg: "Images must be less than 10 MB"});
  
    file.mv(`../frontend/public/images/product/${fileName}`);

    try {
        await Product.create({
            title: title,
            price: price,
            url: url,
            image: fileName,
            userId: req.userId
        });
        res.status(200).json(req.body)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateProduct = async (req, res) => {
    const [ title, price] = req.body;
    let fileName = '';

    const product = await Product.findOne({
        where: {
          id: req.params.id
        }
    });

    if(req.files == null) {
      fileName = product.image;
    }else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = ['.png', '.jpg', '.jpeg'];
  
      if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({message: "Invalid Images"});
      if(fileSize > 10000000) return res.status(422).json({msg: "Images must be less than 10 MB"});
  
      if(product.image == null) {
  
      }else {
        const filepath = `../frontend/public/images/product/${product.image}`;
        fs.unlinkSync(filepath);
      }
    
      file.mv(`../frontend/public/images/product/${fileName}`);
    }

    const url = `${req.protocol}://localhost:3000/images/product/${fileName}`;

    try {
        await Product.update({
            title: title,
            price: price,
            url: url,
            image: fileName,
            userId: req.userId
        }, {
            where : {
                id : req.params.id 
            }
        });
        res.json(req.body)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
          where: {
            id: req.params.id
          }
        })
        await Product.destroy({
          where: {
            id: req.params.id
          }
        });
        const filepath = `../frontend/public/images/product/${product.image}`;
        fs.unlinkSync(filepath);
        res.json({'message' : 'Product terhapus'});
      } catch (error) {
        res.json({message: error.message})
      }
}