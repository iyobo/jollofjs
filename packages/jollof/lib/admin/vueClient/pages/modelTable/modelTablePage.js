/**
 * Created by iyobo on 2017-01-14.
 */
import modelSpice from '../../spices/modelSpice';
const _ = require('lodash');



export const modelTablePage = {
	template: require('./modelTablePage.html'),
	data: function () {
		return {
			pageTitle: this.$route.params.name,
			modelSpice: modelSpice,
			filterOptions: [
				'$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$regex'
			],

		}
	},
	created: function () {
		return this.onShowPage();
	},
	watch: {
		'$route' (to, from) {
			this.onShowPage();
		}
	},
	filters: {
		...require('../../filters/filters')
	},
	methods: {
		onShowPage(){

			//activate this page's model
			this.modelSpice.activateModelByName(this.$route.params.name);

			//pull from API with correct info
			this.fetchList();
		},

		fetchList(){
			this.modelSpice.fetchList(this.modelSpice.query);
		},

		edit(id){
			this.modelSpice.fetchSingle(id).then(()=>{
				this.$router.push({ name: 'modelEdit', params: { name: this.modelSpice.active.model.name , id:id}});
			});
		},

		sort(fieldName){

			this.modelSpice.sort(fieldName);
			this.fetchList();
		},

		addEmptyFilter: function () {
			this.modelSpice.addEmptyFilter();
		},

		removeFilter(index){
			this.modelSpice.removeFilter(index)
			this.fetchList();
		},

		incrementPage(){
			this.modelSpice.incrementPage();
			this.fetchList();
		},

		decrementPage(){

			this.modelSpice.decrementPage();
			this.fetchList();
		},

		createItem(){
			this.modelSpice.active.single = {};
			this.$router.push({ name: 'modelCreate', params: { userId: 123 }});

		},

		deleteItem(item){
			this.modelSpice.deleteItem(item);
			this.fetchList();
		}
	}
};