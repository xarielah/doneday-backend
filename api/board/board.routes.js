import { Router } from 'express';
import { boardController } from './board.controller.js';

const boardRouter = Router();

boardRouter.get('/', boardController.getBoards);
boardRouter.post('/', boardController.createBoard);
boardRouter.put('/:id', boardController.updateBoard);
boardRouter.delete('/:id', boardController.deleteBoard);

export default boardRouter;