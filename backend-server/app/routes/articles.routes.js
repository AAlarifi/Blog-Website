// This imports the articles controller functions from the "controllers" directory's "articles.controllers.js" file.
const articles = require("../controllers/articles.controllers"),
// This imports the middleware functions that are used for the authentication from the "lib" directory's "middleware.js" file.
auth = require("../lib/middleware");


module.exports = function(app){

    // This route uses middleware to check if the user is authenticated before allowing them to create an article. To get all articles doesn't use middleware.
    app.route("/articles")
    .get(articles.getAll)
    .post(auth.isAuthenticated, articles.create);

    // This route can get one article, edit it or delete it by article id.
    // Before an article can be edited or deleted the user must be authenticated.
    app.route("/articles/:article_id")
    .get(articles.getOne)
    .patch(auth.isAuthenticated, articles.updateArticle)
    .delete(auth.isAuthenticated, articles.deleteArticle);
}