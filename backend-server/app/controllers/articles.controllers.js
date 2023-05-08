// This line imports the articles model functions from the "models" directory's "articles.models.js" file.
const articles = require("../models/articles.models");
// This line imports the joi module that is used for data validation of user input.
const Joi = require("joi");

// This function gets all the articles.
const getAll = (req, res) => {
    // Retrieves all articles from the database.
    articles.getAllArticles((err, num_rows, results) => {
        // If there is an error,  a status code of 500 is returned.
        if (err) return res.sendStatus(500);
        // If successful,  a status code of 200 and the results (articles) are returned.
        return res.status(200).send(results);
    });
};

// This function creates the article.
const create = (req, res) => {
    // A schema is defined for validation of the data inputed in the request body.
    const schema = Joi.object({
        "title": Joi.string().required(),
        "author": Joi.string().required(),
        "article_text": Joi.string().required(),
    });

    // Validates the request body against the defined schema.
    const { error } = schema.validate(req.body);
    // If the validation fails, a status 400 and an error message are returned.
    if (error) return res.status(400).send(error.details[0].message);

    // Creates an article object using the request body.
    let article = Object.assign({}, req.body);

    // This adds the article into the database.
    articles.addNewArticle(article, (err, id) => {
        // Returns status code 500 and message "Internal server error!" message.
        if (err) {
            return res.sendStatus(500).send("Internal server error!");
        }
        // If successful, return status code 201 and the article id.
        return res.status(201).send({ article_id: id });
    });
};

// This function gets a single article.
const getOne = (req, res) => {
    // Parses the article id from the request params.
    let article_id = parseInt(req.params.article_id);

    // This gets a single article from the database using the parsed article id.
    articles.getSingleArticle(article_id, (err, result) => {
        // If there is an error code of 404, return a status code 404.
        if (err === 404) return res.sendStatus(404).send(err.message);
        // Returns status code 500 and message "Internal server error!" message.
        if (err) return res.sendStatus(500).send("Internal server error!");
        // If successful, return status code 200 and result (The single article).
        return res.status(200).send(result)
    });
};

// This function updates an article.
const updateArticle = (req, res) => {

    // Parses the article id from the request params.
    let article_id = parseInt(req.params.article_id);

    // A schema is defined for validation of the data inputed in the request body.
    const schema = Joi.object({
        "title": Joi.string(),
        "author": Joi.string(),
        "article_text": Joi.string()
    });

    // Validates the request body against the defined schema.
    const { error } = schema.validate(req.body);
    // If the validation fails, a status 400 and an error message are returned.
    if (error) return res.status(400).send(error.details[0].message);

    // This gets a single article from the database using the parsed article id.
    articles.getSingleArticle(article_id, (err, result) => {
        // If there is an error code of 404, return a status code 404.
        if (err === 404) return res.sendStatus(404).send(err.message);
        // Returns status code 500 and message "Internal server error!" message.
        if (err) return res.sendStatus(500).send("Internal server error!");

        // Updates the title, author, article text if they are present in the request body.
        if (req.body.hasOwnProperty("title")) {
            result.title = req.body.title
        }
        if (req.body.hasOwnProperty("author")) {
            result.author = req.body.author
        }
        if (req.body.hasOwnProperty("article_text")) {
            result.article_text = req.body.article_text
        }

        // Updated the article with the new data.
        articles.updateArticle(article_id, result, (err, id) => {
            if (err) {
                // Returns status code 500 and message "Internal server error!" message.
                return res.sendStatus(500).send("Internal server error!");
            }
            // If successful, return status code 200.
            return res.sendStatus(200);
        });
    });
};

// This function deletes an article.
const deleteArticle = (req, res) => {

    // Parses the article id from the request params.
    let article_id = parseInt(req.params.article_id);

    // Delets the article using the parsed article id.
    articles.deleteArticle(article_id, (err, found) => {
        if (err) {
            // Returns status code 500 and message "Internal server error!" message.
            return res.sendStatus(500).send("Internal server error!");
        }
        // If no article is found with the provide article id is present in the database, return status code 404 and error message "Article not found!".
        if (!found) {
            return res.status(404).send("Article not found!");
        }
        // If successful, return status code 200.
        return res.sendStatus(200);
    });
};

// Here the functions are exported so they could be used in other files that require this file.
module.exports = {
    getAll: getAll,
    create: create,
    getOne: getOne,
    updateArticle: updateArticle,
    deleteArticle: deleteArticle
};