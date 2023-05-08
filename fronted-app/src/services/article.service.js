// Gets all articles 
const getAll = () => {
    return fetch("http://localhost:3333/articles")
        .then((Response) => {
            if (Response.status === 200) {
                return Response.json();
            } else {
                throw "Something went wrong!"
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

// Gets one article using its id
const getOne = (id) => {
    return fetch("http://localhost:3333/articles/" + id)
        .then((Response) => {
            if (Response.status === 200) {
                return Response.json();
            } else {
                throw "Something went wrong!"
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

// Deletes an article (must be logged in)
const deleteOne = (id) => {
    let session_token = localStorage.getItem("session_token");
    if (!session_token) {
        return Promise.reject(new Error("No session token found. Please login again."));
    }
    return fetch("http://localhost:3333/articles/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": session_token
        }
    })
        .then((response) => {
            if (response.status === 200 || response.status === 204) {
                return response;
            } else {
                throw "Something went wrong"
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

// Creates an article.
const createArticle = (title, author, article_text) => {
    let session_token = localStorage.getItem("session_token");
    if (!session_token) {
        return Promise.reject(new Error("No session token found. Please login again."));
    }
    return  fetch("http://localhost:3333/articles",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": session_token
        },
        body: JSON.stringify({
            "title": title,
            "author": author,
            "article_text": article_text,
        })
    })
    .then((Response) => {
        if(Response.status === 201){
            return Response.json();
        }else if (Response.status === 404){
            throw "Unautherized"
        }else {
            throw "Something went wrong"
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

// Upsates an article (must be logged in)
const patchArticle = (id, title, author, article_text) => {
    let session_token = localStorage.getItem("session_token");
    if (!session_token) {
        return Promise.reject(new Error("No session token found. Please login again."));
    }
    return  fetch("http://localhost:3333/articles/" + id,
    {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": session_token
        },
        body: JSON.stringify({
            "title": title,
            "author": author,
            "article_text": article_text,
        })
    })
    .then((response) => {
        if(response.status === 200){
            return response.text()
        }else {
            throw "Something went wrong"
        }
    })
    .then((res) => {
        if(res === "OK"){
            return true;
        }else{
            throw new Error(res)
        }
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

// Exporst functions
export const articleService = {
    getOne,
    getAll,
    deleteOne,
    createArticle,
    patchArticle
}