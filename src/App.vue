<template>
  <div id="app" v-bind:class="'ui-state-'+ui_state">
    <div class="container">
      <section class="section-search">
        <search />
      </section>
      <section class="section-player" ref="section_player">
        <youtube-player />
        <related-videos />
      </section>
    </div>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import YoutubePlayer from './components/YoutubePlayer.vue'
import RelatedVideos from './components/RelatedVideos.vue'

export default {
  name: 'App',
  components: {
    'search': Search,
    'youtube-player': YoutubePlayer,
    'related-videos': RelatedVideos,
  },
  data(){
    return {
      ui_state: 0,
    }
  },
  beforeDestroy(){
    this.$eventHub.$off('resetScrollTop',this.resetScrollTop);
  },
  created(){
    this.$eventHub.$on('resetScrollTop',this.resetScrollTop);
  },
  methods: {
    resetScrollTop: function(){
      this.ui_state = 1;
      this.$refs.section_player.scrollTop = 0;
    },
  }
}
</script>

<style>
* { box-sizing: border-box; }
html,body { margin: 0; padding: 0; }
h2 { margin-bottom: 0; padding-bottom: 0; }
h2 + p { margin-top: 0; }
pre { overflow-x: auto; padding: 20px; border: 2px dashed #ccc; border-radius: 10px; }
.mr-1 { margin-right: 1em; }
#app { font-family: Avenir, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #2c3e50; background: #fff; }
.container { max-width: 640px; margin: 0 auto; }
.section-search { padding: 0 2em 1em 2em; }
#app.ui-state-0 .section-player { display: none; }
@media only screen and (min-width: 1100px) {
  #app.ui-state-1 .container { display: flex; max-width: 1200px; }
  #app.ui-state-1 .section-search { flex-grow: 1; padding: 2em; }
  #app.ui-state-1 .section-player { flex: 0 0 640px; padding: 2em 0 }
  #app.ui-state-0 .container { width: 640px; }
}
</style>
