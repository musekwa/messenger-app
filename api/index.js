const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Message = require("./models/message");


const app = express();
const port = 8000

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());


mongoose.connect(
    "mongodb+srv://musekwa:Ssssssss12@cluster0.vykensc.mongodb.net/?retryWrites=true&w=majority",
    {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    }
).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error Connecting to MongoDB", err);
});


// endPoint for the user registration
app.post("/register", (req, res) => {
    const { name, email, password, image } = req.body;

    //  create a new user object
    const newUser = new User({
        name, email, password, image,
    });
    // save the user to the database
    newUser.save()
        .then(() => {
            res.status(200).json({ message: "User registered successfully" })
        })
        .catch((err) => {
            console.log("Error registering the user", err);
            res.status(500).json({ message: "Error registering the user" });
        })
});

// creating the user token function
const createToken = ()=>{
    return "my-token"
}

// endpoint for the user login
app.post("/login", (req, res)=>{
    const { email, password} = req.body;
    // check if the email and password are provided
    if(!email || !password){
        return res.status(404).json({message: "Email and Password are required"});
    }

    // check for that user in the backend
    User.findOne({email})
        .then((user)=>{
            // user not found
            if(!user){
                return res.status(404).json({message: "User not found"});
            }

            // compare the provided password with the password in the database
            if(user.password !== password){
                return res.status(404).json({message: "Invalid Password"});
            }

            const token = createToken(user._id);

            res.status(200).json({token});

        })
        .catch((err)=>{
            console.log("Error in finding the user", err);
            res.status(500).json({ message: "Internal server error", err})
        });

});



app.listen(port, () => {
    console.log("Server running on port", port);
});
