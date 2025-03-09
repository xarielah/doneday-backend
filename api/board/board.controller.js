import { boardService } from "./board.service.js";

export const boardController = {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard
};

async function getBoards(req, res) {
    try {
        const boards = await boardService.getBoards();
        res.send(boards);
    } catch (error) {
        console.log('ERROR: cannot fetch boards from DB', error);
    }
}

async function createBoard(req, res) {
    const board = req.body;
    const newBoard = await boardService.createBoard(board);
    res.send(newBoard);
}

async function updateBoard(req, res) {
    res.send('updateBoard');
}

async function deleteBoard(req, res) {
    res.send('deleteBoard');
}