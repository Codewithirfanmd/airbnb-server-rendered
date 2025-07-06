const Home = require("../models/home")
const fs = require("fs")

exports.getHomeList = (req, res, next)=> {
    Home.find().then(registeredHomes=> {
        res.render("host/host-home-list", {
            registeredHomes, 
            isLoggedIn: req.isLoggedIn,
            user: req.session.user
        })
    })
}

exports.addHome = (req, res, next)=> {
    res.render("host/addHome", {editing: false, 
        isLoggedIn: req.isLoggedIn})
}

exports.getEditHome = (req, res, next)=> {
    
    const homeId = req.params.homeId
    const editing = req.query.editing==="true"
    Home.findById(homeId).then(home=> {
        res.render("host/addHome", {editing, home, 
        isLoggedIn: req.isLoggedIn})
    })
    
}


exports.postAddHome = (req, res, next)=> {
    console.log("All-fields:", req.body)
    console.log("File:", req.file)
    if(!req.file) {
        return res.status(404).send("provide only jpg/jpeg files")
    }

    const {houseName, rating, price} = req.body
    const photo = req.file.path
    const home = new Home({houseName, photo, rating, price})
    home.save().then(()=> {
        res.render("host/addHomeSuccess", {
        isLoggedIn: req.isLoggedIn
        })
    })
}

exports.postEditHome = (req, res, next)=> {
    const {id, houseName, rating, price} = req.body
    Home.findById(id).then((home)=> {
        home.houseName = houseName
        home.rating = rating
        home.price = price

        if(req.file) {
            fs.unlink(home.photo, err=> {
                if(err) throw new Error("Problem while deleting previous image")
            })
            home.photo = req.file.path
        }


        home.save().then(()=> {
    
            res.redirect("/host/homeList")
        }).catch(err=> {
            console.log(err)
        })
    }).catch(err=> {
        console.log(err)
    })
}

exports.postDeleteHome = (req, res, next)=> {
    
    const homeId = req.params.homeId
    Home.findByIdAndDelete(homeId).then(()=> {

        res.redirect("/host/homeList")
    })
    
}