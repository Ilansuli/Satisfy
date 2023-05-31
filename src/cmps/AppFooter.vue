<template>
  <section class="footer">
    <section :style="{ backgroundColor: this.$store.getters.currColor }" ref="song-info" v-if="videoId" class="song-info">
      <img :src="imgUrl" alt="" />
      <div class="song-info-name">
        <div class="title">
          <div >{{ songTitle }}</div>
        </div>
        <span class="artist">{{ songArtist }}</span>
        <div class="play-pause-icon-mobile" @click="onPauseResume"
          v-html="isPlaying ? getSvg('pause') : getSvg('resume')"></div>
      </div>
    </section>
    <section v-else>
      <div class="placeholder"></div>
    </section>
    <YouTube v-if="videoId" hidden :src="'https://www.youtube.com/watch?v=' + videoId" ref="youtube" @ready="onReady"
      @state-change="onStateChange" />
    <section class="mid-section">
      <section class="footer-btns">
        <button @click="onShuffle" class="footer-btn">
          <div class="icon" :class="{ active: isShuffling }" v-html="getSvg('shuffle')"></div>
        </button>
        <button class="footer-btn" @click="onPrevSong">
          <div class="icon" v-html="getSvg('playPrev')"></div>
        </button>
        <button @click="onPauseResume" class="footer-btn btn-pause">
          <div class="play-pause-icon" v-html="isPlaying ? getSvg('pause') : getSvg('resume')"></div>
        </button>

        <button class="footer-btn" @click="onNextSong">
          <div class="icon" v-html="getSvg('playNext')"></div>
        </button>
        <button @click="onRepeat" class="footer-btn">
          <div class="icon" :class="{ active: isRepeating }" v-html="getSvg('repeat')"></div>
        </button>
      </section>
      <div class="music-bar">
        <span class="duration-span">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="findProgress($event)" ref="progressBar">
          <div class="progress-bar-fill" :style="{ width: progressBarWidth + '%' }" ref="progressBarFill"></div>
        </div>
        <span class="duration-span">{{ formatTime(duration) }}</span>
      </div>
    </section>
    <div class="music-settings-container">
      <section class="music-settings">
        <button @click="toggleMute" class="btn-mute">
          <div class="icon" v-html="isMuted ? getSvg('volume0') : getSvg('volume100')"></div>
        </button>
        <input class="footer-volume volume-slider" type="range" min="0" max="100" step="1" id="volume-slider"
          v-model="volume" />
      </section>
    </div>
  </section>
</template>

<script>
import { svgService } from '../services/svg.service.js';
import { eventBus } from '../services/event-bus.service.js';
import { defineComponent } from 'vue';
import YouTube from 'vue3-youtube';
import { socketService } from '../services/socket.service';

// export default defineComponent({
export default {
  components: { YouTube },
  data() {
    return {
      volume: 50,
      volumeSvg: '',
      isRepeating: true,
      playerVars: {
        loop: 1,
      },
      intervalId: null,
      isMuted: false,
      // isPlaying: false,
      isShuffling: false,
      duration: 0,
      currentTime: 0,
      isRepeating: false,
      unSub: null,
    };
  },
  methods: {
    onReady() {
      this.duration = this.$refs.youtube.getDuration();
      this.intervalId = setInterval(() => {
        this.currentTime = this.$refs.youtube.getCurrentTime();
      }, 1000);
      this.$refs.youtube.playVideo();
      // this.volume = 0;
      this.$store.commit({ type: 'play' });
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    onPauseResume() {
      this.$refs.youtube.playVideo();
      if (!this.videoId) return;
      // this.isPlaying = !this.isPlaying;
      if (!this.isPlaying) this.playVideo()
      else this.pauseVideo()
    },
    pauseVideo() {
      console.log('pauseVideo');
      this.$refs.youtube.pauseVideo();
      this.$store.commit({ type: 'pause' });
      socketService.emit('onPauseVideo', {})
    },
    playVideo() {
      console.log('playVideo');
      this.$refs.youtube.playVideo();
      this.$store.commit({ type: 'play' });
      socketService.emit('onPlayVideo', {})
    },
    // onPauseResume() {
    //     this.$store.commit({ type: 'pauseResume' })
    // },
    onNextSong() {
      this.$store.dispatch({ type: 'setNextSong' });
    },
    onPrevSong() {
      this.$store.dispatch({ type: 'setPrevSong' });
    },
    onRepeat() {
      this.isRepeating = !this.isRepeating;
    },
    onShuffle() {
      if (!this.videoId) return;
      this.isShuffling = !this.isShuffling;
    },
    toggleMute() {
      if (!this.videoId) return
      if (this.isMuted) this.volume = 50;
      else this.volume = 0;
      this.isMuted = !this.isMuted;
    },
    mute() {
      this.volume = 0
    },
    onStateChange(event) {
      // this.currentTime = 0
      this.duration = this.$refs.youtube.getDuration();
      if (event.data === 1) {
        // this.isPlaying = true
        this.$store.commit({ type: 'play' });
      }
      if (event.data === 0) {
        // this.isPlaying = false
        this.$store.commit({ type: 'pause' });
        clearInterval(this.intervalId);
        this.currentTime = 0;
        if (this.isRepeating) {
          this.$store.commit({ type: 'setSameSong' });
        } else if (this.isShuffling) {
          this.$store.commit({ type: 'setRandomSong' });
        } else {
          this.$store.commit({ type: 'setNextSong' });
        }
        this.$refs.youtube.playVideo();
        // this.isPlaying = true
        this.$store.commit({ type: 'play' });
        this.onReady();
      }
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    },
    findProgress(ev) {
      const progressBar = this.$refs.progressBar;
      const progressBarFill = this.$refs.progressBarFill;

      // calculate the position of the click on the progress bar

      const progressBarWidth = progressBar.offsetWidth;
      const clickedPosition = ev.pageX - progressBar.offsetLeft;
      const progressPercentage = clickedPosition / progressBarWidth;
      // calculate the time to seek to
      const newTime = this.duration * progressPercentage;

      // update the current time and seek to the new time
      this.currentTime = newTime;
      this.$refs.youtube.seekTo(newTime);

      // update the width of the progress bar fill
      progressBarFill.style.width = progressPercentage * 100 + '%';
    },
  },
  watch: {
    volume(newVolume) {
      if (!this.videoId) return
      this.$refs.youtube.setVolume(newVolume);
      // if (newVolume > 75) this.volumeSvg = 'volume100'
      // else if (newVolume > 25 && newVolume < 75) this.volumeSvg = 'volume75'
      // else if (newVolume > 0 && newVolume < 25) this.volumeSvg = 'volume25'
      // else if (newVolume === 0) this.volumeSvg = 'volume0'
    },
  },
  computed: {
    // volumeSvg() {
    //     return this.getSvg(this.volumeSvgName)
    // },
    videoId() {
      return this.$store.getters.currentSong.videoId;
    },
    imgUrl() {
      return this.$store.getters.currentSong.imgUrl;
    },
    songTitle() {
      return this.$store.getters.currentSong.title;
    },
    songArtist() {
      return this.$store.getters.currentSong.artist;
    },
    isShuffleActive() {
      return this.isShuffling ? 'active' : '';
    },
    shortenedTitle() {
      const maxLength = 16;
      return function (title) {
        return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
      };
    },
    progressBarWidth() {
      if (!this.duration || !this.currentTime) return;

      const progressBarWidth = (this.currentTime / this.duration) * 100;
      return progressBarWidth;
    },
    isPlaying() {
      return this.$store.getters.isPlaying;
    },
  },
  created() {
    this.unSub = eventBus.on('onTogglePlay', this.onPauseResume);
    socketService.on('setSong', async ({ song, station }) => {
      await this.$store.dispatch({ type: 'playSong', data: { song, station } })
      this.volume = 0
      this.$refs.youtube.setVolume(0)
    })
    socketService.on('playVideo', () => {
      this.$refs.youtube.playVideo();
      this.$store.commit({ type: 'play' });
    })
    socketService.on('pauseVideo', () => {
      this.$store.commit({ type: 'pause' });
      this.$refs.youtube.pauseVideo();
    })
  },
  unmounted() {
    this.unSub();
  },
};
</script>
