import { stationService } from '../services/station.service';

export function getActionRemoveStation(stationId) {
  return {
    type: 'removeStation',
    stationId,
  };
}
export function getActionAddStation(station) {
  return {
    type: 'addStation',
    station,
  };
}
export function getActionUpdateStation(station) {
  return {
    type: 'updateStation',
    station,
  };
}
export function getActionAddStationMsg(stationId) {
  return {
    type: 'addStationMsg',
    stationId,
    txt: 'Stam txt',
  };
}

export const stationStore = {
  state: {
    stations: [],
    currColor: 'black',
    opacity: 1,

    isFilterShown: false,
    currentRoute: '',
    filterBy: {
      labels: '',
      sort: 'name',
    },
    labels: stationService.getLabels(),
  },
  getters: {
    currColor: (state) => {
      return state.currColor;
    },
    opacity: (state) => {
      return state.opacity;
    },
    stations({ stations }) {
      return stations;
    },
    isFilterShown({ isFilterShown }) {
      return isFilterShown;
    },
    labels({ labels }) {
      return labels;
    },
  },
  mutations: {
    SET_OPACITY(state, opacity) {
      state.opacity = opacity;
    },
    SET_CURR_COLOR(state, color) {
      state.currColor = color;
    },
    setFilterBy(state, { filterBy }) {
      state.filterBy = filterBy;
    },
    toggleFilterShown(state, isFilterShown) {
      state.isFilterShown = isFilterShown;
    },
    setStations(state, { stations }) {
      state.stations = stations;
    },
    addStation(state, { station }) {
      state.stations.push(station);
    },
    updateStation(state, { station }) {
      const idx = state.stations.findIndex((c) => c._id === station._id);
      state.stations.splice(idx, 1, station);
    },
    removeStation(state, { stationId }) {
      const idx = state.stations.findIndex((station) => station._id === stationId);
      state.stations.splice(idx, 1);
    },
    addStationMsg(state, { stationId, msg }) {
      const station = state.stations.find((station) => station._id === stationId);
      if (!station.msgs) station.msgs = [];
      station.msgs.push(msg);
    },
  },
  actions: {
    setOpacity(context, opacity) {
      context.commit('SET_OPACITY', opacity);
    },
    setCurrColor({ commit }, color) {
      commit('SET_CURR_COLOR', color);
    },

    async addStation(context, { newStation }) {
      try {
        newStation = await stationService.save(newStation);
        context.commit(getActionAddStation(newStation));
        return newStation;
      } catch (err) {
        console.log('stationStore: Error in addStation', err);
        throw err;
      }
    },
    async updateStation(context, { station }) {
      try {
        station = await stationService.save(station);
        context.commit(getActionUpdateStation(station));
        context.dispatch({type:'setUserStations'})
        console.log('station from updateStation:', station);
        return station;
      } catch (err) {
        console.log('stationStore: Error in updateStation', err);
        throw err;
      }
    },
    async loadStations(context, { filterBy }) {
      try {
        const stations = await stationService.query(filterBy);
        context.commit({ type: 'setStations', stations });
      } catch (err) {
        console.log('stationStore: Error in loadStations', err);
        throw err;
      }
    },
    async removeStation(context, { stationId }) {
      try {
        await stationService.remove(stationId);
        context.commit(getActionRemoveStation(stationId));
        context.dispatch({type:'setUserStations'})
      } catch (err) {
        console.log('stationStore: Error in removeStation', err);
        throw err;
      }
    },
    async addStationMsg(context, { stationId, txt }) {
      try {
        const msg = await stationService.addStationMsg(stationId, txt);
        context.commit({ type: 'addStationMsg', stationId, msg });
      } catch (err) {
        console.log('stationStore: Error in addStationMsg', err);
        throw err;
      }
    },
  },
};
