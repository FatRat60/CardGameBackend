const mongoose = require("mongoose");
const uri = "mongodb+srv://<FatRat360>:<!YpgZFz.W.B72@g>@main.x8vxshx.mongodb.net/?retryWrites=true&w=majority";
const UserSchema = require("./user");

let dbConnection;

function setConnection(newConn) {
    dbConnection = newConn;
    return dbConnection;
}

function getDbConnection() {
    if (!dbConnection) {
        console.log("trying connection");
        dbConnection = mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    return dbConnection;
}

async function findUserByUsername(username) {
    const result = await UserSchema.find({ username: username });
    return result;
}

async function addUser(user) {
    const userModel = getDbConnection().model("user", UserSchema);
    const userCheck = await findUserByUsername(user.username);
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