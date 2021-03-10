<template>
  <div class="search">
    <form @submit.prevent="submitForm">
      <input v-model="q" placeholder="Search" />
      <button @click="submitForm">
        <svg class="svg-icon search-icon" aria-labelledby="title desc" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7"><g class="search-path" fill="none" stroke="#848F91"><path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4"/><circle cx="8" cy="8" r="7"/></g></svg>
      </button>
    </form>
    <div class="section-search-results">
      <div v-if="loading">
        <video-placeholder v-for="index in 10" :key="index" />
      </div>
      <div v-if="done && response">
        <video-item v-for="(item,index) in response" :key="index" :item="item" />
      </div>
      <app-content v-if="!loading && !done" />
    </div>
  </div>
</template>

<script>
import {getVideos} from '@/utilities/index.js'
import Content from '@/components/Content.vue'
import VideoResult from '@/components/VideoResult.vue'
import VideoResultPlaceholder from '@/components/VideoResultPlaceholder.vue'

export default {
  name: 'Search',
  components: {
    'app-content': Content,
    'video-item': VideoResult,
    'video-placeholder': VideoResultPlaceholder
  },
  data(){
    return {
      q: 'when the rain begins to fall extended version',
      response: null,
      loading: false,
      done: false,
    }
  },
  watch: {
    'q':function(val){
      if(!val){
        this.loading = false;
        this.done = false;
        this.response = null;
      }
    }
  },
  methods: {
    submitForm: async function(){
      this.loading = false;
      this.done = false;
      this.response = null;
      if(this.q == '') return;
      this.loading = true;
      await getVideos({
        q: this.q,
        limit: 10,
      }).then(response => {
        this.loading = false;
        if(response.error){
          this.$eventHub.$emit('handleError',response.error);
          return;
        }
        this.done = true;
        this.response = response;
      }).catch(error => {
      });
    },
    clickVideo:function(item){
      this.$eventHub.$emit('setVideoId',item);
    },
  }
}
</script>

<style>
.search { }
form { display: flex }
input { outline: none; padding: 10px 15px; border: 1px solid #ccc; color: #2c3e50; border-radius: 2px; border-top-right-radius: 0; border-bottom-right-radius: 0; font-size: 18px; width: 100% }
button { border: 1px solid #ccc; border-left: 0; line-height: 1; padding: 10px 15px; cursor: pointer; }
.svg-icon.search-icon { display: inline-block; position: relative; top: 1px; width: 15px; height: 15px; }
.search-path { stroke: #4e5963; stroke-width: 2px; }
.section-search-results { padding: 1em 1em 0 1em; }
</style>
