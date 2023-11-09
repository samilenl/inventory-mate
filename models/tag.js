const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tagSchema = new Schema({
    name: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 100
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

tagSchema.virtual("url").get(function(){
    return `/tag/${this._id}`
})

module.exports = mongoose.model("Tag", tagSchema)