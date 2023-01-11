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
            default: 500,
        },
        wins: {
            type: Number,
            default: 0,
        },
        gamesPlayed: {
            type: Number,
            default: 0,
        },
}
);

const User = mongoose.model("users_list", UserSchema);

module.exports = User;