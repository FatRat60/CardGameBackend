const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const port = 6969;

const dotenv = require('dotenv');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET);

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
        bcrypt.compare(password, retrievedUser.password, function(err, result) {
            console.log("%s and %s", password, retrievedUser.username);
            if (result){
                console.log("success");
                res.status(200).send(retrievedUser);
            }
            else {
                // invalid password
                res.status(401).send("Incorrect Password");
            }
        });
    }
    else {
        res.status(400).send("Poor request");
    }
});

app.post("/signup", async (req, res) => {
    console.log(req.body.username);
    var newUser = req.body;
    user_search = await userServices.findUserByUsername(newUser.username);
    if (!newUser.username && !newUser.password) res.status(400).send("Poor request");
    else{
        if (user_search.length > 0) res.status(400).send("username taken");
        else {
            bcrypt.hash(newUser.password, saltRounds, async function(err, hash) {
                console.log(newUser);
                newUser.password = hash;
                const savedUser = await userServices.addUser(newUser);
                console.log("here");
                if (!savedUser) res.status(500).end();
                else res.status(201).send(savedUser);
            });
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
    var newUser = req.body;
    console.log(newUser);
    user_search = await userServices.findUserByUsername(newUser.username);
    if (!newUser.username) res.status(400).send("Poor Rquest");
    else{
        if (user_search.length == 0) res.status(400).send("User does not exist");
        else {
            newUser.decks = user_search[0].decks;
            console.log(newUser.decks);
            const savedUser = await userServices.updateUser(newUser);
            console.log(savedUser);
            if (!savedUser) res.status(500).end();
            else res.status(201).send();
        }
    }
});

app.get("/users", async (req, res) => {
    user_search = await userServices.getAllUsers();
    console.log(user_search.length);
    res.status(200).send(user_search);
});

const calculateOrderAmount = (items) => {
    //TODO: Add up order
    return 1;
};

app.post("/payment", async (req, res) => {
    const { items } = req.body;

    const paymentIntent = await Stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

app.listen(port, () => {
    console.log("REST API is listening on port " + port + ".");
});
