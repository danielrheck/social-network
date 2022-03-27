const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
const multer = require("multer");
const uidSafe = require("uid-safe");
const compression = require("compression");
const path = require("path");
const s3 = require("./aws_s3.js");
const {
    compare,
    hash,
    addUser,
    getCredentialsByEmail,
    addResetCode,
    getResetCode,
    updatePassword,
    getDataByUserId,
    updateImage,
    updateBio,
    findPeople,
    getLastThree,
    getFriendshipRequests,
    addFriendshipRequests,
    acceptFriendship,
    deleteFriendship,
    getAllFriendshipByUserId,
    addNewMessageToGeneralChat,
    getLastTenMessagesFromGeneralChat,
    getAllImages,
    deleteAccount,
} = require("../sql/db");
const { sendEmail } = require("./aws_ses");
const { deletePicture } = require("./aws_s3");
const cookieSession = require("cookie-session");
const secrets = require("../secrets.json");
const cryptoRandomString = require("crypto-random-string");

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    name: "session",
    secret: secrets.COOKIE_SESSION_KEY,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: true,
});

app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

const connectedUsers = [];

io.on("connection", (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    connectedUsers.push({ userId: userId, socketId: socket.id });

    getLastTenMessagesFromGeneralChat()
        .then(({ rows }) => {
            socket.emit("lastTenMessages", rows);
        })
        .catch((e) => {
            console.log("Error fetching last 10 messages:  ", e);
        });

    socket.on("newMessage", (newMessage) => {
        addNewMessageToGeneralChat(userId, newMessage)
            .then(({ rows }) => {
                const timestamp = rows[0].created_at;
                const messageId = rows[0].id;
                getDataByUserId(userId)
                    .then(({ rows }) => {
                        io.emit("message", {
                            message: newMessage,
                            message_id: messageId,
                            sender_id: userId,
                            profile_pic: rows[0].profile_pic,
                            firstname: rows[0].firstname,
                            lastname: rows[0].lastname,
                            created_at: timestamp,
                        });
                    })
                    .catch((e) => {
                        console.log("Error getting user info:  ", e);
                    });
            })
            .catch((e) => {
                console.log("Error inserting new message in DB:  ", e);
            });
    });
});

app.use(express.json());

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "/uploads/"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/users/register.json", (req, res) => {
    hash(req.body.password).then((hashed) => {
        addUser(req.body.first, req.body.last, req.body.email, hashed)
            .then(({ rows }) => {
                req.session.userId = rows[0].id;
                res.json({ success: true });
            })
            .catch((e) => {
                res.json({ success: false, error: e });
            });
    });
});

app.get("/users/id.json", (req, res) => {
    if (!req.session.userId) {
        res.json({ success: false });
    } else {
        res.json({ userId: req.session.userId });
    }
});

app.get("/user", (req, res) => {
    getDataByUserId(req.session.userId).then(({ rows }) => {
        if (rows[0]) {
            res.json({
                success: true,
                rows: rows,
                loggedUserId: req.session.userId,
            });
        } else {
            res.json({ success: false });
        }
    });
});

app.get("/findPeople/search", (req, res) => {
    findPeople(req.query.search)
        .then(({ rows }) => {
            res.json({ success: true, rows: rows });
        })
        .catch((e) => {
            console.log("Error searching:  ", e);
            res.json({ success: false });
        });
});

app.get("/findPeople/lastThree", (req, res) => {
    getLastThree()
        .then(({ rows }) => {
            res.json({ success: true, rows: rows });
        })
        .catch(() => {
            res.json({ success: false });
        });
});

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

app.get("/getUserProfileByID/:id", (req, res) => {
    getDataByUserId(req.params.id)
        .then(({ rows }) => {
            res.json({
                loggedUserId: req.session.userId,
                success: true,
                rows: rows,
            });
        })
        .catch((e) => {
            console.log("Error getting user info from DB:  ", e);
            res.json({ success: false });
        });
});

app.get("/getAllFriendships", (req, res) => {
    getAllFriendshipByUserId(req.session.userId)
        .then(({ rows }) => {
            res.json({ success: true, rows: rows });
        })
        .catch((e) => {
            console.log("Error getting friends:  ", e);
            res.json({ success: false });
        });
});

app.get("/getFriendshipStatus", (req, res) => {
    getFriendshipRequests(req.session.userId, req.query.otherUserId).then(
        ({ rows }) => {
            if (!rows[0]) {
                res.json({ buttonState: "addFriend" });
            } else if (
                rows[0].sender_id == req.session.userId &&
                rows[0].accepted == false
            ) {
                res.json({ buttonState: "waitResponse" });
            } else if (rows[0].accepted == true) {
                res.json({ buttonState: "unfriend" });
            } else if (
                rows[0].recipient_id == req.session.userId &&
                rows[0].accepted == false
            ) {
                res.json({ buttonState: "acceptFriend" });
            }
        }
    );
});

app.post("/changeFriendsStatus", (req, res) => {
    if (req.body.buttonState == "addFriend") {
        addFriendshipRequests(req.session.userId, req.body.otherUserId)
            .then(() => {
                res.json({ success: true, buttonState: "waitResponse" });
            })
            .catch((e) => {
                console.log("Error adding friendship request:  ", e);
                res.json({ success: false });
            });
        // INSERT NEW ROW WITH SENDER_ID = REQ.SESSION.USERID RECIPIENT_ID = PASSED_ID AND ACCEPTED = FALSE
    } else if (req.body.buttonState == "acceptFriend") {
        acceptFriendship(req.body.otherUserId, req.session.userId).then(() => {
            res.json({ success: true, buttonState: "unfriend" });
        });
        // UPDATE ROW TO ACCEPTED = TRUE
    } else if (req.body.buttonState == "waitResponse") {
        // DO NOTHING
        res.json({ buttonState: "waitResponse" });
    } else if (req.body.buttonState == "unfriend") {
        // DELETE ROW
        deleteFriendship(req.session.userId, req.body.otherUserId)
            .then(() => {
                res.json({ success: true, buttonState: "addFriend" });
            })
            .catch((e) => {
                console.log("Error deleting friendship  ", e);
            });
    }
});

app.post("/users/login.json", (req, res) => {
    getCredentialsByEmail(req.body.email)
        .then(({ rows }) => {
            if (rows[0]) {
                compare(req.body.password, rows[0].password).then((check) => {
                    // right pw
                    if (check) {
                        req.session.userId = rows[0].id;
                        res.json({ success: true });
                    } // wrong pw
                    else {
                        res.json({ success: false });
                    }
                });
            } else {
                // user not registered
                res.json({ success: false });
            }
        })
        .catch(() => {
            // error querying credentials on DB
            res.json({ success: false });
        });
});

app.post("/reset/sendCode", (req, res) => {
    getCredentialsByEmail(req.body.email).then(({ rows }) => {
        if (rows[0]) {
            let code = cryptoRandomString({ length: 6 });
            let msg = `Hello, here it is your reset password code:  ${code}`;
            addResetCode(req.body.email, code)
                .then(() => {
                    sendEmail(req.body.email, "Your Reset Code!", msg)
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((e) => {
                            console.log("Error sending E-Mail:  ", e);
                            res.json({ success: false });
                        });
                })
                .catch((e) => {
                    console.log("Error Adding Code to DB:  ", e);
                    res.json({ success: false });
                });
        } else {
            console.log("No such e-mail in the DB.");
            res.json({ success: false });
        }
    });
});

app.post("/bio/update", (req, res) => {
    updateBio(req.session.userId, req.body.newBio)
        .then(() => {
            res.json({ success: true });
        })
        .catch((e) => {
            console.log("Error updating bio:  ", e);
            res.json({ success: false });
        });
});

app.post("/pic/upload", uploader.single("file"), s3.upload, (req, res) => {
    getDataByUserId(req.session.userId).then(({ rows }) => {
        updateImage(
            rows[0].id,
            `https://${secrets.AWS_BUCKET_NAME}.s3.amazonaws.com/${req.file.filename}`
        )
            .then(({ rows }) => {
                res.json({
                    success: true,
                    profilePic: rows[0].profile_pic,
                    first: rows[0].firstname,
                    last: rows[0].lastname,
                    email: rows[0].emailname,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    });
});

app.delete("/user/deleteAccount", (req, res) => {
    getAllImages(req.session.userId).then(({ rows }) => {
        for (let i = 0; i < rows.length; i++) {
            let string = rows[i].picture.split("/");
            let file = string[string.length - 1];
            deletePicture(file);
        }
        deleteAccount(req.session.userId)
            .then(() => {
                req.session.userId = null;
                res.json({ success: true });
                getLastTenMessagesFromGeneralChat()
                    .then(({ rows }) => {
                        io.emit("lastTenMessages", rows);
                    })
                    .catch((e) => {
                        console.log("Error fetching last 10 messages:  ", e);
                    });
            })
            .catch((e) => {
                console.log("Error deleting account from DB:  ", e);
                res.json({ success: false });
            });
    });
});

app.post("/users/checkCode", (req, res) => {
    getResetCode(req.body.email).then(({ rows }) => {
        if (rows[0]) {
            if (req.body.code === rows[0].code) {
                hash(req.body.newPassword)
                    .then((hashed) => {
                        updatePassword(req.body.email, hashed)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((e) => {
                                console.log("Error updating Password:  ", e);
                                res.json({ success: false });
                            });
                    })
                    .catch((e) => {
                        console.log("Error hashing PW:  ", e);
                        res.json({ success: false });
                    });
            } else {
                // WRONG CODE
                res.json({ success: false });
                console.log("WRONG CODE");
            }
        } else {
            // NO CODE ON DB
            res.json({ success: false });
            console.log("NO CODE");
        }
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("Listening on 3001/3000");
});
