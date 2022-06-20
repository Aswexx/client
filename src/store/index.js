import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const actions = {

};

const mutations = {
	CHANGEVIEWPORT(state,value) {
		state.viewport = value
	}
};

const state = {
	viewport: window.innerWidth,
	isAuthenticated: true,
	userRole: 'normal'
};

export default new Vuex.Store({
	actions,
	mutations,
	state
})