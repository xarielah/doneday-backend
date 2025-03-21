import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import authRouter from './api/auth/auth.routes.js';
import boardRouter from './api/board/board.routes.js';
import userRouter from './api/user/user.routes.js';
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js';
import { logger } from './services/logger.service.js';
import { setupSocketAPI } from './services/socket.service.js';

const app = express();

const PORT = process.env.PORT || 3030;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://localhost:5173'
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.all('*', setupAsyncLocalStorage)

app.use('/api/board', boardRouter)
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)


app.get('/**', (_, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const server = app.listen(PORT, () => {
    logger.info('Server is running on port: ' + PORT)
});

setupSocketAPI(server)