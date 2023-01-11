const mongoose = require("mongoose");
const uri = "mongodb+srv://FatRat360:IL5DXwVw2UyyrinC@main.x8vxshx.mongodb.net/?retryWrites=true&w=majority";
const UserSchema = require("./user");

let client;

function getClient() {
    if (!client) {
        console.log("Trying connection");
        mongoose.connect(uri, 
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

async function addUser(user) {
    getClient();
    const userCheck = await findUserByUsername(user.username);
    if (userCheck.length != 0) return false;
    try {
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
        oldUser.overwrite(newUser);
        editedUser = await oldUser.save();
        return editedUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.findUserByUsername = findUserByUsername;
exports.addUser = addUser;
exports.updateUser = updateUser;