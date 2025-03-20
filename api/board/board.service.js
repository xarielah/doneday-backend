import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service.js";

export const boardService = {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardById
};

async function getBoards() {
    const collection = await dbService.getCollection('boards');
    const boards = await collection.find({}).toArray();
    return boards;
}

async function createBoard(board) {
    const collection = await dbService.getCollection('boards');
    const result = await collection.insertOne(board);

    board._id = result.insertedId.toString();

    return board;
}

async function updateBoard(board) {
    const collection = await dbService.getCollection('boards');
    const boardId = board._id;

    const { matchedCount } = await collection.updateOne({ _id: ObjectId.createFromHexString(boardId) }, { $set: { 'name': board.name, 'groups': board.groups, 'color': board.color } });

    if (matchedCount === 0)
        return Promise.reject('Could not find board to update');

    board._id = boardId;

    return board;
}

async function getBoardById(boardId) {
    const collection = await dbService.getCollection('boards');
    const board = await collection.findOne({ _id: ObjectId.createFromHexString(boardId) });

    if (!board)
        return Promise.reject('Could not find board');

    return board;
}

async function deleteBoard(boardId) {
    const collection = await dbService.getCollection('boards');
    const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(boardId) });

    if (deletedCount === 0)
        return Promise.reject('Could not delete board');

    return deletedCount;
}