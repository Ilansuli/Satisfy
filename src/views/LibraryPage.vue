<template>
    <section class="library">
        <h1>Playlists</h1>
        <ul class="station-list library-list">
            <article @click="$router.push('/liked')" class="liked-songs">
                <h1 class="liked-songs-title">
                    Liked Songs
                </h1>
                <h3 class="liked-songs-amount">
                    {{ loggedinUser.likedSongs.length }}
                    liked songs
                </h3>
                <PlayBtn :station="{_id:'likedSongs'}" />
            </article>
            <StationPreview v-if="stations" v-for="station in stations" :key="station._id" :station="station" />
        </ul>
    </section>
</template>

<script>
import StationPreview from '../cmps/StationPreview.vue';
import { stationService } from '../services/station.service';

import PlayBtn from '../cmps/PlayBtn.vue';
export default {
    name: '',
    data() {
        return {
            stations: null
        }
    },
    computed: {
        userStations() {
            if (this.stations) {
                return this.stations.filter(station => station.isAddedByUser)
            }
        },
        loggedinUser() {
            return this.$store.getters.loggedinUser
        }
    },
    async created() {
        try {
            this.stations = await stationService.getUserStations(this.loggedinUser._id)
        } catch (err) {
            console.log('Failed to get loggedinUser stations')
        }
    },
    components: {
        StationPreview,
        PlayBtn
    },
}
</script>

<style></style>