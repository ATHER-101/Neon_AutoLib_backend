import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import passport from "passport";
import dotenv from 'dotenv';
import './google-strategy.mjs';
import books from './routes/books.mjs';
import issues from './routes/issues.mjs';
import bookmarks from './routes/bookmarks.mjs';
import users from './routes/users.mjs';
import authentication from './routes/authentication.mjs';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: 'https://autolib.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${process.env.FRONTEND}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  next();
});

app.use(passport.initialize());

app.use(books);
app.use(users);
app.use(issues);
app.use(bookmarks);
app.use(authentication);

app.listen(port, () => console.log(`Listening on http://localhost:${port} !`));
