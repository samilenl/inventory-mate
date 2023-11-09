const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Item = require("./item")

const folderSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    description: { type: String },
    image: { 
        type: Schema.Types.ObjectId,
        ref: "Images",
    },
    date: {
        type: Date,
        default: Date.now()
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})


folderSchema.virtual("url").get(function(){
    return `/folder/${this._id}`
})

module.exports = mongoose.model("Folder", folderSchema)