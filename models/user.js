const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["guest", "host"],
        default: "guest",
        required: true
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Home"
    }],

    
})

module.exports = mongoose.model("User", userSchema)
