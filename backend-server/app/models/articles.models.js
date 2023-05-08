// This is the db module that is being imported and is the database of the program.
const db = require("../../database");

// This function gets all the articles in the database.
const getAllArticles = (done) => {
    // The articles are stored in results array.
    const results = [];

    db.each('SELECT * FROM articles', [], (err, row) => {
        if (err) console.log("Something went wrong: " + err);

        results.push({
            article_id: row.article_id,
            title: row.title,
            author: row.author,
            date_published: new Date(row.date_published).toLocaleDateString(),
            date_edited: new Date(row.date_edited).toLocaleDateString(),
            article_text: row.article_text
        });
    },
        (err, num_rows) => {
            return done(err, num_rows, results);

        }
    );
};

// This function adds a new article to the articles table in the database.
const addNewArticle = (article, done) => {

    let date = Date.now();
    const sql = 'INSERT INTO articles (title, author, date_published, date_edited, article_text, created_by) VALUES (?,?,?,?,?,?)';
    let values = [article.title, article.author, date, date, article.article_text, 1];

    db.run(sql, values, function (err) {
        if (err) return done(err, null);

        return done(null, this.lastID);
    });
};

// This function ges a single article from the articles table in the database using its article id.
const getSingleArticle = (id, done) => {
    const sql = 'SELECT * FROM articles WHERE article_id=?';

    db.get(sql, [id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);

        return done(null, {
            article_id: row.article_id,
            title: row.title,
            author: row.author,
            date_published: new Date(row.date_published).toLocaleDateString(),
            date_edited: new Date(row.date_edited).toLocaleDateString(),
            article_text: row.article_text
        });
    });
};

// This function updates an article in the articles table using its article id.
const updateArticle = (id, article, done) => {
    const sql = 'UPDATE articles SET title=?, author=?, article_text=? WHERE article_id=?';
    let values = [article.title, article.author, article.article_text, id];

    db.run(sql, values, (err) => {
        return done(err)
    });
};

// This function deletes an article from the articles table in the database using its article id.
const deleteArticle = (id, done) => {
    const sql = 'SELECT * FROM articles WHERE article_id = ?';

    db.get(sql, [id], (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false);

        const sql = 'DELETE FROM articles WHERE article_id = ?';
        db.run(sql, [id], (err) => {
            if (err) return done(err);
            return done(null, true);
        });
    });
};

// Here the functions are exported so they could be used in other files that require this file.
module.exports = {
    getAllArticles: getAllArticles,
    addNewArticle: addNewArticle,
    getSingleArticle: getSingleArticle,
    updateArticle: updateArticle,
    deleteArticle: deleteArticle
};