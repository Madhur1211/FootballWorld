//users in database
const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")

const userSchemaDefinition = {
    username: {type: String},
    password: {type: String},
    oauthId: {type: String},
    oauthProvider: {type: String},
    created: {type: Date},
}

const userSchema = new mongoose.Schema(userSchemaDefinition);
//pass encryption
userSchema.plugin(plm);

module.exports = new mongoose.model("user", userSchema);