const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");

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
const createToken = (userId) => {
    // Set the token payload
    const payload = {
        userId: userId,
    };

    // Generate the token with a secret key and expiration time
    const token = jwt.sign(payload, "evariste", { expiresIn: "1h" });

    return token;
};

// endpoint for the user login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    // check if the email and password are provided
    if (!email || !password) {
        return res.status(404).json({ message: "Email and Password are required" });
    }

    // check for that user in the backend
    User.findOne({ email })
        .then((user) => {

            // user not found
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // compare the provided password with the password in the database
            if (user.password !== password) {
                return res.status(404).json({ message: "Invalid Password" });
            }

            const token = createToken(user._id);

            res.status(200).json({ token });

        })
        .catch((err) => {
            console.log("Error in finding the user", err);
            res.status(500).json({ message: "Internal server error", err })
        });
});

// endpoint to fetch all users but the current user
app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } })
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.log("Error fetching users", err);
            res.status(500).json({ message: "Error fetching users" })
        });
});

// endpoint to send a request to a user
app.post("/friend-request", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        // updated the recipient's receivedFriendRequests array
        await User.findByIdAndUpdate(
            selectedUserId,
            {
                $push: { receivedFriendRequests: currentUserId },
            }
        );

        // update the sender's sentFriendRequests array
        await User.findByIdAndUpdate(
            currentUserId,
            {
                $push: { sentFriendRequests: selectedUserId },
            }
        );

        res.status(200);
    } catch (error) {
        res.sendStatus(500);
    }
});


// endpoint to show all the friend requests of particular user
app.get("/friend-request/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        // fetch the user document based on the User id
        const user = await User.findById(userId).populate("receivedFriendRequests", "name email image").lean()
        const friendRequests = user.receivedFriendRequests;
        res.status(200).json(friendRequests)
    } catch (error) {
        console.log("Error retrieving user's friend requests");
        res.status(500).json({ message: "Internal Server Error" })
    }
});

// endpoint to accept a friend request
app.post("/friend-request/accept", async (req, res) => {
    const { senderId, recipientId } = req.body;

    try {
        // retrieve the documents of sender and recipient
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);
        sender.friends.push(recipientId);
        recipient.friends.push(senderId);

        recipient.receivedFriendRequests = recipient.receivedFriendRequests.filter((request) => request.toString() !== senderId.toString());

        sender.sentFriendRequests = recipient.sentFriendRequests.filter((request) => request.toString() !== recipientId.toString());

        await sender.save();
        await recipient.save();
        res.status(200).json({ message: "Friend request accepted sucessfully." })

    } catch (error) {
        console.log("Error accepting friend request", error);
        res.status(500).json({ message: "Error accepting friend request." })
    }
});

// endpoint to access all the logged in users
app.get("/accepted-friends/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("friends", "name email image");
        const acceptedFriends = user.friends;
        res.status(200).json(acceptedFriends);

    } catch (error) {
        console.log("Error retrieving logged in friends");
        res.status(500).json({ message: "Error retrieving logged in friends" })
    }
});

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "files/"); // Specify the desired destination folder
    },
    filename: function (req, file, cb) {
      // Generate a unique filename for the uploaded file
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

const upload = multer({
    storage: storage
})
// endpoint to post and stores messages
app.post("/messages", upload.single('imageFile'), async (req, res) => {
    try {
        const { senderId, recipientId, messageType, message } = req.body;
        const newMessage = new Message({
            senderId,
            recipientId,
            messageType,
            message,
            timeStamp: new Date(),
            imageUrl: messageType === "image"
        });
        await newMessage.save();
    res.status(200).json({ message: "Message sent successfully."});
    } catch (error) {
        console.log("Error posting a message", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// endpoint to get the userDetails to design the chat room header
app.get("/user/:userId", async (req, res)=>{
    try {
        const {userId} = req.params;
        // fetch the user data
        const recipientId = await User.findById(userId);
        res.status(200).json(recipientId);
    } catch (error) {
        console.log("Error fetching user details", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
});

// endpoint to fetch the messages between two users in the chat room
app.get("/messages/:senderId/:recipientId", async (req, res)=>{
    try {
        const {senderId, recipientId} = req.params;
        const messages = await Message.find({
            $or: [
                {senderId:senderId, recipientId:recipientId},
                {senderId:recipientId, recipientId:senderId}
            ]
        }).populate("senderId", "_id name");
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error fetching messages between 2 users", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
})



app.listen(port, () => {
    console.log("Server running on port", port);
});
