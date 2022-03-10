const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const {
    compare,
    hash,
    addUser,
    getCredentialsByEmail,
    addResetCode,
    getResetCode,
    updatePassword,
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
        console.log("Trigger");
        res.json({ success: false });
    } else {
        res.json({ userId: req.session.userId });
    }
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
            // error querying DB
            res.json({ success: false });
        });
});

app.post("/reset/sendCode", (req, res) => {
    getCredentialsByEmail(req.body.email).then(({ rows }) => {
        if (rows[0]) {
            let code = cryptoRandomString({ length: 6 });
            let msg = `Hello, here it is your reset passsword code:  ${code}`;
            addResetCode(req.body.email, code)
                .then(() => {
                    sendEmail(req.body.email, "Your Reset Code!", msg)
                        .then(() => {
                            res.json({ success: true, email: req.body.email });
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

app.post("/users/checkCode", (req, res) => {
    console.log(req.body.email);
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
