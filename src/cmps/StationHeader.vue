<template>
  <header class="station-details-header">
    <div class="img-wrapper" >
      <article :class="station.isAddedByUser ? 'custom' : 'not-custom'" class="choose-photo">
        <div  class="pencil-icon" v-html="getSvg('pencil')"></div>
        <span>Choose Photo</span>
        <ImgUploader v-if="station.isAddedByUser" @updateImgUrl="updateImgUrl"  />
      </article>

      <div class="img-container">
        <img ref="image" :src="station.imgUrl" alt="" crossorigin="anonymous" />
        
      </div>
    </div>
    <div class="station-details-header-info">
      <span class="playlist">Playlist</span>
      <h1 class="station-details-header-title"  :class="station.isAddedByUser ? 'custom' : 'not-custom'" @click.stop="openStationEdit">{{ station.title }}</h1>
      <!-- <div>
        <span v-if="station.desc" v-for="(d, idx) in station.desc" :key="idx" class="station-preview-desc">{{ d }}
          <span v-if="idx < 2">{{ ',' }} {{ '&nbsp;' }} </span>
        </span>
      </div> -->
      <p class="user-desc" @click.stop="openStationEdit">{{ station.userDesc }}</p>
      <RouterLink :to="station.isAddedByUser ? '/library' : '/station'" class="by-user">
        <div v-if="!station.isAddedByUser" class="headphones-icon" v-html="getSvg('smallHeadphones')"></div>
        <p class="username">
          {{ station.isAddedByUser ? loggedInUser.fullname : 'Satisfy' }}
        </p>
        <span>
          <p class="songs-count">{{ station.songs.length }} songs,</p>
          <p v-if="getStationDuration" class="songs-total-duration">{{ getStationDuration }}</p>
        </span>
      </RouterLink>
    </div>
    <StationEditModal @updateImgUrl="updateImgUrl" @onCloseEditModal="onCloseEditModal" v-if="isStationEditShown" :station="station" />
  </header>
</template>

<script>
import { FastAverageColor } from 'fast-average-color';
import { svgService } from '../services/svg.service.js';
import ImgUploader from '../cmps/ImgUploader.vue';
import StationEditModal from './StationEditModal.vue';

export default {
  name: 'Station Header',
  props: {
    station: {
      type: Object,
      // required: true
    },
  },
  emits: ['onCloseEditModal', 'updateImgUrl'],
  data() {
    return {
      loggedInUser: null,
    };
  },
  mounted() {
    const image = this.$refs.image;
    const fac = new FastAverageColor();
    image.addEventListener('load', () => {
      const color = fac.getColor(image, { algorithm: 'dominant' });
      this.$store.dispatch('setCurrColor', color.rgb);
    });
    // this.$store.dispatch('setCurrColor', `rgb(0, 0, 0)`);
  },
  // unmounted() {
  //   const image = this.$refs.image;
  //   image.removeEventListener('load');
  // },
  methods: {
    openStationEdit() {
      if (!this.station.isAddedByUser) return;
      this.$store.commit({ type: 'openStationEdit' })
    },
    onCloseEditModal() {
      this.isEdit = false;
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    updateImgUrl(imgUrl) {
      if (!imgUrl) return;
      this.$emit('updateImgUrl', imgUrl);
    },
  },

  computed: {
    isStationEditShown() {
      return this.$store.getters.isStationEditShown
    },
    getStationDuration() {
      const totalSeconds = this.station.songs.reduce((total, song) => {
        const [minutes, seconds] = song.duration.split(':').map(Number);
        return total + minutes * 60 + seconds;
      }, 0);
      if(!totalSeconds)return false
      else if (totalSeconds < 3600) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} min ${seconds} sec`;
      } else {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours} hour ${minutes} min`;
      }
    }

  },

  created() {
    this.loggedInUser = this.$store.getters.loggedinUser;
  },
  components: {
    StationEditModal,
    ImgUploader,
  },
};
</script>
