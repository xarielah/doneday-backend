import bcrypt from 'bcrypt';
import Cryptr from 'cryptr';
import { logger } from "../../services/logger.service.js";
import { userService } from "../user/user.service.js";

const cryptr = new Cryptr(process.env.CRYPTR_KEY || 'some-very-secret-key-123');

export const authService = {
    login,
    register,
    getLoginToken,
    validateToken
};

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`);

    if (!username || !password)
        return Promise.reject('Missing username and password');

    const user = await userService.getUserByUsername(username);
    if (!user) return Promise.reject('User not found');

    const arePasswordsEqual = await bcrypt.compare(password, user.password);
    if (!arePasswordsEqual) return Promise.reject('Passwords are not equal');

    delete user.password;
    user._id = user._id.toString();

    return user;
}

async function register(user) {
    logger.debug(`auth.service - signup with username: ${user.username}, fullname: ${user.fullname}`);

    const foundUser = await userService.getUserByUsername(user.username);
    if (foundUser) return Promise.reject('Username already exists');

    const newUser = await userService.createUser(user);
    return newUser;
}

function getLoginToken(user) {
    const userInfo = {
        _id: user._id,
        fullname: user.fullname,
        score: user.score,
        isAdmin: user.isAdmin,
    }
    return cryptr.encrypt(JSON.stringify(userInfo))
}


function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}
