<template>
  <section class="song-search-page-list">
    <ul v-if="songs" :class="setSearchClass" class="song-search-results-wrap">
      <SongSearchPreview v-for="(song, index) in songs" @addSong="addSong" @setSong="setSong" :song="song" :key="index" />
    </ul>
  </section>
</template>

<script>
import { stationService } from '../services/station.service.js';
import { svgService } from '../services/svg.service.js';
import SongSearchPreview from './SongSearchPreview.vue';

export default {
  name: 'Song Search List',
  props: {
    songs: {
      type: Array
    }
  },
  emits:['setSong'],
  data() {
    return {
      query: '',
      currStation: {},
      loading: false,
    };
  },
  async created() {
    console.log(this.songs)
    const { stationId } = this.$route.params;
    try {
      const station = await stationService.getById(stationId);
      this.currStation = station;
    } catch (error) {
      console.log('Error fetching station: ', error);
    }
  },
  computed: {
    setSearchClass() {
      if (this.$route.path === '/search') return 'search-page'
    }
  },
  methods: {
    addSong(song) {
      this.$emit('addSong', song);
      const idx = this.songs.findIndex(songToFind=> songToFind._id === song._id)
      this.songs.splice(idx,1)
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    setSong(song) {
      this.$emit('setSong',song)
    },
  },

  components: {
    SongSearchPreview,
  },
};
</script>
