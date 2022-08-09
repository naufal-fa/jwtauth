import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import SequlizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";
import session from "express-session";
dotenv.config()
const app = new express();

const sessionStore = SequlizeStore(session.Store);

const store = new sessionStore({
  db: db
})

try {
  // await db.sync();
  await db.authenticate();
  console.log("Database connected...");
} catch (error) {
  console.error(error);
}

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: 'auto'
  }
}));
app.use(express.json());
app.use(FileUpload());
app.use(router);

// store.sync();

app.listen(3001, () => console.log("Server running at port 3001"));