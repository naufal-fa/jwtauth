import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Product = db.define('products', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },    
    image: {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(Product);
Product.belongsTo(Users, {foreignKey: 'userId'});

export default Product;