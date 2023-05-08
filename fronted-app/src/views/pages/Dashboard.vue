<template>
  <div class="container">
    <h1 class="text-center m-3">Dashboard</h1>
    <form class="text-center custom-bg rounded rounded-5 p-3 text-white" @submit.prevent="createUser">
      <div class="form-group">
        <h2 class="text-center">Create User</h2>
        <label for="first_name">First Name: </label>
        <input class="form-control text-center" type="text" name="first_name" v-model="first_name"
          v-bind:class="{ 'is-invalid': firstNameError }" placeholder="your first name..." />
        <div v-if="firstNameError" class="invalid-feedback">
          Please enter a first name.
        </div>
      </div>
      <div class="form-group">
        <label for="last_name">Last Name: </label>
        <input class="form-control text-center" type="text" name="last_name" v-model="last_name"
          v-bind:class="{ 'is-invalid': lastNameError }" placeholder="your last name..."/>
        <div v-if="lastNameError" class="invalid-feedback">
          Please enter a last name.
        </div>
      </div>
      <div class="form-group">
        <label for="email">Email: </label>
        <input class="form-control text-center" type="email" name="email" v-model="email"
          v-bind:class="{ 'is-invalid': emailError }" placeholder="your email address..."/>
        <div v-if="emailError" class="invalid-feedback">
          Please enter a valid email address.
        </div>
      </div>
      <div class="form-group">
        <label for="password">Password: </label>
        <input class="form-control text-center" type="password" name="password" v-model="password"
          v-bind:class="{ 'is-invalid': passwordError }" placeholder="your password..."/>
        <div v-if="passwordError" class="invalid-feedback">
          Please enter a valid password between 8 - 30 characters long. It must contain at least one lowercase letter,
          one
          uppercase letter, one number,
          and one special character.
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-2">Create User</button>
    </form>

    <div v-if="error">
      {{ error }}
    </div>
<br/>
    <div class="container">
      <form class="text-center custom-bg rounded rounded-5 p-3 text-white" @submit.prevent="createArticle">
        <h2 class="text-center">Create Article</h2>
        <label for="title">Add a title: </label>
        <input class="form-control text-center" type="title" name="title" v-model="title" required placeholder="A title..."/>
        <div v-show="(submitted && !title)">Title is required!</div>
        <label for="author">Add an author: </label>
        <input class="form-control text-center" type="author" name="author" v-model="author" required placeholder="An author..."/>
        <div v-show="(submitted && !author)">Author is required!</div>
        <label for="article_text">Add an article text: </label>
        <textarea class="form-control text-center" name="article_text" v-model="article_text" required placeholder="article text..."></textarea>
        <div v-show="(submitted && !article_text)">Article text is required!</div>
        <br />
        <button type="submit" class="btn btn-primary mt-1">Create Article</button>
        <div v-if="error">{{ error }}</div>
      </form>
    </div>

    <ul class="list-group mx-auto" >
      <h2 class="text-center pt-2">All Users</h2>
      <li class="list-group-item custom-bg p-2 mt-0 text-center rounded" v-for="user in users" :key="user.id">
        {{ user.first_name }} {{ user.last_name }} ({{ user.email }})
      </li>
    </ul>

  </div>


</template>


<script>
import { userService } from "../../services/user.service";
import { articleService } from "../../services/article.service";

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      emailError: false,
      passwordError: false,
      error: "",
      users: [],
      title: "",
      author: "",
      article_text: ""
    }
  },
  methods: {
    createUser() {
      this.firstNameError = false;
      this.lastNameError = false;
      this.emailError = false;
      this.passwordError = false;
      if (this.first_name === "") {
        this.firstNameError = true;
      }
      if (this.last_name === "") {
        this.lastNameError = true;
      }
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        this.emailError = true;
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/.test(this.password)) {
        this.passwordError = true;
      }
      if (this.emailError || this.passwordError) {
        return;
      }
      userService.createUser(this.first_name, this.last_name, this.email, this.password)
        .then(result => {
          console.log("User created successfully!");
          location.reload()
        })
        .catch(error => {
          this.error = error;
        })
    },
    createArticle() {
      articleService.createArticle(this.title, this.author, this.article_text)
        .then((response) => {
          this.title = ""
          this.author = ""
          this.article_text = ""
          console.log("Article created")
        })
        .catch((error) => {
          this.error = error
        })
    }
  },
  mounted() { // used this to run after the authentication.
    userService.getAll()
      .then(users => {
        this.users = users;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0;
}

li {
  margin: 10px 0;
}

.custom-bg {
  background-color: #a1a1a1;
}
</style>