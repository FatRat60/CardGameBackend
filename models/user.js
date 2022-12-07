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
        money: {
            type: Number,
        },
        wins: {
            type: Number,
        },
        gamesPlayed: {
            type: Number,
        },
},

{ collection: "users_list "}
);

module.exports = UserSchema;