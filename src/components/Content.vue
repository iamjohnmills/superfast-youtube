<template>
  <div>

    <div>
      <h2>Search Youtube videos, <i>only faster</i>!</h2>
      <p>Try it our for youself by searching, and clicking a video to play it.</p>
      <dl>
        <dt><b>Features</b></dt>
        <dd>Search Youtube by keyword(s) for videos only</dd>
        <dd>See a video&rsquo;s related videos</dd>
        <dd>Superfast video playback and switching between videos</dd>
      </dl>
      <dl>
        <dt><b>Technology</b></dt>
        <dd>Vue 2</dd>
        <dd>Youtube Data API v3</dd>
        <dd>Youtube iFrame API</dd>
        <dd>Backend: Node, Express, Axios</dd>
      </dl>
    </div>


  </div>
</template>

<script>

export default {
  name: 'Content',
  components: {
  },
  data(){
    return {
      error: null,
    }
  },
  filters: {
    error_title:function(val){
      return 'Error ' + val.code + ': ' + val.errors[0].reason;
    },
    error_message:function(val){
      return val.errors[0].reason == 'quotaExceeded' ? 'Youtube decided my app is over quota with API requests. Personally, I feel the amount they let you have for personal projects is not enough' : JSON.stringify(val);
    },
  },
  beforeDestroy(){
    this.$eventHub.$off('handleError',this.handleError);
  },
  created(){
    this.$eventHub.$on('handleError',this.handleError);
  },
  methods: {
    handleError:function(error){
      this.error = error;
    },
  }
}
</script>

<style>
.error { margin-bottom: 2em; }
</style>
