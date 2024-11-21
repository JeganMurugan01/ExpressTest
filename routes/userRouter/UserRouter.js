const express = require("express");
const { authenticateToken } = require("../../helper/AuthValidation");
const { userController } = require("../../controller/userController/UserController");

const UserRouter = express.Router();

UserRouter.get('/getAllUsers',authenticateToken,userController?.getUsers)


module.exports = { UserRouter };
