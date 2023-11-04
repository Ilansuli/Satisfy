<template>
  <nav class="mobile-nav">
    <RouterLink
      class="mobile-nav-btn"
      @click="
        $store.commit({ type: 'toggleFilterShown', isFilterShown: false })
      "
      to="/station"
    >
      <div
        class="icon"
        v-html="isHome ? getSvg('homeFull') : getSvg('home')"
      ></div>
    </RouterLink>

    <RouterLink
      class="mobile-nav-btn"
      @click="$store.commit({ type: 'toggleFilterShown', isFilterShown: true })"
      to="/search"
    >
      <div
        class="icon nav-search"
        v-html="isSearch ? getSvg('search') : getSvg('emptySearch')"
      ></div>
    </RouterLink>

    <button class="mobile-nav-btn" @click.stop="onRouterLibrary">
      <div
        class="icon"
        v-html="isLibrary ? getSvg('libraryFull') : getSvg('library')"
      ></div>
    </button>
  </nav>
</template>

<script>
import { svgService } from "../services/svg.service.js";

export default {
  methods: {
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    onRouterLibrary() {
      if (!this.loggedinUser) {
        return this.$router.push("/login");
      }
      return this.$router.push("/library");
    },
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isHome() {
      return this.$route.name === "StationIndex";
    },
    isSearch() {
      return this.$route.name === "Search";
    },
    isLibrary() {
      return this.$route.name === "Library";
    },
  },
};
</script>
