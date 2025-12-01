import { createStore } from 'vuex';
import api from '../api';

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
    LOGOUT(state) {
      state.user = null;
      state.isAuthenticated = false;
      api.removeAccessToken();
    },
  },
  actions: {
    async login({ commit }, credentials) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');

      try {
        const token = await api.login(credentials);
        api.putAccessToken(token);

        const user = await api.getProfile();

        commit('SET_USER', user);

        return { success: true };
      } catch (error) {
        commit('SET_ERROR', error.message);
        return { success: false, error: error.message };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async register({ commit }, userData) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');

      try {
        const user = await api.register(userData);
        return { success: true, user };
      } catch (error) {
        commit('SET_ERROR', error.message);
        return { success: false, error: error.message };
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async checkAuth({ commit }) {
      const token = api.getAccessToken();
      if (!token) return false;

      commit('SET_LOADING', true);

      try {
        const user = await api.getProfile();
        commit('SET_USER', user);
        return true;
      } catch (error) {
        commit('LOGOUT');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    logout({ commit }) {
      commit('LOGOUT');
    },
  },
  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => state.isAuthenticated,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
  },
});
