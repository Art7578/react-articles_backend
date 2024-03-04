import express from "express";
import multer from "multer";
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from "mongoose";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";
import { checkAuth} from "./utils/checkAuth.js";
import { handleErrors } from "./utils/handleErrors.js";
import { register, login, getMe } from "./controllers/UserController.js";
import { create, getAll, getLastTags, getOne, remove, update, getTag } from "./controllers/ArticleController.js";

dotenv.config();
const {DB_HOST, PORT} = process.env;

mongoose
    .connect(DB_HOST)
    .then(() => console.log("DB connectin OK!"))
    .catch((error) => console.log("DB error", error));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/upload', express.static('uploads'));

app.post('/auth/register', registerValidation, handleErrors, register);
app.post('/auth/login', loginValidation, handleErrors, login);
app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`,
    });
});

app.post('/posts',
   checkAuth,
   postCreateValidation,
   handleErrors,
   create 
);
app.get('/posts', getAll);
app.get('/posts/tags', getLastTags);
app.get('/tags', getLastTags);
app.get('/posts/:id', getOne);
app.get('/posts/tag/:tag', getTag);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id',
    checkAuth,
    postCreateValidation,
    handleErrors,
    update
);

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log("Server OK!")
});