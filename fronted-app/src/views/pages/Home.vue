<template>
  <div class="containter" >
    <div class="text-center">
      <h1 class="text-center m-3">Blogs on the wired</h1>

      <em v-if="loading" class="text-center">Loading articles...</em>

      <ul class="list-group mx-auto" v-if="articles.length">
        <li class="list-group-item custom-bg p-2 ms-5 me-5 text-center rounded text-decorationj-none" v-for="article in articles" :key="article.article_id">
          <div>
            <router-link class="nav-link"  :to="'/articles/' + article.article_id">
              {{ article.title + ' by ' + article.author }}
            </router-link>
          </div>
        </li>
      </ul>

      <div v-if="error" class="text-center text-danger">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { articleService } from "../../services/article.service"


export default {
  data() {
    return {
      articles: [],
      error: "",
      loading: true
    }
  },
  mounted() {
    articleService.getAll()
      .then(articles => {
        this.articles = articles
        this.loading = false
      })
      .catch(error => this.error = error);
  }
}
</script>

<style scoped>
.custom-bg {
  background-color: #a1a1a1; 
}
.nav-link {
  text-decoration: none;
}

.nav-link:hover{
  text-decoration: underline;
}

</style>