const mongoose = require("mongoose");
const UserSchema = require("./user");
var randomWords = require('random-words');


let client;

function getClient() {
    if (!client) {
        console.log("Trying connection");
        mongoose.connect(process.env.MONGODB_URI, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
        });
        mongoose.set('strictQuery', true);
        client = mongoose.connection;
    }
    
    return client;
}

async function findUserByUsername(username) {
    getClient();
    const result = await UserSchema.find({ username: username });
    console.log("searched for " + username);
    return result;
}

async function getAllUsers() {
    getClient();
    const result = await UserSchema.find({}, 'displayName money wins gamesPlayed');
    return result;
}

async function addUser(user) {
    getClient();
    const userCheck = await findUserByUsername(user.username);
    if (userCheck.length != 0) return false;
    try {
        user.displayName = randomWords({ exactly: 2, join: "" }) + Math.floor(Math.random() * 100);
        const userToAdd = new UserSchema(user);
        const savedUser = await userToAdd.save();
        return savedUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function updateUser(newUser) {
    const userCheck = await findUserByUsername(newUser.username);
    if (userCheck.length == 0) return false;
    oldUser = userCheck[0];
    try {
        newUser.password = oldUser.password;
        oldUser.overwrite(newUser);
        editedUser = await oldUser.save();
        return editedUser;
    } catch (error) {
        console.log("maxie");
        console.log(error);
        return false;
    }
}

exports.findUserByUsername = findUserByUsername;
exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;