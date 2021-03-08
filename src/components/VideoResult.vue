<template>
  <div class="video-item" v-if="is_visible" @click="clickVideo(item)" v-bind:class="{'active':active}">
    <div class="video-item-img"><img :src="item.snippet.thumbnails.default.url" /></div>
    <div class="video-item-content">
      <div class="video-item-title">{{item.snippet.title | decode }}</div>
      <div class="video-item-date" v-if="date_visible"><small>{{item.snippet.publishedAt | date_since }}</small></div>
      <div class="video-item-duration" v-if="duration_visible && duration"><small>{{item.contentDetails.duration | duration }}</small></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoResult',
  props: ['item'],
  data(){
    return {
      active: false,
    }
  },
  filters: {
    duration:function(val){
      try {
        var match = val.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        match = match.slice(1).map(function(x) {
          if (x != null) {
              return x.replace(/\D/, '');
          }
        });
        var hours = (match[0] || '');
        var minutes = (match[1] || '');
        var seconds = (match[2] || '');
        seconds = seconds.length == 1 ? '0' + seconds : seconds;
        return (hours ? hours + ':' : '') + (minutes ? minutes + ':' : '') + seconds;
      } catch (e) {
        return false;
      }
    },
    decode:function(val){
      const txt = document.createElement("textarea");
      txt.innerHTML = val;
      return txt.value;
    },
    date_since:function(val){
      const date = new Date(val);
      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = seconds / 31536000;
      if (interval > 1) {
        return Math.floor(interval) + " years ago";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months ago";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days ago";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours ago";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
      }
      return Math.floor(seconds) + " seconds ago";
    }
  },
  computed: {
    is_visible: function(){
      return typeof this.item.snippet !== 'undefined';
    },
    date_visible:function(){
      return this.item.id.kind == 'youtube#video' || this.item.id.kind == 'youtube#playlist';
    },
    duration_visible:function(){
      return typeof this.item.contentDetails !== 'undefined';
    },
  },
  beforeDestroy: function(){
    this.$eventHub.$off('setVideoId',this.setVideoId);
  },
  created(){
    this.$eventHub.$on('setVideoId',this.setVideoId);
  },
  methods: {
    setVideoId: function(video_id){
      this.active = this.item.id.videoId == video_id;
    },
    clickVideo:function(item){
      this.$eventHub.$emit('setVideoId',item.id.videoId);
    },
  }
}
</script>

<style>
.video-item { cursor: pointer; display: flex; align-items: center; padding: 0.5em 0; }
.video-item.first-child {  }
.video-item.last-child { }
.video-item-img img { display: block; }
.video-item-content { padding: 0 20px; font-size: 18px }
.video-item.active .video-item-title { font-weight: bold; }
</style>
