<template>
  <div v-if="error" class="error">
    <h2 class="error-title">{{error | error_title}}</h2>
    <p class="error-message" v-if="error.errors[0].reason == 'quotaExceeded'">This is app is so fast that Youtube needed to step in and throttle my API quota to prevent it from breaking the barriers of physical space and time.</p>
    <pre class="error-raw">{{error}}</pre>
  </div>
</template>

<script>

export default {
  name: 'Error',
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
      this.$eventHub.$emit('setAppStateUI',0);
    },
  }
}
</script>

<style>
.error { margin-bottom: 2em; }
</style>
