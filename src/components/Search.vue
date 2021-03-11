<template>
  <div class="search">
    <form @submit.prevent="submitForm">
      <input v-model="q" placeholder="Search" />
      <button @click="submitForm">
        <icon name="search" />
      </button>
    </form>
    <div class="section-search-results">
      <error />
      <div v-if="loading">
        <video-placeholder v-for="index in 5" :key="index" />
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
import Error from '@/components/Error.vue'
import Content from '@/components/Content.vue'
import VideoResult from '@/components/VideoResult.vue'
import VideoResultPlaceholder from '@/components/VideoResultPlaceholder.vue'

export default {
  name: 'Search',
  components: {
    'error': Error,
    'app-content': Content,
    'video-item': VideoResult,
    'video-placeholder': VideoResultPlaceholder
  },
  data(){
    return {
      q: '',
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
        //use_local_data: true
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
form { display: flex }
input { outline: none; padding: 10px 15px; border: 1px solid #ccc; color: #2c3e50; border-radius: 2px; border-top-right-radius: 0; border-bottom-right-radius: 0; font-size: 18px; width: 100% }
button { border: 1px solid #ccc; border-left: 0; line-height: 1; padding: 10px 15px; cursor: pointer; }
.svg-icon.search-icon { display: inline-block; position: relative; top: 1px; width: 15px; height: 15px; }
.search-path { stroke: #4e5963; stroke-width: 2px; }
.section-search-results { padding: 1em 1em 0 1em; }
</style>
