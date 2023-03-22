const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const http = require('http');
const port = 6969;
const ioport = 9696;
const socketIO = require('socket.io');
let server = http.createServer(app);
let io = socketIO(server);


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
                newUser.password = hash;
                const savedUser = await userServices.addUser(newUser);
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
            const savedUser = await userServices.updateUser(newUser);
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
    return 100;
};

app.post("/payment", async (req, res) => {
    const { items } = req.body;
    console.log("paying");
    const customer = await stripe.customers.create();
    const ephKey = await stripe.ephemeralKeys.create(
        {customer: customer.id},
        {apiVersion: '2022-11-15'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        customer: customer.id,
        payment_method_types: ['card'],
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
        ephemeralKey: ephKey.secret,
        customer: customer.id
    });
    console.log("sent intent");
});

app.post("/store", async (req, res) => {
    const items = req.body.items;
    var storeItems = [];
    for (i = 0; i < items.length; i++){
        result = await userServices.getStoreItem(items[i]);
        if (result)
            storeItems.push(result);
    }
    console.log(storeItems.length);
    res.status(200).send(storeItems);
});

io.on('connection', (socket) => {
    console.log("A user connected");
    socket.on('disconnect', () => {
        console.log("user had disconnected");
    })
    // TODO: implement logic
});

server.listen(ioport, () => {
    console.log("socket.io is listening on port " + ioport+ ".");
});

app.listen(port, () => {
    console.log("REST API is listening on port " + port + ".");
});
