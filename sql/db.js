const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

const bcrypt = require("bcryptjs");
// --------- BCRYPT ---------- //
module.exports.hash = (password) => {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
};

module.exports.compare = bcrypt.compare;

// ------- DB QUERIES -------- //

module.exports.addUser = function (firstname, lastname, email, password) {
    return db.query(
        `
    
        INSERT INTO users (firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    
    `,
        [firstname, lastname, email, password]
    );
};

let addUser = function (firstname, lastname, email, password) {
    return db.query(
        `
    
        INSERT INTO users (firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    
    `,
        [firstname, lastname, email, password]
    );
};
