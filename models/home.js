const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
    houseName: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    rating: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
    
})

// homeSchema.pre("findOneAndDelete", async function(next) {
//     console.log("Running pre-hook")
//     const homeId = this.getQuery()._id;
//     await Favourite.deleteMany({homeId})
//     next()
// })

module.exports = mongoose.model("Home", homeSchema)
