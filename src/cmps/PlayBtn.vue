<template>
  <button @click.stop="setSong" class="play-btn">
    <div class="play-btn-icon" v-html="getSvg"></div>
  </button>
</template>

<script>
import { eventBus } from '../services/event-bus.service';
import { socketService } from '../services/socket.service';
import { svgService } from '../services/svg.service.js';
export default {
  name: 'Play Btn',
  props: {
    station: {
      type: Object
    }
  },
  methods: {
    setSong() {
     
      const song = this.station._id === 'likedSongs' ?
        this.loggedinUser.likedSongs[0] :
        this.station.songs[0]
      // this.$store.dispatch({ type: 'setSong', song })
      // this.$store.dispatch({ type: 'setStation', station: this.station })
      // eventBus.emit('onTogglePlay')
      socketService.emit('playSong', { song, station: this.station })
      this.$store.dispatch({ type: 'playSong', data: { song, station: this.station } })
    },

  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
    getSvg() {

      if (this.isPlaying && this.currStation._id === this.station._id) {
        return svgService.getSvg('pauseLarge')
      } else return svgService.getSvg('playSongLarge')
    },
    currStation() {
      return this.$store.getters.currentStation
    },
    isPlaying() {
      return this.$store.getters.isPlaying
    },
  }
}
</script>