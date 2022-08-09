import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt, { compare } from "bcrypt";
import path from "path";
import fs from "fs";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['uuid', 'id', 'name', 'role', 'email']
    });
    res.json(users);
  } catch (error) {
    console.error(error);
  }
}

export const getUserByID = async (req, res) => {
  try {
    const user = await Users.findOne({
      attributes: [
        'uuid', 
        'id',
        'name',
        'email',
        'role',
        'image',
        'url'
      ],
      where: {
        id: req.params.id
      }
    });
    res.json(user);
  } catch (error) {
    res.json({message: error.message})
  }
}

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://localhost:3000/images/user/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({message: "Invalid Images"});
  if(fileSize > 10000000) return res.status(422).json({msg: "Images must be less than 10 MB"});

  file.mv(`../frontend/public/images/user/${fileName}`);

  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
      image: fileName,
      url: url
    });
    res.json({'message' : 'User terbuat'});
  } catch (error) {
    res.json({message: error.message})
  }
}

export const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id
    }
  });
  const { name, email, password, role } = req.body;
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  let fileName = '';
  if(!req.files.file) {
    fileName = user.image;
  }else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({message: "Invalid Images"});
    if(fileSize > 10000000) return res.status(422).json({msg: "Images must be less than 10 MB"});

    if(user.image == null) {

    }else {
      const filepath = `../frontend/public/images/user/${user.image}`;
      fs.unlinkSync(filepath);
    }
  
    file.mv(`../frontend/public/images/user/${fileName}`);

  }

  const url = `${req.protocol}://localhost:3000/images/user/${fileName}`;

  try {
    await Users.update({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
      image: fileName,
      url: url
    }, {
      where: {
        id: req.params.id
      }
    });
    res.json({'message' : 'User terupdate'});
  } catch (error) {
    res.json({message: error.message})
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id
      }
    })
    await Users.destroy({
      where: {
        id: req.params.id
      }
    });
    const filepath = `../frontend/public/images/user/${user.image}`;
    fs.unlinkSync(filepath);
    res.json({'message' : 'User terhapus'});
  } catch (error) {
    res.json({message: error.message})
  }
}

export const Register = async(req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const userEmail = await Users.findOne({
    where: {
      email: email
    }
  });
  if(userEmail) return res.status(400).json({msg: 'Email telah digunakan'});
  if (password !== confirmPassword) return res.status(400).json({msg: 'Password tidak sesuai'});
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: 'User',
    });
    res.json({msg: 'Register berhasil'});
    return res.status(200).json({status: 'success'});
  } catch (error) {
    console.log(error);
  }
}

export const Login = async(req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email
      }
    });
    if(!user) {
      return res.json({status: "No User"});
    }else {
      if(req.body.loginWith === false) {
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match) return res.status(400).json({msg: "Password salah"});
      }
      req.session.userId = user.uuid;
      const userId = user.id;
      const name = user.name;
      const email = user.email;
      const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15s"
      });
      const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d"
      });
      await Users.update({
        refresh_token: refreshToken
      }, {
        where: {
          id: userId
        }
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });

      return res.json({status: "User Valid", token: refreshToken})
    }
  } catch (error) {
    res.status(404).json({msg: "Email tidak ditemukan"});
    console.log(error);
  }
}

export const Me = async (req, res) => {
  if(!req.session.userId){
    return res.status(401).json({msg: "Mohon login ke akun anda"});
  }
  const user = await Users.findOne({
    attributes: ['uuid', 'name', 'email', 'role', 'url'],
    where: {
      uuid: req.session.userId
    }
  });
  if(!user) return res.status(401).json({msg: "User tidak ditemukan"});
  res.status(200).json(user);
}

export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findOne({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user) return res.sendStatus(204);
    const userId = user.id
    await Users.update({refresh_token: null}, {
      where: {
        id: userId
      }
    });
    res.clearCookie();
    req.session.destroy();
    return res.sendStatus(200);
  } catch (error) {
      console.log(error)
  }
}