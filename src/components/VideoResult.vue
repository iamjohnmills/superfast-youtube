<template>
  <div class="video-item" @click="clickVideo(item)" v-bind:class="{'active':active}">
    <div class="video-item-img" v-if="item.snippet">
      <div class="video-item-duration" v-if="duration_visible"><small>{{item.contentDetails.duration | duration }}</small></div>
      <img :src="item.snippet.thumbnails.default.url" />
    </div>
    <div class="video-item-content">
      <div class="video-item-title">{{item.snippet.title | title }}</div>
        <div class="video-item-meta">
          <small v-if="date_visible">{{item.snippet.publishedAt | date_since }}</small>
          <small>{{item.snippet.channelTitle }}</small>
        </div>
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
      } catch (e) {
        return '';
        //console.log(val);
        //console.log(e);
      }
    },
    title:function(val){
      const txt = document.createElement("textarea");
      txt.innerHTML = val;
      return txt.value;
    },
    date_since:function(val){
      const date = new Date(val);
      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = seconds / 31536000;
      if (Math.floor(interval) > 1) {
        const years = Math.floor(interval);
        return years + ' year' + (years.length !== 1 ? 's' : '') + ' ago';
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        const months = Math.floor(interval);
        return months + ' month' + (months.length !== 1 ? 's' : '') + ' ago';
      }
      interval = seconds / 86400;
      if (interval > 1) {
        const days = Math.floor(interval);
        return days + ' day' + (days.length !== 1 ? 's' : '') + ' ago';
      }
      interval = seconds / 3600;
      if (interval > 1) {
        const hours = Math.floor(interval);
        return hours + ' hour' + (hours.length !== 1 ? 's' : '') + ' ago';
      }
      interval = seconds / 60;
      if (interval > 1) {
        const minutes = Math.floor(interval);
        return minutes + ' minute' + (minutes.length !== 1 ? 's' : '') + ' ago';
      }
      seconds = Math.floor(seconds);
      return seconds + ' second' + (seconds.length !== 1 ? 's' : '') + ' ago';
      //return Math.floor(seconds) + " seconds ago";
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
.video-item { cursor: pointer; display: flex; align-items: center; padding: 1em; margin: 0 -1em; }
.video-item-meta { overflow: hidden; max-width: 280px; white-space: nowrap; }
.video-item-meta small:first-child:after { content: '/'; display: inline-block; margin: 0 0.5em; }
.video-item-img { position: relative; flex: 0 0 120px; height: 90px; background: #000; }
.video-item-duration { position: absolute; font-weight: bold; bottom: 0; right: 0; background: #000; color: #fff; padding: 0 5px; }
.video-item-img img { display: block; }
.video-item-content { padding: 0 20px; font-size: 18px }
.video-item.active {  }
</style>
