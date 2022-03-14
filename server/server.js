const express = require("express");
const app = express();
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
} = require("../sql/db");
const { sendEmail } = require("./aws_ses");
const cookieSession = require("cookie-session");
const secrets = require("../secrets.json");
const cryptoRandomString = require("crypto-random-string");

app.use(compression());

app.use(
    cookieSession({
        name: "session",
        secret: secrets.COOKIE_SESSION_KEY,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: true,
    })
);

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
            res.json({ success: true, rows: rows });
        } else {
            res.json({ success: false });
        }
    });
});

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
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
    console.log(req.session.userId, req.body.newBio);
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
    // console.log("Gets here!");
    getDataByUserId(req.session.userId).then(({ rows }) => {
        updateImage(
            rows[0].email,
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

app.post("/users/checkCode", (req, res) => {
    getResetCode(req.body.email).then(({ rows }) => {
        if (rows[0]) {
            if (req.body.code === rows[0].code) {
                hash(req.body.newPassword)
                    .then((hashed) => {
                        updatePassword(req.body.email, hashed)
                            .then(() => {
                                res.json({ success: true });
                                console.log("PASSWORD UPDATED SUCCESS!!!!!");
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

app.listen(process.env.PORT || 3001, function () {
    console.log("Listening on 3001/3000");
});
