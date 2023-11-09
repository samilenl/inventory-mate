const mongoose = require("mongoose")
const Schema = mongoose.Schema

const itemSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    quantity: {
        type: Number, 
        default: 1
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
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag"
    }],
    folder: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

itemSchema.virtual("url").get(function(){
    return `/item/${this._id}`
})

module.exports = mongoose.model("Item", itemSchema)