const { check, validationResult } = require("express-validator")
const User = require("../models/user")
const bcrypt = require("bcryptjs")

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        isLoggedIn: req.isLoggedIn,
        errors: [],
        oldInput: {email: ""},
        
    })
}

exports.getSignUp = (req, res, next) => {
    res.render("auth/signup", {
        isLoggedIn: req.isLoggedIn,
        errors: [],
        oldInput: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            userType: ""
        }
    })
}

exports.postLogin = async (req, res, next) => {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user) {
        return res.status(422).render("auth/login", {
            isLoggedIn: req.isLoggedIn,
            errors: ["User doesn't Exist!"],
            oldInput: {email}
        })
    }

    const isCorrect = await bcrypt.compare(password, user.password)
    if(!isCorrect) {
        return res.status(422).render("auth/login", {
            isLoggedIn: req.isLoggedIn,
            errors: ["Invalid Password!"],
            oldInput: {email}
        })
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    // console.log("Before saving", req.session)
    // req.session.save()
    res.redirect("/")
}

exports.postSignup = [

    check("firstname")
    .notEmpty()
    .withMessage("First Name is required")
    .trim()
    .isLength({min: 2})
    .withMessage("First Name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First Name can only contain letters"),

    check("lastname")
    .notEmpty()
    .withMessage("Last Name is required")
    .trim()
    .isLength({min: 2})
    .withMessage("Last Name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last Name can only contain letters"),

    check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
    
    check("password")
    .isLength({min: 8})
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain atleast one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain atleast one uppercase letter")
    .matches(/[!@&]/)
    .withMessage("Password must contain atleast one special character")
    .trim(),
    
    check("confirmPassword")
    .trim()
    .custom((value, {req})=> {
        if(value != req.body.password) {
            throw new Error("Passwords do not match")
        }
        return true;
    }),
    
    check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),
    
    
    
    check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .custom((value, {req})=> {
        if(value != "on") {
            throw new Error("You must accept the terms and conditions")
        }
        return true;
    }),
    
    
    
    (req, res, next) => {
    const {firstname, lastname, email, password, userType} = req.body
    //////console.log(userType)
    const errors = validationResult(req)
    if(!errors.isEmpty()) {

        res.status(422).render("auth/signup", {
            isLoggedIn: req.isLoggedIn,
            errors: errors.array().map(err=> err.msg),
            oldInput: {
                firstname,
                lastname,
                email,
                password,
                userType
            }
        })
    } else {
        bcrypt.hash(password, 12).then(hashedPassword=> {
            const user = new User({firstname, lastname, email, password: hashedPassword, userType})
            return user.save()
            
        }).then(()=> {
            res.redirect("/login")
        }).catch(err=> {
            res.status(422).render("auth/signup", {
                errors: [err.message],
                oldInput: {
                    firstname,
                    lastname,
                    email,
                    password,
                    userType
                }
            })
        })
    }
}]

exports.postLogout = (req, res, next) => {
    req.session.destroy(()=> {
        res.redirect("/")
    })
}