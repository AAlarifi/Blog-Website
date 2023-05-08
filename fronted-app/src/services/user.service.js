// Logs in a user
const login = (email, password) => {
    return  fetch("http://localhost:3333/login",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })
    .then((response) => {
        if(response.status === 200){
            return response.json();
        }else if (response.status === 404){
            throw "Bad request"
        }else {
            throw "Something went wrong"
        }
    })
    .then((resJson) => {
        localStorage.setItem("user_id", resJson.user_id);
        localStorage.setItem("session_token", resJson.session_token)
        return resJson
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

// Creates a user 
const createUser = (first_name, last_name, email, password) => {
    let session_token = localStorage.getItem("session_token");
    if (!session_token) {
        return Promise.reject(new Error("No session token found. Please login again."));
    }
    return fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": session_token
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            password
        })
    })
        .then(response => {
            if (response.status === 401) {
                return Promise.reject(new Error("Session expired. Please login again."));
            }
            if (response.status !== 201) {
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .catch(error => {
            console.log("Error: ", error);
            return Promise.reject(error);
        });
};

// Gets all the users
const getAll = () => {
    let session_token = localStorage.getItem("session_token");
    if (!session_token) {
        return Promise.reject(new Error("No session token found. Please login again."));
    }
    return fetch("http://localhost:3333/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": session_token
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((resJson) => {
            return resJson
        })
        .catch((error) => {
            console.log("Error: ", error)
            return Promise.reject(error)
        })
}

// Logs out the user removing their session token and user id
const logout = () => {
    let session_token = localStorage.getItem("session_token");
    if (!session_token) {
        return Promise.reject(new Error("No session token found. Please login again."));
    }
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_id");
    return fetch("http://localhost:3333/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": session_token
        }
    })
        .then((response) => {
            if (response.status === 200) {
                return Promise.resolve();
            } else {
                throw "Something went wrong"
            }
        })
        .catch((error) => {
            console.log("Err", error)
            return Promise.reject(error)
        });
};




export const userService = {
    login,
    createUser,
    getAll,
    logout
}