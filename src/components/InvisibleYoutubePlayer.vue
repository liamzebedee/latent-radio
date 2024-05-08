<template>
  <div ref="youtubePlayerContainer"></div>
</template>

<script>
export default {
  props: {
    videoId: String,
    playVideo: Boolean,
  },
  data() {
    return {
      player: null,
    };
  },
  watch: {
    playVideo(newVal) {
      if (this.player) {
        if (newVal) {
          this.player.playVideo();
        } else {
          this.player.pauseVideo();
        }
      }
    },
  },
  mounted() {
    this.loadYoutubeVideo();
  },
  methods: {
    loadYoutubeVideo() {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        this.player = new YT.Player(this.$refs.youtubePlayerContainer, {
          height: '0',
          width: '0',
          videoId: this.videoId,
          events: {
            onReady: this.onPlayerReady,
          },
          playerVars: {
            autoplay: 0,
            controls: 0,
          },
        });
      };
    },
    onPlayerReady(event) {
      if (this.playVideo) {
        event.target.playVideo();
      }
    },
  },
};
</script>

<style scoped>
</style>
