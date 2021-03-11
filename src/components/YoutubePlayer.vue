<template>
  <div>
    <div class="player" ref="youtube_player"></div>
    <div class="player-video-info" v-if="item">
      <div class="player-video-title">{{item.snippet.title | title }}</div>
      <div class="player-video-content">
        <div class="player-video-viewcount">{{item.statistics.viewCount | thousands}} views</div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'YoutubePlayer',
  data(){
    return {
      item: null,
      player: null,
    }
  },
  filters: {
    thousands:function(val){
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    title:function(val){
      const txt = document.createElement("textarea");
      txt.innerHTML = val;
      return txt.value;
    },
  },
  beforeDestroy: function(){
    this.$eventHub.$off('setVideoId',this.setVideoId);
  },
  created(){
    this.$eventHub.$on('setVideoId',this.setVideoId);

    // load youtube iframe api script
    let script_el = document.createElement('script');
    script_el.setAttribute('src', 'https://www.youtube.com/iframe_api');
    document.head.appendChild(script_el);
  },
  mounted(){
    window.onYouTubeIframeAPIReady = this.createPlayer;
    //window.youTubePlayerChangeVideoId = this.youTubePlayerChangeVideoId;
    //window.onPlayerReady = this.onPlayerReady;
    //window.onPlayerStateChange = this.onPlayerStateChange;
  },
  methods: {
    setVideoId: function(item){
      this.item = item;
      this.$eventHub.$emit('resetScrollTop');
      if(!this.player){
        this.createPlayer();
      } else if(this.item.id.videoId){
        this.player.loadVideoById(this.item.id.videoId);
        this.player.playVideo();
      }
    },
    createPlayer: function(){
      if(!this.item) return;
      let options = {
        height: '390',
        width: '640',
        videoId: this.item.id.videoId,
        playerVars: {
          'autoplay': 1,
          'autohide': 0,
          'cc_load_policy': 0,
          'iv_load_policy': 0,
          'rel': 0,
          'showinfo': 0,
          'start': 0,
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      }
      this.player = new window.YT.Player(this.$refs.youtube_player, options);
    },
    onPlayerReady:function(){
      this.player.playVideo();
    },
    onPlayerStateChange:function(event){
      if(this.player.getPlayerState() == 0){
        // loop the video if ended
        this.player.playVideo();
      }
    },
  }
}
</script>
<style>
.player { width: 640px; height: 390px; max-width: 100%; background: #000; display: flex; align-items:center; justify-content: center; }
.player:before { content: '\25BA'; color: #fff; font-size: 100px }
.player-video-info { padding: 2em 2em 0.5em 2em; }
.player-video-title { font-weight: bold; font-size: 22px; margin-bottom: 0.2em }
/*
.player-video-content { display: flex }
.player-video-channel { margin-bottom: 0.2em; flex: 1; }
.player-video-viewcount { text-align: right; flex: 1; }
*/
</style>
