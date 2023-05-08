// This line imports the user model functions from the "models" directory's "user.models.js" file.
const users = require("../models/user.models");
// This line imports the joi module that is used for data validation of user input.
const Joi = require("joi");
// This line imports the "config.js" file from the "config" directory.
const config = require('../config/config.js');

// This function creates a new user by validating the request body against a schema using "Joi," which was imported in line 4.
const create = (req, res) => {
    const schema = Joi.object({
        "first_name": Joi.string().required(),
        "last_name": Joi.string().required(),
        "email": Joi.string().email({ minDomainSegments: 2 }).required(),
        "password": Joi.string().min(8).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/).message("The password must be at least 8 - 30 characters long with at least one lowercase letter, one upercase letter, one special character and one number").required()
    }).options({ allowUnknown: false }); // The "allowUnkown: false" insures that objects not defined in the schema are not being processed.
    // If the request body isn't typed correctly, it returns a 400 status code with the error message letting the user know what type of error they have caused.
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = Object.assign({}, req.body);
    // If the request body is typed in correctly, it checks if the email already exists in the sqlite database. 
    users.emailExists(user.email, (err, exists) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        // If the email already exists, a 400 status code with an error message is returned.
        if (exists) {
            return res.status(400).send({ error: "Email already exists" });
        }
        // If the email address doesn't exist, the addNewUser function from the "user.models.js" file (implemented in line 2) is called to add the user to the database(db.sqlite).
        users.addNewUser(user, (err, id) => {
            // If there is an error adding the user to the database, a 500 status code with the error message is returned.
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            // If the user is successfully added to the database, a 201 status code with the user_id is returned.
            return res.status(201).send({ user_id: id });
        });
    });
};

// This is the login function that requires the user to input their email and password as a string which is validated using "joi".
const login = (req, res) => {
    const schema = Joi.object({
        "email": Joi.string().required(),
        "password": Joi.string().required(),
    });
    // Validates the inputed data against the schema and returns error 400 if the data fails the validation.
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // This checks if the email and password are valid.
    users.authenticateUser(req.body.email, req.body.password, function (err, id) {
        // If authentication fails, a 400 status code with the error message "Invalid email/password supplied!" is returned.
        if (err) {
            res.status(400).send("Invalid email/password supplied!");
        } else {
            users.getToken(id, function (err, token) {
                /// Returns user id and session token if token exists.
                if (token) {
                    return res.send({ user_id: id, session_token: token });
                } else {
                    // If there is no existing token then a new session token is created for the user, returning user id and the new session token.
                    users.setToken(id, function (err, token) {
                        res.send({ user_id: id, session_token: token });
                    })
                }
            });
        }
    });
};

// This function handles the user's logout request by checking if a token exists and removing that token.
const logout = (req, res) => {
    // This gets the user's token from the request headers.
    let token = req.get(config.get("authToken"));

    // This checks if the user token exists, if not a status code 401 with the error message "User isn't logged in!" is returned.
    if (!token) {
        return res.status(401).send("User isn't logged in!");
    };
    // This gets the user id that is associated with the token.
    users.getIdFromToken(token, (err, userId) => {
        // If there is an error or the user id isn't found, a status code 401 with the error message "User isn't logged in!" is returned.
        if (err || !userId) {
            return res.status(401).send("User isn't logged in!");
        };
        // This removes the token from the user's account.
        users.removeToken(token, function (err) {
            // If there is an error, a status code 500 with an error message is returned.
            if (err) {
                return res.status(500).send(err.message);
            } else {
                // If successful, a status code 200 is returned.
                return res.sendStatus(200);
            }
        });
    });
};

// This function gets all the users from the database using the called function "getAll" from "user.models.js" from the "models" directory.
const getAllUsers = (req, res) => {
    users.getAll((err, num_rows, results) => {
        // If there is an error, a status code 500 is returned.
        if (err) return res.sendStatus(500);
        // If successful, a status code 200 and the results (The users from the database) is returned.
        return res.status(200).send(results);
    });
};

// Here the functions are exported so they could be used in other files that require this file.
module.exports = {
    create: create,
    login: login,
    logout: logout,
    getAllUsers: getAllUsers
};