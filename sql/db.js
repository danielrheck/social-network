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

module.exports.getAllFriendshipByUserId = function (user_id) {
    return db.query(
        `

        SELECT users.id, firstname, lastname, profile_pic, accepted
  FROM friend_requests
  JOIN users
  ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
  OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
    
    `,
        [user_id]
    );
};

module.exports.addNewMessageToGeneralChat = function (sender_id, message) {
    return db.query(
        `
        INSERT INTO general_chat
        (sender_id, message)
        VALUES($1, $2)
        RETURNING created_at, id
        
        
        `,
        [sender_id, message]
    );
};

module.exports.getLastTenMessagesFromGeneralChat = function () {
    return db.query(`
    
        SELECT 
            users.id as sender_id, 
            users.firstname, 
            users.lastname, 
            users.profile_pic, 
            general_chat.id as message_id,
            general_chat.message, 
            general_chat.created_at
        FROM users
        INNER JOIN general_chat
        ON users.id = sender_id
        ORDER BY general_chat.id DESC
        LIMIT 10
    
    `);
};

// let getLastTenMessagesFromGeneralChat = function () {
//     return db.query(`

//         SELECT
//             users.id as sender_id,
//             users.firstname,
//             users.lastname,
//             users.profile_pic,
//             general_chat.id as message_id,
//             general_chat.message,
//             general_chat.created_at
//         FROM users
//         INNER JOIN general_chat
//         ON users.id = sender_id
//         ORDER BY general_chat.id
//         LIMIT 10

//     `);
// };

// getLastTenMessagesFromGeneralChat().then(({ rows }) => {
//     console.log(rows.length, rows);
// });

// let addNewMessageToGeneralChat = function (sender_id, message) {
//     return db.query(
//         `
//         INSERT INTO general_chat
//         (sender_id, message)
//         VALUES($1, $2)
//         RETURNING created_at, id

//         `,
//         [sender_id, message]
//     );
// };

// addNewMessageToGeneralChat(1, "MENSAGEM NOVA 11!");

// let addFriendshipRequests = function (logged_user_id, other_profile_id) {
//     return db.query(
//         `

//         INSERT INTO friend_requests (sender_id, recipient_id, accepted)
//         VALUES ($1, $2, false)

//     `,
//         [logged_user_id, other_profile_id]
//     );
// };

// for (let i = 2; i < 8; i++) {
//     addFriendshipRequests(i, 1);
// }

module.exports.updateImage = function (userId, picURL) {
    return db
        .query(
            `
    
        INSERT INTO profile_pictures (user_id, picture) 
        VALUES($1, $2)

    
    `,
            [userId, picURL]
        )
        .then(() => {
            return db.query(
                `
    
        UPDATE users 
        SET profile_pic = $2
        WHERE id =  $1
        RETURNING *
    
    `,
                [userId, picURL]
            );
        });
};

module.exports.getAllImages = function (userId) {
    return db.query(
        `
    
        SELECT * from profile_pictures where user_id = $1

    `,
        [userId]
    );
};

module.exports.deleteAccount = function (userId) {
    return db
        .query(
            `
    
        DELETE FROM profile_pictures 
        WHERE user_id = $1
    
    `,
            [userId]
        )
        .then(() => {
            return db
                .query(
                    `
            
                DELETE FROM friend_requests
                WHERE sender_id = $1
                OR recipient_id = $1
            
            
            `,
                    [userId]
                )
                .then(() => {
                    return db
                        .query(
                            `
                    
                        DELETE FROM general_chat
                        WHERE sender_id = $1
                    
                    `,
                            [userId]
                        )
                        .then(() => {
                            return db.query(
                                `
                            
                                DELETE FROM users
                                WHERE id = $1
                            
                            `,
                                [userId]
                            );
                        });
                });
        });
};

// let updateImage = function (userId, picURL) {
//     return db
//         .query(
//             `

//         INSERT INTO profile_pictures (user_id, picture)
//         VALUES($1, $2)

//     `,
//             [userId, picURL]
//         )
//         .then(() => {
//             return db.query(
//                 `

//         UPDATE users
//         SET profile_pic = $2
//         WHERE id =  $1
//         RETURNING *

//     `,
//                 [userId, picURL]
//             );
//         });
// };

// updateImage(1, "www.foto.com").then(({ rows }) => {
//     console.log(rows);
// });

// let deleteAccount = function (userId) {
//     return db
//         .query(
//             `

//         DELETE FROM profile_pictures
//         WHERE user_id = $1

//     `,
//             [userId]
//         )
//         .then(() => {
//             return db.query(
//                 `

//         DELETE FROM users
//         WHERE id = $1

//     `,
//                 [userId]
//             );
//         });
// };

// deleteAccount(182);

// let getAllImages = function (userId) {
//     return db.query(
//         `

//         SELECT * from profile_pictures where user_id = $1

//     `,
//         [userId]
//     );
// };

// getAllImages(1).then(({ rows }) => console.log(rows));

let deleteAccount = function (userId) {
    return db
        .query(
            `
    
        DELETE FROM profile_pictures 
        WHERE user_id = $1
    
    `,
            [userId]
        )
        .then(() => {
            return db
                .query(
                    `
            
                DELETE FROM friend_requests
                WHERE sender_id = $1
                OR recipient_id = $1
            
            
            `,
                    [userId]
                )
                .then(() => {
                    return db.query(
                        `
    
        DELETE FROM users
        WHERE id = $1
    
    `,
                        [userId]
                    );
                });
        });
};

deleteAccount(2);
