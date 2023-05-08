// This is a built in module in Node.js that is used for cryptography.
const crypto = require('crypto');
// This is the db module that is being imported and is the database of the program.
const db = require('../../database');

// This function returns the hash of a password and its salt.
const getHash = function (password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};

// This creates a new user by adding the user to the database.
const addNewUser = (user, done) => {

    // A salt is generated for the new user.
    const salt = crypto.randomBytes(64);
    // The hash of the new user's password is created.
    const hash = getHash(user.password, salt);

    // The SQL statement that inserts the new user into the database.
    const sql = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?,?,?,?,?)';
    let values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex')];

    // This function is used to execute the SQL statement and inserts the values into the database. If there is an error, it is returned.
    // If it is successful, a user id is returned.
    db.run(sql, values, function (err) {
        if (err) return done(err)
        return done(null, this.lastID);
    });
};

// This function authenticates a user using their email and password.
const authenticateUser = (email, password, done) => {

    // This is a SQL statement that selects a user based on their email from the "users" database.
    const sql = 'SELECT user_id, password, salt FROM users WHERE email = ?'

    // This checks if the email and password that have been provided match a user in the database.
    db.get(sql, [email], (err, row) => {
        // If there is an error, it is returned.
        if (err) {
            return done(err);
        }
        // If there is no such user in the database, an error message "User not found!" is returned.
        if (!row) {
            return done(new Error("User not found!"));
        }
        // If a salt hasn't been found, then the salt is set to empty string.
        if (!row.salt) {
            row.salt = '';
        }
        // Converts the salt from a hex string to a buffer.
        let salt = Buffer.from(row.salt, 'hex');
        // If the hash of the provided password matches the hash of the stored password, the user's id is returned.
        if (row.password === getHash(password, salt)) {
            return done(null, row.user_id);
        } else {
            // If the password does not match, an error message "Wrong password!" is returned.
            return done(new Error("Wrong password!"));
        }
    });
};

// This function gets the users token using their id.
const getToken = function (id, done) {

    // The SQL statement that selects the user's session token with the provided user id.
    db.get('SELECT session_token FROM users WHERE user_id=?', [id], function (err, row) {
        // The session token is returned if the row exists and the session token is not null.
        if (row && row.session_token) {
            return done(null, row.session_token);
        } else {
            // If the row or session token is null, null is returned.
            return done(null, null);
        }
    });
};

// This function sets a token for the user if they don't have one.
const setToken = function (id, done) {

    // A random token is generate for the user.
    let token = crypto.randomBytes(16).toString('hex');

    // An SQL statement is executed to update the user's session token using the user's id provided.
    db.run('UPDATE users SET session_token=? WHERE user_id=?', [token, id], function (err) {
        // If there is an error it is returned, otherwise the token is returned.
        return done(err, token);
    });
};

// This function removes the session token.
const removeToken = (token, done) => {

    // An SQL statement is executed to update the user's session token to null using the provided session token.
    db.run('UPDATE users SET session_token=null WHERE session_token=?', [token], function (err) {
        // If there is an error it is returned.
        return done(err);
    });
};

// This function get a user id from the token provided.
const getIdFromToken = function (token, done) {

    //  If the token is either undefine or null, return null.
    if (token === undefined || token === null)
        return done(true, null);
    else {
        // An SQL statement is executed to retrieve the user id from the session token in the database that is assosiated with it.
        db.get('SELECT user_id FROM users WHERE session_token=?', [token], function (err, row) {
            if (row)
                return done(null, row.user_id);
            return done(err, null);
        });
    }
};

// This function gets all users from the "users" table in the database.
const getAll = (done) => {
    // This is an empty array where the results will be stored.
    const results = [];

    // A SQL statement is executed to select all the rows from the "users" table in the database.
    db.each('SELECT * FROM users', [], (err, row) => {

        // The row data is added to the results array.
        results.push({
            user_id: row.user_id,
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email
        });
    },
        (err, num_rows) => {
            // The done callback is called with the error, number of rows and results.
            return done(err, num_rows, results);
        }
    );
};

// This function checks if the email provided exists in the database.
const emailExists = (email, done) => {

    // An SQL statement that selects the email from the "users" table where the email matches the one provided.
    const sql = 'SELECT email FROM users WHERE email=?';

    // The SQL statement is executed using the provided email as the parameter.
    db.get(sql, [email], (err, row) => {
        // If there is an error, returns an error message.
        if (err) return done(err);
        if (row) {
            // If the row exists, return true.
            return done(null, true);
        } else {
            // If the row doesn't exist, return false.
            return done(null, false);
        }
    });
};

// Here the functions are exported so they could be used in other files that require this file.
module.exports = {
    addNewUser: addNewUser,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    authenticateUser: authenticateUser,
    getIdFromToken: getIdFromToken,
    getAll: getAll,
    emailExists: emailExists
}