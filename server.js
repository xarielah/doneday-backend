import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import authRouter from './api/auth/auth.routes.js';
import boardRouter from './api/board/board.routes.js';
import userRouter from './api/user/user.routes.js';
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js';
import { logger } from './services/logger.service.js';
import { setupSocketAPI } from './services/socket.service.js';

const app = express();
const server = http.createServer(app)
const PORT = process.env.PORT || 1234;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use('*', setupAsyncLocalStorage)

app.use('/api/board', boardRouter)
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

setupSocketAPI(server)

app.get('/**', (_, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


app.listen(PORT, () => {
    logger.info('Server is running on port: ' + PORT)
});