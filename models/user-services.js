const mongoose = require("mongoose");
const uri = "mongodb+srv://main.x8vxshx.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority";
const UserSchema = require("./user");

let dbConnection;

function setConnection(newConn) {
    dbConnection = newConn;
    return dbConnection;
}

function getDbConnection() {
    if (!dbConnection) {
        dbConnection = mongoose.createConnection(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    return dbConnection;
}

async function findUserByUsernmae(username) {
    const userModel = getDbConnection().model("user", UserSchema);
    const result = await userModel.find({ username: username });
    return result;
}

async function addUser(user) {
    const userModel = getDbConnection().model("user", UserSchema);
    const userCheck = await findUserByUsernmae(user.username);
    if (userCheck.length != 0) return false;
    try {
        const userToAdd = new userModel(user);
        const savedUser = await userToAdd.save();
        return savedUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function updateUser(newUser) {
    const userCheck = await findUserByUsernmae(newUser.username);
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

exports.findUserByUsernmae = findUserByUsernmae;
exports.addUser = addUser;
exports.updateUser = updateUser;