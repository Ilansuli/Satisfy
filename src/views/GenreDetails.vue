<template>
  <section v-if="isLoading" class="loader-wrapper">
    <div class="loader">
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
    </div>
  </section>

  <ul v-else-if="stations" class="station-list genre">
    <StationPreview
      v-if="stations"
      v-for="station in stations"
      :key="station._id"
      :station="station"
    />
  </ul>
</template>
<script>
import { stationService } from "../services/station.service";
import StationPreview from "../cmps/StationPreview.vue";

export default {
  name: "Genre Page",
  props: {},
  data() {
    return {
      label: "",
      stations: null,
      isLoading: true,
    };
  },
  computed: {
    labeledStations() {
      const filteredStations = this.stations.filter(
        (station) => !station.isAddedByUser
      );
      return labeledStations;
    },
  },
  watch: {
    "$route.params": {
      handler() {
        this.label = this.$route.params.label;
      },
      immediate: true,
    },
  },
  async created() {
    this.isLoading = true;
    try {
      this.stations = await stationService.query({ label: this.label });
      this.isLoading = false;
    } catch (err) {
      console.log("Failed to get loggedinUser stations");
    }
  },
  components: {
    StationPreview,
  },
};
</script>
