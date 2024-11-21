const bcrypt = require("bcrypt");
const { userModel } = require("../service/userService");

const userController = {
  getUsers: async (req, res) => {
    const userType = req.userType;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    if (userType != "ADMIN") {
      res.status(200).send({ data: "No Access" });
    }
    try {
      const result = await userModel.getAllUsers(page, limit);
      res.status(200).send({ data: result, page, limit });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  addUsers: async (req, res) => {
    try {
      const { firstName, lastName, email, password, userType } = req?.body;
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      if (!["ADMIN", "USER", "COADMIN"].includes(userType)) {
        return res.status(400).send({ data: "Invalid userType" });
      }
      await userModel?.addUser({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash,
        userType: userType,
      });
      res.status(200).send({ data: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.message === "User already exists") {
        return res
          .status(400)
          .send({ data: "User with this email already exists" });
      }
      res.status(500).send({ data: "Internal Server Error" });
    }
  },
  addUserProfile: async (req, res) => {
    try {
      const userId = req.userId;
      const { address, pincode, phoneNumber, state } = req?.body;
      await userModel?.addUserProfile({
        address: address,
        pincode: pincode,
        phoneNumber: phoneNumber,
        state: state,
        userId: userId,
      });

      res.status(200).send({ data: "User Profile added successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.message === "User profile already exists") {
        return res.status(400).send({ data: error.message });
      }
      res.status(500).send({ data: "Internal Server Error" });
    }
  },
  findUserById: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userModel.findUserById(userId);

      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error finding user by ID:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  updateUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { firstName, lastName, email } = req.body;

      const updatedData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };
      const success = await userModel.updateUser(userId, updatedData);
      if (success) {
        res.status(200).send({ data: "User updated successfully" });
      } else {
        res.status(404).send({ data: "User not found or no changes applied" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send({ data: "Internal Server Error" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const success = await userModel.deleteUser(userId);

      if (success) {
        res.status(200).send({ data: "User deleted successfully" });
      } else {
        res.status(404).send({ data: "User not found or couldn't be deleted" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send({ data: "Internal Server Error" });
    }
  },
  userConfig: async (req, res) => {
    const { userType, userId } = req.body;
    if (
      (userType !== "ADMIN" && userType !== "USER" && userType !== "COADMIN") ||
      !userId
    ) {
      res.status(400).send({ data: "Invalid userType or userId is missing" });
    }
    const result = await userModel?.userConfig(userType, userId);
    res.status(result ? 200 : 400).send({ data: result ?? "User not found " });
  },
  meteUserData: async (req, res) => {
    const Type = req.params.Type;
    const userType = req.userType;
    if (userType != "ADMIN") {
      res.status(400).send({ data: "No Access" });
    }
    const result = await userModel?.getMetaData();
    res.status(200).send({ data: result });
  },
  userMappedLanguage: async (req, res) => {
    try {
      const result = await userModel?.userLanguageMapped(req);
      if (result === true) {
        res.status(200).send({ data: "Language added successfully" });
      } else {
        res
          .status(400)
          .send({
            data: "Failed to add language. Language may already be mapped to this user.",
          });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send({ data: error.message });
    }
  },
};
module.exports = { userController };
