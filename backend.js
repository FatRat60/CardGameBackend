const express = require('express');
const app = express();
const port = 6969;

const dotenv = require('dotenv');
dotenv.config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false}));

const userServices = require("./models/user-services");
const res = require("express/lib/response");
const req = require("express/lib/request");

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const retrievedList = await userServices.findUserByUsername(username);
    const retrievedUser = retrievedList[0];

    if (retrievedUser && retrievedUser.username != undefined) {
        // just compare password for now. Will decyrpt later
        if (password == retrievedUser.password){
            res.status(200).send();
        }
        else {
            // invalid password
            res.status(401).send("Incorrect Password");
        }
    }
    else {
        res.status(400).send("Poor request");
    }
});

app.post("/signup", async (req, res) => {
    console.log(req.body.username);
    let newUser = req.body;
    user_search = await userServices.findUserByUsername(newUser.username);
    if (!newUser.username && !newUser.password) res.status(400).send("Poor request");
    else{
        if (user_search.length > 0) res.status(400).send("username taken");
        else {
            const savedUser = await userServices.addUser(newUser);
            console.log("here");
            if (!savedUser) res.status(500).end();
            else res.status(201).send();
        }
    }
});

app.get("/user/:username", async (req, res) => {
    const user_name = req.params["username"];
    console.log("Garsh");
    const result = await userServices.findUserByUsername(user_name);
    if (result === undefined || result === null) {
        res.status(404).send("Resource not found.");
    } else {
        res.status(200).send(result[0]);
    }
});

app.post("/updateUser", async (req, res) => {
    let newUser = req.body;
    console.log(newUser);
    user_search = await userServices.findUserByUsername(newUser.username);
    if (!newUser.username) res.status(400).send("Poor Rquest");
    else{
        if (user_search.length == 0) res.status(400).send("User does not exist");
        else {
            const savedUser = await userServices.updateUser(newUser);
            console.log(savedUser);
            if (!savedUser) res.status(500).end();
            else res.status(201).send();
        }
    }
});

app.listen(port, () => {
    console.log("REST API is listening on port " + port + ".");
});
