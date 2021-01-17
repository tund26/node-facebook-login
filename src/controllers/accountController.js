const Account = require("../models/account");
const { isFbAuthenticate } = require("../services/accountService");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getSingleById = async (req, res) => {
    return res.json({ message: "successfully" });
}

/**
 * 
 * @param {*} req
 * @param {*} res
 */
const authenticate = async (req, res) => {
    let accessToken = req.body.access_token;
    if(!accessToken) {
        return res.status(400).send({ message: "Missing access token!" });
    }

    let expiresTokenIn = req.body.expires_in;
    if(!expiresTokenIn) {
        return res.status(400).send({ message: "Missing token expiration time" })
    }

    try {
        let isAuthenticate = await isFbAuthenticate(accessToken, expiresTokenIn);        
        if(isAuthenticate) {
            return res.json({ active: isAuthenticate });
        }

        throw new Error();
    }
    catch(exception) {
        console.log(exception);
        return res.status(400).send({ message: "Authentication failed or token expired, please try again" });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const isValidRequest = async (req, res, next) => {
    let headers = req.headers;
    if(!headers) {
        return res.status(400).send({ message: "Headers are invalid" });
    }

    let authorization = headers.authorization;
    if(!authorization) {
        return res.status(400).send({ message: "Brarer token in not exist" });
    }

    let token = authorization.split(" ");
    if(token.length !== 2) {
        return res.status(400).send({ message: "Bearer token is invalid" });
    }

    if(token[0] !== "Bearer" && !token[1]) {
        return res.status(401).send({ message: "Unauthorized!" });
    }

    let account = await Account.findOne({ access_token: token[1] }).exec();
    if(!account || !account.access_token) {
        return res.status(401).send({ message: "Unauthorized!" });
    }

    console.log("accepted");
    next();
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const logout = async (req, res) => {
    let accessToken = req.body.access_token;
    if(!accessToken) {
        return res.status(400).send({ message: "Missing access token!" });
    }

    let account = await Account.findOne({ access_token: accessToken }).exec();
    if(!account) {
        return res.status(400).send({ message: "Account not found!" });
    }

    account.access_token = undefined;
    await account.save((error) => {
        if(error) {
            return res.status(500).send(error);
        }

        return res.json({ message: "Logout successfully!" });
    });
}

module.exports = { getSingleById, authenticate, isValidRequest, logout }