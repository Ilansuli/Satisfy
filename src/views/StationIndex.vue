<template>
  <section v-if="isLoading" class="loader-wrapper">
    <div class="loader">
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
    </div>
  </section>
  <main>
    <StationList v-if="stations" :stations="stations" />
  </main>
</template>

<script>
import StationList from "../cmps/StationList.vue";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { stationService } from "../services/station.service";

export default {
  name: "StationIndex",
  data() {
    return {
      stationToAdd: stationService.getEmptyStation(),
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    stations() {
      this.isLoading = false;
      return this.$store.getters.stations;
    },
  },
  created() {},
  methods: {
    async addStation() {
      try {
        await this.$store.dispatch({
          type: "addStation",
          station: this.stationToAdd,
        });
        showSuccessMsg("Station added");
        this.stationToAdd = stationService.getEmptyStation();
      } catch (err) {
        console.log(err);
        showErrorMsg("Cannot add station");
      }
    },
  },
  components: {
    StationList,
  },
};
</script>
