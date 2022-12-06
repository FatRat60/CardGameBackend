const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        displayName: {
            type: String,
            trim: true,
        },
        profile: {
            type: String,
        },
        wins: {
            type: Integer,
        },
},

{ collection: "users_list "}
);

module.exports = UserSchema;