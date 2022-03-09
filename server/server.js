const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
// BCRYPT AND DB
const { compare, hash, addUser } = require("../sql/db");
const cookieSession = require("cookie-session");
const secrets = require("../secrets.json");

app.use(compression());

app.use(
    cookieSession({
        name: "session",
        secret: secrets.session_key,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: true,
    })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/users/register.json", (req, res) => {
    console.log(req.body);
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

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("Listening on 3001/3000");
});
