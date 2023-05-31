export const modalStore = {
    state: {
        isUserOptionsShown: false,
        isStationOptionsShown: false,
        isStationEditShown: false,
        isLibraryLogErrShown: false,
        isCreatePlaylistLogErrShown: false,
        isLikedLogErrShown: false
    },
    getters: {
        isUserOptionsShown({ isUserOptionsShown }) { return isUserOptionsShown },
        isStationOptionsShown({ isStationOptionsShown }) { return isStationOptionsShown },
        isStationEditShown({ isStationEditShown }) { return isStationEditShown },
        isLibraryLogErrShown({ isLibraryLogErrShown }) { return isLibraryLogErrShown },
        isCreatePlaylistLogErrShown({ isCreatePlaylistLogErrShown }) { return isCreatePlaylistLogErrShown },
        isLikedLogErrShown({ isLikedLogErrShown }) { return isLikedLogErrShown }
    },
    mutations: {
        openUserOptions(state) {
            this.commit('closeModals')
            state.isUserOptionsShown = true
        },
        openStationOptions(state) {
            this.commit('closeModals')
            state.isStationOptionsShown = true
        },
        openStationEdit(state) {
            this.commit('closeModals')
            state.isStationEditShown = true
        },
        openLibraryLogErr(state) {
            this.commit('closeModals')
            state.isLibraryLogErrShown = true
        },
        openCreatePlaylistLogErr(state) {
            this.commit('closeModals')
            state.isCreatePlaylistLogErrShown = true
        },
        openLikedLogErr(state) {
            this.commit('closeModals')
            state.isLikedLogErrShown = true
        },
        closeModals(state) {
            state.isUserOptionsShown = false
            state.isStationOptionsShown = false
            state.isStationEditShown = false
            state.isLibraryLogErrShown = false
            state.isCreatePlaylistLogErrShown = false
            state.isLikedLogErrShown = false
        },
    },

};
