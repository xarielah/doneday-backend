import { dbService } from "../../services/db.service.js";

export const boardService = {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard
};

async function getBoards(filterBy = {}) {
    const collection = await dbService.getCollection('boards');
    const boards = await collection.find({}).toArray();
    return boards;
}

async function createBoard(board) {
    const collection = await dbService.getCollection('boards');
    const newBoard = await collection.insertOne(board);
    return newBoard;
}

async function updateBoard(board) {
    const collection = await dbService.getCollection('boards');
    const updatedBoard = await collection.updateOne({ _id: board._id }, board);
    return updatedBoard;
}

async function deleteBoard(board) {
    const collection = await dbService.getCollection('boards');
    const deletedBoard = await collection.deleteOne({ _id: board._id });
    return deletedBoard;
}