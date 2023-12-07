
// import mongoose
const mongoose = require('mongoose')

//Create Schema definition object
const schemaDefinition = {
     team: {
        type: String,
        required: true
     },
     captain: {
        type: String,
        required: true
     },
     manager: {
        type: String,
        required: true
     }
}

//Create mongoose schema using the definition object
var mongooseSchema = new mongoose.Schema(schemaDefinition);

//Create and export a mongoose model
module.exports = mongoose.model("Team", mongooseSchema)