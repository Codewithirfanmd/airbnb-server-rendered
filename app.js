const express = require("express")
const path = require("path")
const addHome = require("./routes/addHome")
const home = require("./routes/home")
const rootDir = require("./utils/path")
const { errorHandler } = require("./controller/error")
const mongoose = require("mongoose")
const auth = require("./routes/authRouter")
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const multer = require("multer")


const DB_PATH = "mongodb+srv://root:root@procodrr.fqbnxqe.mongodb.net/airbnb?retryWrites=true&w=majority&appName=ProCodrr"



const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

const store = new MongoDBStore({
    uri: DB_PATH,
    collecton: "sessions"
})

const randomName = (len)=> {
    const characters = "abcdefghijklmnopqrstuvwxyz"
    let result = ""
    for(let i=0;i<len;i++) {
        result += characters[Math.floor(Math.random()*characters.length)]
    }
    return result
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/")
    },

    filename(req, file, cb) {
        cb(null, randomName(10)+"-"+file.originalname)
    }
})

const fileFilter = (req, file, cb)=> {
    if(["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false)
    }
}


app.use(express.urlencoded())
app.use(multer({storage, fileFilter}).single("photo"))
app.use(express.static(path.join(rootDir, "public")))
app.use("/uploads", express.static(path.join(rootDir, "uploads")))
app.use("/host/uploads", express.static(path.join(rootDir, "uploads")))
app.use("/homes/uploads", express.static(path.join(rootDir, "uploads")))




app.use(session({
    secret: "Mohammed Irfan",
    resave: false,
    saveUninitialized: true,
    store
}))
app.use((req, res, next)=> {    
    req.isLoggedIn = req.session.isLoggedIn
    next()
})
app.use(auth)
app.use(home)
app.use("/host", (req, res, next)=> {
    if(req.isLoggedIn) {
        next()
    } else {
        res.redirect("/login");
    }
})
app.use("/host", addHome)
app.use(errorHandler)


mongoose.connect(DB_PATH).then(()=> {
    app.listen(3000, ()=> {
        console.log("the server has begun at: http://localhost:3000")
    })
}).catch(err=> {
    //console.log("Error while connecting", err)
})
