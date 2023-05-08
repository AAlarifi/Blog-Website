// This is the db module that is being imported and is the database of the program.
const db = require("../../database");


// This function gets all comments from the database using the article id.
const getAllComments = (article_id, done) => {
    // The coments are stored in the results array.
    const results = [];

    // Selects evrything from the comments table in the database using the article id.
    db.each('SELECT * FROM comments WHERE article_id=?', [article_id], (err, row) => {
        if (err) console.log("Something went wrong: " + err);

        results.push({
            comment_id: row.comment_id,
            date_published: new Date(row.date_published).toLocaleDateString(),
            comment_text: row.comment_text
        });
    },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    );
};

// This function adds a new comment to the database.
const addNewComment = (comment, article_id, done) => {

    let date = Date.now();
    const sql = 'INSERT INTO comments ( date_published, comment_text, article_id) VALUES (?,?,?)';
    let values = [date, comment.comment_text, article_id];

    db.run(sql, values, function (err) {
        if (err) return done(err, null);

        return done(null, this.lastID);
    });
};


// This function gets a single comment from the comments table in the database.
const getSingleComment = (id, done) => {
    const sql = 'SELECT * FROM comments WHERE comment_id=?';

    db.get(sql, [id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);

        return done(null, {
            comment_id: row.comment_id,
            date_published: new Date(row.date_published).toLocaleDateString(),
            comment_text: row.comment_text
        });
    });
};

// This function deletes a single comment from the comments table in the database using it's comment id.
const removeSingleComment = (id, done) =>{ 
    const sql = 'DELETE FROM comments WHERE comment_id=?';

    db.run(sql, [id], (err) =>{
       return done(err)
    });
 };

 // This fuction checks if an article exist in the database using it's article id.
 const checkArticleExist = (article_id, done) => {
    const sql = 'SELECT * FROM articles WHERE article_id = ?';
    db.get(sql, [article_id], (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false);
        return done(null, true);
    });
};

// Here the functions are exported so they could be used in other files that require this file.
module.exports = {
    getAllComments: getAllComments,
    addNewComment: addNewComment,
    getSingleComment: getSingleComment, 
    removeSingleComment: removeSingleComment,
    checkArticleExist: checkArticleExist
};