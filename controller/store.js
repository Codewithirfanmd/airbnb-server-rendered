
const Home = require("../models/home");
const User = require("../models/user");
const path = require("path")
const rootDir = require("../utils/path");

exports.getHomeList = (req, res, next)=> {
    Home.find().then(registeredHomes=> {
        res.render("store/home-list", {registeredHomes, 
        isLoggedIn: req.isLoggedIn,
            user: req.session.user})
    })
};

exports.getFavourites = async (req, res, next)=> {
    const userId = req.session.user._id
    const user = await User.findById(userId).populate("favourites")
    res.render("store/favourite-list", {allFavourites: user.favourites, 
        isLoggedIn: req.isLoggedIn,
            user: req.session.user})
}

exports.postFavourites = [(req, res, next)=> {
        if(req.isLoggedIn) {
            next()
        } else {
            res.redirect("/login");
        }
    },


    async (req, res, next)=> {
    // ////console.log("add Favourite: ", Favourites.addFavourite(req.body.id))
    // ////console.log(req.body.id)
    const homeId = req.body.id
    const userId = req.session.user._id
    const user = await User.findById(userId)
    if(!user.favourites.includes(homeId)) {
        user.favourites.push(homeId)
        await user.save()
    }

    res.redirect("/favourites")
    
}]

exports.getBookings = (req, res, next) => {
    res.render("store/bookings", 
        {isLoggedIn: req.isLoggedIn,
            user: req.session.user})
}

exports.getReserve = (req, res, next) => {
    res.render("store/reserve", {
        
        isLoggedIn: req.isLoggedIn,
            user: req.session.user
    })
}

exports.getHomeDetails = (req, res, next)=> {
    const homeId = req.params.homeId
    Home.findById(homeId).then(home=> {

        res.render("store/home-detail", {home, 
        isLoggedIn: req.isLoggedIn,
            user: req.session.user})
    })
}

exports.getHouseRules = (req, res, next)=> {
    const homeId = req.params.homeId
    if(!req.isLoggedIn) {
       return res.redirect("/login")
    } 
    const filePath = path.join(rootDir, "rules", "aicte-profile.pdf")
    res.download(filePath, "Rules.pdf")
}

exports.postRemoveFavourites = async (req, res, next)=> {
    const homeId = req.params.homeId
    const userId = req.session.user._id
    const user = await User.findById(userId)
    if(user.favourites.includes(homeId)) {
        user.favourites = user.favourites.filter(id=> {
            return id!=homeId
        })
        await user.save();
    }
    res.redirect("/favourites")
}