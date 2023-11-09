const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag"
    }],
    folders: [{
        type: Schema.Types.ObjectId,
        ref: "Folder",
    }]
})

module.exports = mongoose.model("User", userSchema)