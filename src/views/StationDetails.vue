<template>
  <section v-if="isLoading">
    <div class="loader">
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
    </div>
  </section>
  <section v-else-if="station" class="station-details">
    <StationHeader @updateImgUrl="updateImgUrl" :station="station" />
    <div class="station-details-body">
      <PlayBtn :station="station" />
      <div v-if="station.isAddedByUser" @click.stop="openStationOptions" class="options-icon"
        v-html="getSvg('playlistOptions')"></div>
      <ul ref="modalContainer" class="options-menu" v-if="isStationOptionsShown">
        <li @click.stop="onOpenEdit">Edit</li>
        <li @click.stop="onRemoveStation">Delete</li>
      </ul>
    </div>
    <SongList v-if="station" @setSong="setSong" @setStation="setStation" @removeSong="removeSong" :station="station" />
    <section v-if="station.isAddedByUser" class="song-search-header">
      <h1>Let's find something for your playlist</h1>
      <SongSearch @setSearch="fetchSongs" class="station-details-search" />
    </section>
    <SongSearchList v-if="station.isAddedByUser" :songs="songs" class="search-results-list" @setSong="setSong"
      @addSong="addSong" />
    <hr />
    <div class="placeholder"></div>
  </section>
  <StationEditModal @updateImgUrl="updateImgUrl" @onCloseEditModal="onCloseEditModal" v-if="isEdit" :station="station" />
</template>

<script>
import { stationService } from '../services/station.service.js';
import { svgService } from '../services/svg.service.js';
import { getSongs } from '../services/songService.js';

import StationEditModal from '../cmps/StationEditModal.vue';
import StationHeader from '../cmps/StationHeader.vue';
import SongList from '../cmps/SongList.vue';
import SongSearchList from '../cmps/SongSearchList.vue';
import PlayBtn from '../cmps/PlayBtn.vue';
import SongSearch from '../cmps/SongSearch.vue';
export default {
  name: 'Song Details',
  data() {
    return {
      station: null,
      songs: null,
      isEdit: false,
      isLoading: true,
    };
  },
  created() {
    this.isLoading = true;
  },
  methods: {
    onOpenEdit() {
      this.$store.commit({ type: 'openStationEdit' });
    },
    openStationOptions() {
      this.$store.commit({ type: 'openStationOptions' });
    },
    async fetchSongs(query) {
      this.songs = await getSongs(query);
    },
    setSong(song) {
      this.$store.dispatch({ type: 'setSong', song });
    },
    setStation(station) {
      this.$store.dispatch({ type: 'setStation', station });
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    onRemoveStation() {
      this.$store.dispatch({ type: 'removeStation', stationId: this.station._id });
      this.$router.push('/station');
    },
    addSong(song) {
      this.station.songs.push(song);
      this.$store.dispatch({ type: 'updateStation', station: this.station });
    },
    async removeSong(songId) {
      const songIdx = this.station.songs.findIndex((song) => song._id === songId);
      this.station.songs.splice(songIdx, 1);
      try {
        await this.$store.dispatch({ type: 'updateStation', station: this.station });
      } catch (err) {
        console.log(err);
      }
    },
    updateImgUrl(imgUrl) {
      if (!imgUrl) return;
      this.station.imgUrl = imgUrl;
      this.$store.dispatch({ type: 'updateStation', station: this.station });
    },
  },
  computed: {
    isStationOptionsShown() {
      return this.$store.getters.isStationOptionsShown;
    },
  },
  watch: {
    '$route.params': {
      async handler() {
        const { stationId } = this.$route.params;
        try {
          const station = await stationService.getById(stationId);
          this.station = station;
          this.isLoading = false; 
        } catch (error) {
          console.log('Error fetching station: ', error);
        }
      },
      immediate: true,
    },
  },
  components: {
    StationHeader,
    SongList,
    SongSearchList,
    PlayBtn,
    SongSearch,
    StationEditModal,
  },
};
</script>
