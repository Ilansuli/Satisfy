<template>
  <ul v-if="station" class="song-list">
    <div
      v-if="hasSongs"
      :class="getClass"
      class="song-preview-main song-preview-header"
    >
      <div>#</div>
      <div class="title">Title</div>
      <div v-if="!station.isAddedByUser" class="album">Album</div>
      <div class="date-added">Date Added</div>
      <div>
        <div></div>
        <div class="clock-icon" v-html="getSvg('clock')"></div>
        <div></div>
      </div>
    </div>
    <Container orientation="vertical" @drop="onDrop">
      <Draggable v-for="(song, index) in station.songs" :key="song._id">
        <SongPreview
          @removeSong="removeSong"
          @setSong="setSong"
          @setStation="setStation"
          @setActiveSong="setActiveSong"
          :activeSongId="activeSongId"
          :song="song"
          :station="station"
          :index="index"
        />
      </Draggable>
    </Container>
  </ul>
</template>

<script>
import { Container, Draggable } from "vue3-smooth-dnd";
import SongPreview from "./SongPreview.vue";
import { svgService } from "../services/svg.service.js";
export default {
  name: "Song List",
  props: {
    station: {
      type: Object,
      require: true,
    },
  },
  emits: ["removeSong", "setSong", "setStation"],
  data() {
    return {
      activeSongId: "",
    };
  },
  methods: {
    getSvg(iconName) {
      return svgService.getSvg(iconName);
    },
    removeSong(songId) {
      this.$emit("removeSong", songId);
    },
    setActiveSong(id) {
      this.activeSongId = id;
    },
    setSong(song) {
      this.$emit("setSong", song);
    },
    setStation(station) {
      this.$emit("setStation", station);
    },
    onDrop(dropResult) {
      this.station.songs = this.applyDrag(this.station.songs, dropResult);
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult;

      if (removedIndex === null && addedIndex === null) return arr;
      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }
      return result;
    },
  },
  computed: {
    hasSongs() {
      return this.station.songs.length;
    },
    getClass() {
      return {
        "not-custom": !this.station.isAddedByUser,
        custom: this.station.isAddedByUser,
      };
    },
  },
  created() {},
  components: {
    SongPreview,
    Container,
    Draggable,
  },
};
</script>
