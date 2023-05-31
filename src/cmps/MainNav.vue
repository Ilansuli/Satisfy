<template>
  <section class="main-nav">
    <RouterLink to="/" class="main-nav-logo">
      <div class="headphones-icon" v-html="getSvg('headphones')"></div>
      <h1>Satisfy</h1>
    </RouterLink>
    <section class="nav">
      <RouterLink class="btn-nav" @click="$store.commit({ type: 'toggleFilterShown', isFilterShown: false })"
        to="/station">
        <div class="icon" v-html="isHome ? getSvg('homeFull') : getSvg('home')"></div>
        <span> Home </span>
      </RouterLink>
      <RouterLink class="btn-nav" @click="$store.commit({ type: 'toggleFilterShown', isFilterShown: true })" to="/search">
        <div class="icon nav-search" v-html="isSearch ? getSvg('search') : getSvg('emptySearch')"></div>
        <span> Search </span>
      </RouterLink>
      <button class="btn-nav btn-nav-library" @click.stop="onRouterLibrary">
        <div class="icon" v-html="isLibrary ? getSvg('libraryFull') : getSvg('library')"></div>
        <span> Your Library </span> 
        <LoginErrModal v-if="isLibraryLogErrShown" :loginErrType="'library-err'" :title="'Enjoy Your Library'" :body="'Log in to see saved songs, podcasts, artists, and playlists in Your Library.'"/>
      </button>
    </section>
    <section class="actions">
      <button @click.stop="onCreateStation" class="create-playlist-btn">
        <div class="btn-create">
          <div class="icon create-icon" v-html="getSvg('createPlaylist')"></div>
        </div>
        <span> Create Playlist </span>
        <LoginErrModal v-if="isCreatePlaylistLogErrShown" :loginErrType="'create-playlist-err'" :title="'Create a playlist'" :body="'Log in to create and share playlists.'"/>
      </button>
      <button class="liked-songs-btn" @click.stop="onRouterLiked">
        <div class="btn-liked">
          <div class="icon" v-html="getSvg('likedSongsHeart')"></div>
        </div>
        <span> Liked Songs </span>
        <LoginErrModal v-if="isLikedLogErrShown" :loginErrType="'liked-err'" :title="'Enjoy your Liked Songs'" :body="'Log in to see all the songs you’ve liked in one easy playlist.'"/>
      </button>
    </section>
    <hr />
    <section class="user-playlists">
      <ul class="playlist-links">
        <RouterLink class="user-station" v-if="loggedinUser" v-for="userStation in userStations"
          :to="'/station/' + userStation._id" :key="userStation._id">
          <span class="user-station-title">
            {{ userStation.title }}
          </span>
          <div class="played-station-icon" v-if="isPlaying && userStation._id === currentStation._id" v-html="getSvg('volume100')"></div>
        </RouterLink>
      </ul>
    </section>
    <!-- <button class="install-btn">
            <div class="icon" v-html="getSvg('install')"></div> Install App
        </button> -->
  </section>
</template>

<script>
import { svgService } from '../services/svg.service.js';
import { stationService } from '../services/station.service.js';
import LoginErrModal from './loginErrModal.vue';
export default {
  name: '',
  data() {
    return {
      currentRoute: '',
    };
  },
  mounted() {
    this.$store.dispatch('setCurrColor', 'rgb(0,0,0)');
  },
  methods: {
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    onRouterLibrary(){
      if(!this.loggedinUser){
       return this.$store.commit({ type: 'openLibraryLogErr' })//TODO: ADD CONTINUE AS GUEST MODAL
      } 
      return this.$router.push('/library')
    },
    onRouterLiked(){
      if(!this.loggedinUser)return this.$store.commit({ type: 'openLikedLogErr' })//TODO: ADD CONTINUE AS GUEST MODAL
      return this.$router.push('/liked')
    },
    async onCreateStation() {
      if(!this.loggedinUser)return this.$store.commit({ type: 'openCreatePlaylistLogErr' })  //TODO: ADD CONTINUE AS GUEST MODAL 
      try {
        const newStation = stationService.getEmptyStation();
        const addedStation = await this.$store.dispatch({ type: 'addStation', newStation });
        this.$store.commit({ type: 'addUserStation', addedStation });
        this.$router.push(`/station/${addedStation._id}`);
      } catch (err) {
        console.log(err, 'Can not add station');
      }
    },
  },
  computed: {
    isLibraryLogErrShown() {
      return this.$store.getters.isLibraryLogErrShown;
    },
    isCreatePlaylistLogErrShown() {
      return this.$store.getters.isCreatePlaylistLogErrShown;
    },
    isLikedLogErrShown() {
      console.log(this.$store.getters.isLikedLogErrShown)
      return this.$store.getters.isLikedLogErrShown
    },
    currentStation() {
      return this.$store.getters.currentStation
    },
    isPlaying() {
      return this.$store.getters.isPlaying
    },
    userStations() {
      return this.$store.getters.userStations;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
    isHome() {
      if (this.$route.name === 'StationIndex') return true;
      else return false;
    },
    isSearch() {
      if (this.$route.name === 'Search') return true;
      else return false;
    },
    isLibrary() {
      if (this.$route.name === 'Library') return true;
      else return false;
    },
  },
  async created() {
    try {
      await this.$store.dispatch({ type: 'setUserStations' });
    } catch (err) {
      console.log('failed to get userStations in MainNav', err);
    }
  },
  watch: {
    $route: {
      handler() {
        const { name } = this.$route;
        this.currentRoute = name;
        // stationService.getById(stationId).then((station) => (this.station = station));
      },
      immediate: true,
    },
  },
  components: { LoginErrModal },
};
</script>

<style></style>
