<template>
  <div class="video-item" @click="clickVideo(item)" v-bind:class="{'active':active}">
    <div class="video-item-img"><img :src="item.snippet.thumbnails.default.url" /></div>
    <div class="video-item-content">
      <div class="video-item-title">{{item.snippet.title | decode }}</div>
      <div class="video-item-date" v-if="date_visible"><small>{{item.snippet.publishedAt | date_since }}</small></div>
      <div class="video-item-duration" v-if="duration_visible"><small>{{item.contentDetails.duration | duration }}</small></div>
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
      const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
      let hours = 0, minutes = 0, seconds = 0, totalseconds;
      if(reptms.test(val)) {
        var matches = reptms.exec(val);
        if (matches[1]) hours = Number(matches[1]);
        if (matches[2]) minutes = Number(matches[2]);
        if (matches[3]) seconds = Number(matches[3]);
        totalseconds = hours * 3600  + minutes * 60 + seconds;
      }
      return new Date(totalseconds * 1000).toISOString().substr(11, 8).replace(/^0(?:0:0?)?/, '');
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
    setVideoId: function(item){
      this.active = this.item.id.videoId == item.id.videoId;
    },
    clickVideo:function(item){
      this.$eventHub.$emit('setVideoId',item);
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
