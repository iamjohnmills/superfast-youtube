<template>
  <div class="video-item-placeholder">
    <div class="video-item-placeholder-img"></div>
    <div class="video-item-placeholder-content">
      <div class="video-item-placeholder-content-1"></div>
      <div class="video-item-placeholder-content-2"></div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'VideoResultPlaceholder',
}
</script>

<style>
.video-item-placeholder { display: flex; align-items: center; padding: 0.5em 0; }
.video-item-placeholder-img { display: block; background: rgba(0,0,0,0.06); width: 120px; height: 90px; flex: 0 0 120px; border-radius: 4px; }
.video-item-placeholder-content { flex-grow: 1; padding-left: 1em; }
.video-item-placeholder-content-1 { background: rgba(0,0,0,0.06); height: 30px; width: 100%; border-radius: 4px; margin-bottom: 0.5em; }
.video-item-placeholder-content-2 { height: 20px; border-radius: 4px; background: rgba(0,0,0,0.06); width: 50%; }
</style>
