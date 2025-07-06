const express = require("express")
const storeController = require("../controller/store")
const home = express.Router()

home.get("/", storeController.getHomeList)

home.get("/favourites", storeController.getFavourites)

home.post("/favourites", storeController.postFavourites)

home.get("/bookings", storeController.getBookings)

home.get("/reserve", storeController.getReserve)

home.get("/homes/:homeId", storeController.getHomeDetails)

home.post("/remove-favourite/:homeId", storeController.postRemoveFavourites)

home.get("/rules/:homeId", storeController.getHouseRules)


module.exports = home