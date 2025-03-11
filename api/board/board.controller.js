import { boardService } from "./board.service.js";

export const boardController = {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard
};

async function getBoards(_, res) {
    try {
        const boards = await boardService.getBoards();
        return res.send(boards);
    } catch (error) {
        console.log('ERROR: cannot fetch boards from DB', error);
        return res.status(500).send('Encountered an error trying to fetch boards');
    }
}

async function createBoard(req, res) {
    try {
        const board = req.body;
        const newBoard = await boardService.createBoard(board);
        return res.status(201).send(newBoard);
    } catch (error) {
        console.log('ERROR: cannot create board in DB', error);
        return res.status(500).send('Encountered an error trying to create board');
    }
}

async function updateBoard(req, res) {
    try {
        const board = req.body;
        const updatedBoard = await boardService.updateBoard(board);

        if (!updatedBoard)
            return res.status(404).send('Could not find and update board with id \"${board.id}\"');

        return res.send(updatedBoard);
    } catch (error) {
        console.log('ERROR: cannot update board in DB', error);
        return res.status(500).send('Encountered an error trying to update board');
    }
}

async function deleteBoard(req, res) {
    try {
        const boardId = req.params.boardId;
        const deletedBoard = await boardService.deleteBoard(boardId);

        if (!deletedBoard)
            return res.status(400).send('Could not delete board with id \"${boardId}\"');

        return res.send(`Delete board with id \"${boardId}\" deleted`);
    } catch (error) {
        console.log('ERROR: cannot delete board from DB', error);
        return res.status(500).send('Encountered an error trying to delete board');
    }
}