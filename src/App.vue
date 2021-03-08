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
#app { font-family: Avenir, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #2c3e50; background: #fff; }
.container { position: fixed; background: #fff; left: 0; top: 0; right: 0; bottom: 0; display: flex; min-width: 1000px; max-width: 1200px; margin: 0 auto;  }
#app.ui-state-0 .container { position: relative; width: 600px; margin: 0 auto; min-width: 600px; }
.section-search { flex-grow: 1; padding: 2em 2em 1em 2em; overflow-y: scroll; }
#app.ui-state-1 .section-search { border-right: 1px solid #ccc; }
.section-player { display: none; flex: 0 0 640px; border-left: 1px solid #ccc; margin-left: -1px; overflow-y: scroll; overflow-x: hidden; }
#app.ui-state-1 .section-player { display: block;  }


</style>
