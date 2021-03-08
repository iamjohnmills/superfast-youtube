<template>
  <div class="search">
    <form @submit.prevent="submitForm">
      <input v-model="q" placeholder="Search..." />
    </form>
    <div class="section-search-results">
      <app-content />
      <div v-if="loading">
        <video-placeholder v-for="index in 10" :key="index" />
      </div>
      <div v-if="done && response">
        <video-item v-for="(item,index) in response" :key="index" :item="item" />
      </div>
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
      q: null,
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
      this.response = await getVideos({
        q: this.q,
        limit: 10,
        api_key: process.env.VUE_APP_YOUTUBE_API_KEY
      }).then(response => {
        this.loading = false;
        this.done = true;
        this.response = response;
      }).catch(error => {
        this.loading = false;
        this.$eventHub.$emit('handleError',error);
      });
    },
    clickVideo:function(item){
      this.$eventHub.$emit('setVideoId',item.id.videoId);
    },
  }
}
</script>

<style>
.search { }
form {  }
input { padding: 15px 20px; border: 1px solid #ccc; border-radius: 10px; font-size: 18px; width: 100% }
.section-search-results { padding: 1em 1em 0 1em; }
</style>
