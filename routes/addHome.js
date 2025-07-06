const express = require("express")

const hostController = require("../controller/host")

// console.log(rootDir)


const addHome = express.Router()

addHome.get("/homeList", hostController.getHomeList)

addHome.get("/addHome", hostController.addHome)

addHome.get("/edit-home/:homeId", hostController.getEditHome)

addHome.post("/edit-home", hostController.postEditHome)

addHome.post("/delete-home/:homeId", hostController.postDeleteHome)

addHome.post("/addHome", hostController.postAddHome)

module.exports = addHome