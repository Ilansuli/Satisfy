<template>
    <section class="song-search-page song-search-page-main ">
        <section class="first-section">
            <article class="top-result">
                <h3 class="top-result-title">Top Result</h3>
                <div class="top-result-preview">
                    <div class="top-result-img-wrap">
                        <img :src="firstFourSongs[0].imgUrl" alt="">
                    </div>
                    <h2>{{ firstFourSongs[0].artist }}</h2>
                    <span>Artist</span>
                    <PlayBtn :station="{songs : firstFourSongs}" />
                </div>
            </article>
            <article class="songs-result">
                <h3 class="songs-result-title">Songs</h3>
                <SongSearchList @setSong="setSong" :songs="firstFourSongs" />
            </article>
        </section>
        <section class="second-section">
            <h2>Suggestions</h2>
            <ul class="station-list">
                <StationPreview v-for="station in randomStations" :key="station._id" :station="station" />
            </ul>
        </section>
    </section>
</template>

<script>
import PlayBtn from '../cmps/PlayBtn.vue';
import SongSearchList from '../cmps/SongSearchList.vue';
import StationList from '../cmps/StationList.vue';
import StationPreview from '../cmps/StationPreview.vue';
import { utilService } from '../services/util.service';

export default {
    name: '',
    props: {
        firstFourSongs: {
            type: Array
        }
    },
    methods: {
        setSong(song) {
            this.$emit('setSong', song)
        },
    },
    computed: {
        randomStations() {
            const stations = this.$store.getters.stations;
            const filteredStations = stations.filter(station => !station.isAddedByUser);
            const randomIdx = utilService.getRandomIntInclusive(0, filteredStations.length - 1)
            const randomStations = stations.slice(randomIdx,randomIdx + 5)
            return randomStations
        }
    },
    components: {
    SongSearchList,
    StationList,
    StationPreview,
    PlayBtn
},
}
</script>
