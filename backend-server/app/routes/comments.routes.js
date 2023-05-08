// This imports the comments controller functions from the "controllers" directory's "comments.controllers.js" file.
const comments = require("../controllers/comments.controllers");
// This imports the middleware functions that are used for the authentication from the "lib" directory's "middleware.js" file.
auth = require("../lib/middleware");


module.exports = function(app){

    // This route can get all comments and can create a comment.
    app.route("/articles/:article_id/comments")
    .get(comments.getAll)
    .post(comments.create);

    // This route uses middleware to check if the user is authenticated before alowing them to delete a comment.
    app.route("/comments/:comment_id")
    .delete(auth.isAuthenticated, comments.deleteComment)
}