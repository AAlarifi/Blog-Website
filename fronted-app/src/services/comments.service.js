
// Gets all comments from an article
const getAll = (id) => {
    return fetch("http://localhost:3333/articles/" + id + "/comments")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text()
                    .then(message => {
                        throw new Error(message)
                    })
            }
        })
        .then((resJson) => {
            return resJson
        })
        .catch((error) => {
            console.log("Err", error)
            return Promise.reject(error)
        })
}

// Creates a comment
const createComment = (comment_text, id) => {
    return fetch("http://localhost:3333/articles/" + id + "/comments",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "comment_text": comment_text
            })
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text()
                    .then(message => {
                        throw new Error(message)
                    })
            }
        })
        .then((resJson) => {
            return resJson
        })
        .catch((error) => {
            console.log("Err", error)
            return Promise.reject(error)
        });
}

// Deletes a comment using the comment id
const deleteOne = (comment_id) => {
    let session_token = localStorage.getItem("session_token");
    if (!session_token) {
        return Promise.reject(new Error("No session token found. Please login again."));
    }
    return fetch("http://localhost:3333/comments/" + comment_id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": session_token
        }
    })
        .then((response) => {
            if (response.ok) {
                return response;
            } else {
                return response.text()
                    .then(message => {
                        throw new Error(message)
                    })
            }
        })
        .then((resJson) => {
            return resJson
        })
        .catch((error) => {
            console.log("Err", error)
            return Promise.reject(error)
        });
};


// Exports functions
export const commentsService = {
    getAll,
    createComment,
    deleteOne
}