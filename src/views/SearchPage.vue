<template>
  <SongSearchPage  @setSong="setSong" v-if="firstFourSongs" :firstFourSongs="firstFourSongs" />
  <section v-else class="labels-list-container">
    <h1>Browse all</h1>
    <div class="labels-list">
      <article class="label-container" :class="getRandomColorClass(index)" v-for="(label, index) in labels"
        @click="setLabel(label)" :key="index">
        <img :src="label.imgUrl" />
        <h2 class="label-container-name">{{ label.name }}</h2>
      </article>
    </div>
  </section>
</template>

<script>
import { utilService } from '../services/util.service.js';
import { getSongs } from '../services/songService.js';

import SongSearchList from '../cmps/SongSearchList.vue';
import SongSearchPage from './SongSearchPage.vue';

export default {
  name: 'Search Page',
  data() {
    return {
      firstFourSongs: null,
      isLoading: true,
    };
  },
  created() {
    this.isLoading = true;
  },
  mounted() {
    this.$store.dispatch('setCurrColor', 'rgb(0,0,0)');
  },
  computed: {
    labels() {
      return this.$store.getters.labels;
    },
  },
  watch: {
    '$route.query': {
      async handler() {
        const { query } = this.$route.query;
        if (query) {
          const songs = await getSongs(query);
          console.log(songs)
          this.firstFourSongs = songs.slice(0,4)
        }
        this.isSearchPage = this.$route.path === '/search' ? true : false;
      },
      immediate: true,
    },
    $route: {
      handler() {
        const { path } = this.$route;
        if (path === '/search') this.songs = null;
      },
      immediate: true,
    },
  },
  methods: {
    setSong(song) {
      console.log('page', song);
      this.$store.dispatch({ type: 'setSong', song });
    },
    setLabel(label) {
      this.$router.push(`/genre/${label.name}`);
    },
    getRandomColorClass(index) {
      const colors = [
        'label-container-0',
        'label-container-1',
        'label-container-2',
        'label-container-3',
        'label-container-4',
        'label-container-5',
        'label-container-6',
        'label-container-7',
        'label-container-8',
        'label-container-9',
        'label-container-10',
        'label-container-11',
        'label-container-12',
        'label-container-13',
        'label-container-14',
        'label-container-15',
        'label-container-16',
        'label-container-17',
        'label-container-18',
        'label-container-19',
        'label-container-20',
        'label-container-21',
        'label-container-22',
        'label-container-23',
        'label-container-24',
      ];
      const randomIdx = utilService.getRandomIntInclusive(0, colors.length - 1);
      return colors[randomIdx];
    },
  },
  created() { },
  components: {
    SongSearchList,
    SongSearchPage
},
};
</script>
