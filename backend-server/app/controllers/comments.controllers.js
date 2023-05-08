// This line imports the comments model functions from the "models" directory's "comments.models.js" file.
const comments = require("../models/comments.models");
// This line imports the joi module that is used for data validation of user input.
const Joi = require("joi");
// Import the profanity filter library.
const Filter = require('bad-words');
const filter = new Filter();

// A function to filter profanity from the commment text.
const filterProfanity = (comment_text) => {
    return filter.isProfane(comment_text);
};

// This function gets all the comments from an article using its article id.
const getAll = (req, res) => {

    // Parses the article id from the request params
    let article_id = parseInt(req.params.article_id);

    // Passes the article id into the function getAllComments.
    comments.getAllComments(article_id, (err, num_rows, results) => {
        // If there is an error, a status code 500 is returned.
        if (err) return res.sendStatus(500);
        // If it is successful, a status code 200 and the result (the comments on the article) is returned.
        return res.status(200).send(results);
    });
};


// This function creates a comment on a article.
const create = (req, res) => {

    // A schema is defined for validation of the data inputed in the request body.
    const schema = Joi.object({
        "comment_text": Joi.string().required(),
    });

    // Validates the request body against the defined schema.
    const { error } = schema.validate(req.body);
    // If the validation fails, a status 400 and an error message are returned.
    if (error) return res.status(400).send(error.details[0].message);

    // Creates a comment object using the request body.
    let comment = Object.assign({}, req.body);
    // Parses the article id from the request body.
    let article_id = parseInt(req.params.article_id);

    // Checks if the comment text contains any bad words.
    if (filter.isProfane(comment.comment_text)) {
        return res.status(400).json({ message: "Your comment contains inappropriate language, please refrain from using bad words." });
    }

    // This checks if the article exists using the article id provided.
    comments.checkArticleExist(article_id, (err, found) => {
        // If there is an error, a status code 500 is returned.
        if (err) {
            return res.sendStatus(500);
        }
        // If the article doesn't exist, a status code 404 and an error message "Article not found!" are returned.
        if (!found) {
            return res.status(404).send("Article not found!");
        }
        // This adds the new comment.
        comments.addNewComment(comment, article_id, (err, id) => {
            // If there is an error, a status code 500 is returned.
            if (err) {
                return res.sendStatus(500);
            }
            // If successful, a status code 201 and the comment id are returned.
            return res.status(201).send({ comment_id: id });
        });
    });
};

// This function gets a comment.
const getOne = (req, res) => {
    // Parses the comment id from the request params.
    let comment_id = parseInt(req.params.comment_id);

    // This gets a single comment using the parsed comment id.
    comments.getSingleComment(comment_id, (err, result) => {
        if (err) {
            // If there is an error code of 404, a status code 404 is returned.
            if (err.code === 404) {
                return res.status(404).send(err.message);
            }
            // Returns status code 500 and message "Internal server error!" message.
            return res.status(500).send("Internal server error!");
        }
        // If successful, return status code 200 and result (The single comment).
        return res.status(200).send(result)
    });
};

// This function deletes a comment.
const deleteComment = (req, res) => {

    // Parses the comment id from the request params.
    let comment_id = parseInt(req.params.comment_id);

    // Gets a single comment using the parsed comment id.
    comments.getSingleComment(comment_id, (err) => {

        // If there is an error code of 404, return a status code 404.
        if (err === 404) return res.sendStatus(404).send(err.message);
        // Returns status code 500 and message "Internal server error!" message.
        if (err) return res.sendStatus(500).send("Internal server error!");

        comments.removeSingleComment(comment_id, (err) => {
            if (err) {
                // Returns status code 500 and message "Internal server error!" message.
                return res.sendStatus(500).send("Internal server error!");
            }
            // If successful, return status code 200.
            return res.sendStatus(200);
        });
    });
};


// Here the functions are exported so they could be used in other files that require this file.
module.exports = {
    getAll: getAll,
    create: create,
    getOne: getOne,
    deleteComment: deleteComment,
    filterProfanity: filterProfanity
}