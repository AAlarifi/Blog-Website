// This imports the users controller functions from the "controllers" directory's "user.controller.js" file.
const users = require("../controllers/user.controllers");
// This imports the middleware functions that are used for the authentication from the "lib" directory's "middleware.js" file.
auth = require("../lib/middleware");

module.exports = function(app){

    // This route uses middleware to check if the user is authenticated before alowing them to create a new user or getting all users.
    app.route("/users")
    .post(auth.isAuthenticated, users.create)
    .get(auth.isAuthenticated, users.getAllUsers);
    
    // This route logs in existing user
    app.route("/login")
    .post(users.login);

    // This route logs out the current user
    app.route("/logout")
    .post(users.logout);

}