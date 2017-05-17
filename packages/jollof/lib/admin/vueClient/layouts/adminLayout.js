/**
 * Created by iyobo on 2017-01-14.
 */
const axios = require('axios');
import modelSpice from '../spices/modelSpice';


export const adminLayout = {
	template: require('./adminLayout.html'),
	data() {
		return {
			pageTitle: this.$route.params.name || 'Dashboard',
			modelSpice: modelSpice,
		}
	},
	created() {
		// fetch the data when the view is created and the data is
		// already being observed
		//return this.modelSpice.fetchModels()
	},
	watch: {
		'$route' (to, from) {

			// react to route changes...
			this.pageTitle = this.$route.params.name || 'Dashboard';
		}
	},
	methods: {
		fetchModels: function () {
			return this.modelSpice.fetchModels().then(function(response){
				return this.modelSpice.activateModelByName(this.$route.params.name);
			})
		}
	}
};