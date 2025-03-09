import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import boardRouter from './api/board/board.routes.js';

const app = express();
const PORT = 1234;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/board', boardRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});