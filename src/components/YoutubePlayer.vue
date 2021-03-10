<template>
  <div>
    <div class="player" ref="youtube_player"></div>
  </div>
</template>
<script>
export default {
  name: 'YoutubePlayer',
  data(){
    return {
      video_id: null,
      player: null,
    }
  },
  computed: {
  },
  beforeDestroy: function(){
    this.$eventHub.$off('setVideoId',this.setVideoId);
  },
  created(){
    this.$eventHub.$on('setVideoId',this.setVideoId);
    this.loadScripts();
  },
  mounted(){
    window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
    //window.youTubePlayerChangeVideoId = this.youTubePlayerChangeVideoId;
    //window.onPlayerReady = this.onPlayerReady;
    //window.onPlayerStateChange = this.onPlayerStateChange;
  },
  methods: {
    setVideoId: function(video_id){
      this.playlist_id = null;
      this.video_id = video_id;
      this.$eventHub.$emit('resetScrollTop');
      this.youTubePlayerChangeVideoId();
    },
    loadScripts: async function(){
      let script_el = document.createElement('script');
      script_el.setAttribute('src', 'https://www.youtube.com/iframe_api');
      document.head.appendChild(script_el);
    },
    onYouTubeIframeAPIReady: async function(){
      if(!this.video_id && !this.playlist_id) return;
      let options = {
        height: '390', // 390
        width: '640', // 640
        videoId: this.video_id,
        playerVars: {
          'autoplay': 1,
          'autohide': 0,
          'cc_load_policy': 0,
          'iv_load_policy': 0,
          //'modestbranding': 1,
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
        this.onPlaybackEnded();
      }
    },
    onPlaybackEnded:function(){
      this.player.playVideo();
    },
    youTubePlayerChangeVideoId:async function(){
      if(!this.player){
        this.onYouTubeIframeAPIReady();
      } else if(this.video_id){
        this.player.loadVideoById(this.video_id);
        this.player.playVideo();
      }
    },
  }
}
</script>
<style>
.player { width: 640px; height: 390px; max-width: 100%; background: #000; display: flex; align-items:center; justify-content: center; }
.player:before { content: '\25BA'; color: #fff; font-size: 100px }
</style>
