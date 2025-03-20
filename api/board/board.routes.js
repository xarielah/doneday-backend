import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth.middleware.js';
import { boardController } from './board.controller.js';

const boardRouter = Router();

boardRouter.get('/', requireAuth, boardController.getBoards);
boardRouter.get('/:id', requireAuth, boardController.getBoardById);
boardRouter.post('/', requireAuth, boardController.createBoard);
boardRouter.put('/:id', requireAuth, boardController.updateBoard);
boardRouter.delete('/:id', requireAuth, boardController.deleteBoard);

export default boardRouter;