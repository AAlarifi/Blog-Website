<template>
    <div class="container">

        <div class=" custom-bg rounded rounded-5 p-3">
            <em v-if="loading">Loading articles...</em>
            <h1 class="display-6"> {{ article.title }}</h1>
            <h5 class="text-primary">Writen by: {{ article.author }}</h5>
            <h6 class="text-secondary">Published: {{ article.date_published }}</h6>
            <p>{{ article.article_text }}</p>

            <button v-if="isLoggedIn" @click="deleteArticle" class="btn btn-primary me-1">Delete article</button>
            <button v-if="isLoggedIn" @click="editArticle" class="btn btn-primary">Edit</button>
            <div v-else>You need to be logged in to edit or delete this article.</div>

            <div class="" v-if="isEditing">
                <div class="form-group">
                    <label for="title">Add a title: </label>
                    <input class="form-control" type="text" v-model="title" placeholder="Title">
                </div>
                <div class="form-group">
                    <label for="author">Add an author: </label>
                    <input class="form-control" type="text" v-model="author" placeholder="Author">
                </div>
                <div class="form-group">
                    <label for="article_text">Add an article text: </label>
                    <textarea class="form-control" v-model="article_text"></textarea>
                </div>
                <button @click="updateArticle" class="btn btn-primary me-1 mt-2">Save changes</button>
                <button @click="cancelEdit" class="btn btn-primary mt-2">Cancel</button>
            </div>

            <h3>Comments:({{ num_comments }})</h3>

            <form @submit.prevent="">
                <label class="me-1" for="comment">Add a comment: </label>
                <input type="comment" name="comment" v-model="comment" />
                <div v-show="(submitted && !comment)">Comment is required!</div>

                <button @click="addComment" class="btn btn-primary ms-1 btn-sm">Add</button>
                <div v-if="error" v-text="error"></div>

            </form>


            <ul class="list-group" v-if="comments.length">
                <li class="list-group-item custom-bg" v-for="comment in comments" :key="article_id">
                    {{ comment.comment_text }}
                    <br />
                    Published on: {{ comment.date_published }}
                    <br />
                    <button v-if="isLoggedIn" @click="deleteComment(comment.comment_id)"
                        class="btn btn-primary btn-sm ">Delete</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { articleService } from "../../services/article.service"
import { commentsService } from "../../services/comments.service"

export default {
    data() {
        return {
            article: {},
            comments: [],
            num_comments: null,
            comment: "",
            error: "",
            loading: true,
            isEditing: false,
            title: "",
            author: "",
            article_text: ""
        }
    },
    mounted() {
        articleService.getOne(this.$route.params.id)
            .then((article) => {
                this.article = article;
                commentsService.getAll(this.$route.params.id)
                    .then((comments) => {
                        this.comments = comments
                        this.num_comments = comments.length
                        this.loading = false;
                    })
                    .catch(error => this.error = error)
            })
            .catch(error => this.error = error);
    },
    computed: {
        isLoggedIn() {
            return localStorage.getItem("session_token") !== null;
        }
    },
    methods: {
        deleteComment(comment_id) {
            commentsService.deleteOne(comment_id)
                .then(() => {
                    // Refreshes the pages
                    this.$router.go();
                })
                .catch(error => this.error = error)
        },
        addComment() {
            const { comment } = this
            commentsService.createComment(comment, this.$route.params.id)
                .then(() => {
                    this.comment = ""
                    commentsService.getAll(this.$route.params.id)
                        .then((comments) => {
                            this.comments = comments
                            this.num_comments = comments.length
                        })
                        .catch(error => this.error = error)
                })
                .catch(error => this.error = error)
        },
        deleteArticle() {
            articleService.deleteOne(this.$route.params.id)
                .then(() => {
                    this.$router.push("/").then(() => {
                        this.$router.go();
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        editArticle() {
            this.isEditing = true;
            this.title = this.article.title;
            this.author = this.article.author;
            this.article_text = this.article.article_text;
        },
        updateArticle() {
            articleService.patchArticle(this.$route.params.id, this.title, this.author, this.article_text)
                .then(() => {
                    this.isEditing = false;
                    this.$router.go();
                })
                .catch(error => this.error = error);
        },
        cancelEdit() {
            this.isEditing = false;
        }
    }
}
</script>
  
<style scoped>
.custom-bg {
    background-color: #a1a1a1;
}
</style>