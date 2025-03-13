import { socketService } from "../../services/socket.service.js";
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
        const { name, groups, color } = req.body;

        if (!name || !groups || !color)
            return res.status(400).send({ err: 'Missing required fields' });

        const boardToCreate = {
            name: req.body.name,
            groups: req.body.groups,
            color: req.body.color,
        };

        const newBoard = await boardService.createBoard(boardToCreate);
        await socketService.broadcast({ type: 'updated-board', data: newBoard._id, room: newBoard._id, userId: req.user._id })
        return res.status(201).send(newBoard);
    } catch (error) {
        console.log('ERROR: cannot create board in DB', error);
        return res.status(500).send('Encountered an error trying to create board');
    }
}

async function updateBoard(req, res) {
    try {
        const board = req.body;
        const boardId = req.params.id;

        const boardToUpdate = {
            _id: boardId,
            name: board.name,
            groups: board.groups,
            color: board.color,
        }

        const updatedBoard = await boardService.updateBoard(boardToUpdate);
        await socketService.broadcast({ type: 'updated-board', data: updatedBoard, room: 'board:' + boardId, userId: req.user._id })
        return res.send(updatedBoard);
    } catch (error) {
        console.log('ERROR: cannot update board in DB', error);
        return res.status(400).send('Encountered an error trying to update board');
    }
}

async function deleteBoard(req, res) {
    try {
        const boardId = req.params.boardId;
        await boardService.deleteBoard(boardId);
        await socketService.broadcast({ type: 'deleted-board', data: boardId, room: boardId, userId: req.user._id })
        return res.send(`Delete board with id \"${boardId}\" deleted`);
    } catch (error) {
        console.log('ERROR: cannot delete board', error);
        return res.status(500).send(`Could not delete board with id \"${boardId}\"`);
    }
}