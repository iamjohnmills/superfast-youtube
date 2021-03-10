<template>
  <div class="relatedvideos">
    <p><b>Related Videos</b></p>
    <div v-if="!done">
      <video-placeholder v-for="index in 3" :key="index" />
    </div>
    <div v-if="done && response">
      <video-item v-for="(item,index) in response" :key="index" :item="item" />
    </div>
  </div>
</template>

<script>
import {getVideos} from '@/utilities/index.js'
import VideoResult from '@/components/VideoResult.vue'
import VideoResultPlaceholder from '@/components/VideoResultPlaceholder.vue'

export default {
  name: 'RelatedVideos',
  components: {
    'video-item': VideoResult,
    'video-placeholder': VideoResultPlaceholder
  },
  data(){
    return {
      response: null,
      loading: false,
      done: false,
      video_id: null,
    }
  },
  beforeDestroy(){
    this.$eventHub.$off('setVideoId',this.setVideoId);
  },
  created(){
    this.$eventHub.$on('setVideoId',this.setVideoId);
  },
  methods: {
    setVideoId: function(video_id){
      this.video_id = video_id;
      this.getRelatedVideos();
    },
    getRelatedVideos: function(){
      this.loading = true;
      this.done = false;
      this.response = null;
      getVideos({
        related_to: this.video_id,
        limit: 5,
      }).then(response => {
        this.response = response;
        this.loading = false;
        this.done = true;
        this.$eventHub.$emit('resetScrollTop');
      }).catch(error => {
        this.loading = false;
        this.$eventHub.$emit('RelatedVideosError',error);
      });
    },
  }
}
</script>

<style>
.relatedvideos { padding: 2em 2em 1em 2em;  }
.relatedvideos p { margin: 0 0 0.5em 0; }
</style>
