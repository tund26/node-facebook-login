const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const AccountSchema = mongoose.Schema({
    name: String,
    type: String,
    user_id: {
        type: String,
        unique: true,
    },
    access_token: String,
    created_at: Date,
    updated_at: Date,
});

AccountSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Account", AccountSchema);