/**
 * Created by iyobo on 2016-12-27.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import {dashboardPage} from './pages/dashboard/dashboardPage';
import {modelTablePage} from './pages/modelTable/modelTablePage';
import {adminLayout} from './layouts/adminLayout';
import {modelEntryPage} from './pages/modelEntry/modelEntryPage';
const axios = require('axios');
import modelSpice from './spices/modelSpice';

const boss='Iyobo';

Vue.use(VueRouter);
Vue.use(Vuex)

//Routing
const routes = [
	{
		path: '/', component: adminLayout,
		children: [
			{ path: '', redirect: { name: 'dashboard' }  },

			{ path: 'dashboard', component: dashboardPage, name: 'dashboard' },
			{ path: 'model', redirect: { name: 'dashboard' } },
			{ path: 'model/:name', component: modelTablePage, name: 'modelTable' },
			{ path: 'model/:name/create', component: modelEntryPage, name: 'modelCreate' },
			{ path: 'model/:name/:id', component: modelEntryPage, name: 'modelEdit' }
		]
	}
]

const router = new VueRouter({
	routes,
	linkActiveClass: 'active'
})


//State
const store = new Vuex.Store({
	state: {
		count: 0
	},
	mutations: {
		increment (state) {
			state.count++
		}
	}
});

modelSpice.fetchModels().then(function(){
	const app = new Vue({
		router
	}).$mount('#app');

	require('../../../jollofstatic/lightdash/assets/js/light-bootstrap-dashboard.js');
});






