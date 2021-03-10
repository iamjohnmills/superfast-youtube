<template>
  <div>

    <div v-if="error" class="error">
      <h2 class="error-title">{{error | error_title}}</h2>
      <p class="error-message" v-if="error.error.errors[0].reason == 'quotaExceeded'">This is app is so fast that Youtube needed to step in and throttle my API quota to prevent it from breaking the barriers of physical space and time.</p>
      <pre class="error-raw">{{error}}</pre>
    </div>

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
        <dt><b>Technical Highlights</b></dt>
        <dd>Video titles are decoded to show special characters</dd>
        <dd>Video duration is included by merging it with additional endpoint sources</dd>
      </dl>
      <dl>
        <dt><b>Frontend</b></dt>
        <dd>Vue 2</dd>
        <dd>Youtube Data API v3</dd>
        <dd>Youtube iFrame API</dd>
      </dl>
      <dl>
        <dt><b>Backend</b></dt>
        <dd>Node</dd>
        <dd>Express</dd>
        <dd>Other: Dotenv, Got</dd>
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
      return 'Error ' + val.error.code + ': ' + val.error.errors[0].reason;
    },
    error_message:function(val){
      return val.error.errors[0].reason == 'quotaExceeded' ? 'Youtube decided my app is over quota with API requests. Personally, I feel the amount they let you have for personal projects is not enough' : JSON.stringify(val);
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
h2 { margin-bottom: 0; padding-bottom: 0; }
h2 + p { margin-top: 0; }
pre { overflow-x: auto; padding: 20px; border: 2px dashed #ccc; border-radius: 10px; }
</style>
