const express = require('express');
const app = express();
const port = 6969;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false}));

const userServices = require("./models/user-services");
const res = require("express/lib/response");
const req = require("express/lib/request");
const dbUser = { username: "", password: ""};

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const retrievedList = await userServices.findUserByUsernmae(username);
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
    let newUser = req.body;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    user_search = await userServices.findUserByUsernmae(username);
    if (!username && !email && !password) res.status(400).send("Poor request");
    else{
        if (user_search.length > 0) res.status(400).send("username taken");
        else {
            newUser.wins = 0;
            newUser.gamesPlayed = 0;

            const savedUser = await userServices.addUser(newUser);
            if (!savedUser) res.status(500).end();
            else res.status(201).send();
        }
    }
});

