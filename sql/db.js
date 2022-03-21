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

module.exports.updateImage = function (email, picURL) {
    return db.query(
        `
    
        UPDATE users 
        SET profile_pic = $2
        WHERE email =  $1
        RETURNING *
    
    `,
        [email, picURL]
    );
};

module.exports.updateBio = function (id, newBio) {
    return db.query(
        `
    
        UPDATE users 
        SET bio = $2
        WHERE id =  $1
    
    `,
        [id, newBio]
    );
};

module.exports.getCredentialsByEmail = function (email) {
    return db.query(
        `
    
        SELECT * FROM users WHERE email = $1

    `,
        [email]
    );
};

module.exports.getDataByUserId = function (user_id) {
    return db.query(
        `
    
        SELECT * FROM users WHERE id = $1

    `,
        [user_id]
    );
};

module.exports.addResetCode = function (email, code) {
    return db.query(
        `
        
        INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)
        RETURNING email
        
        `,
        [email, code]
    );
};

module.exports.getLastThree = function () {
    return db.query(`
    
        SELECT * FROM users
        ORDER BY id DESC
        LIMIT 3

    `);
};

module.exports.findPeople = function (search) {
    return db.query(
        `
    
        SELECT * from users
        WHERE firstname ILIKE $1
        OR lastname ILIKE $1
        ORDER BY id DESC
    
    `,
        ["%" + search + "%"]
    );
};

module.exports.getResetCode = function (email) {
    return db.query(
        `
    
        SELECT code FROM reset_codes
        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        AND email = $1
        ORDER BY id DESC 
        LIMIT 1
    
    `,
        [email]
    );
};

module.exports.updatePassword = function (email, password) {
    return db.query(
        `
    
        UPDATE users 
        SET password = $2
        WHERE email = $1

    `,
        [email, password]
    );
};

module.exports.getFriendshipRequests = function (
    logged_user_id,
    other_profile_id
) {
    return db.query(
        `
    
        SELECT * FROM friend_requests
  WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1)
    
    `,
        [logged_user_id, other_profile_id]
    );
};

module.exports.addFriendshipRequests = function (
    logged_user_id,
    other_profile_id
) {
    return db.query(
        `
    
        INSERT INTO friend_requests (sender_id, recipient_id, accepted)
        VALUES ($1, $2, false)
    
    `,
        [logged_user_id, other_profile_id]
    );
};

module.exports.acceptFriendship = function (senders_id, recipient_id) {
    return db.query(
        `
    
        UPDATE friend_requests
        SET accepted = true
        WHERE sender_id = $1 AND recipient_id = $2

    `,
        [senders_id, recipient_id]
    );
};

module.exports.deleteFriendship = function (logged_user_id, other_user_id) {
    return db.query(
        `
    
        DELETE FROM friend_requests
        WHERE sender_id = $1 AND recipient_id = $2
        OR sender_id = $2 AND recipient_id = $1

    `,
        [logged_user_id, other_user_id]
    );
};
