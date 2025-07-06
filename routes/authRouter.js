const express = require("express")
const authController = require("../controller/auth")
const auth = express.Router()

auth.get("/login", authController.getLogin)
auth.post("/login", authController.postLogin)
auth.post("/logout", authController.postLogout)

auth.get("/signup", authController.getSignUp)
auth.post("/signup", authController.postSignup)
module.exports = auth