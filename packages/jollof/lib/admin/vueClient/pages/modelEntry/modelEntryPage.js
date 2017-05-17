/**
 * Created by iyobo on 2017-01-14.
 */
import modelSpice from '../../spices/modelSpice';
import notificationSpice from '../../spices/notificationSpice';
import JollofField from '../../fields/Field.vue';
const _ = require('lodash');


export const modelEntryPage = {
	template: require('./modelEntryPage.html'),
	components: {
		// <my-component> will only be available in parent's template
		'JollofField': JollofField
	},
	data: function () {
		//activate this page's model
		modelSpice.activateModelByName(this.$route.params.name);

		let fields = {};

		//if we are to load something
		//if (this.$route.params.id) {
		//	modelSpice.fetchById();
		//} else {
		//new object
		_.each(modelSpice.active.model.fieldOrder, (fieldName) => {

			fields[fieldName] = {
				error: null,
				value: modelSpice.active.single[fieldName],
				onChange: (evt, value) => {
					let newValue = value;
					if (evt) {
						newValue = evt.target.value;
					}

					const oldValue = fields[fieldName].value;
					console.log('changing value from', oldValue, 'to', newValue);
					fields[fieldName].value = newValue;
				},
			};
		});
		//}

		return {
			pageTitle: this.$route.params.name,
			modelSpice: modelSpice,
			fields: fields
		}


	},
	created: function () {
		return this.onShowPage();
	},
	watch: {
		'$route' (to, from) {
			this.onShowPage();
		},
		'fields': {
			handler: function (val) {
				console.log('changed')
			},
			deep: true
		}
	},
	filters: {
		...require('../../filters/filters')
	},
	methods: {
		onShowPage(){

			//activate this page's model
			this.modelSpice.activateModelByName(this.$route.params.name);

			if(this.$route.params.id) {
				this.modelSpice.fetchSingle(this.$route.params.id).then((data) => {
					this.modelSpice.active.single = data;
				});
			}

			//beforeRouteEnter (to, from, next) {
			//	modelSpice.activateModelByName(to.params.name);
			//	//return modelSpice.fetchSingle(to.params.id).next(()=>{next(true)});
			//	if(to.params.id)
			//		vm.modelSpice.fetchSingle(to.params.id, to.params.name);
			//	next();
			//},

		},

		save(){
			const values = {};
			_.each(this.fields, (it, name) => {
				values[name] = it.value;
			});

			//Now save
			this.modelSpice.save(values).then((response) => {
				//redirect
				//
				//this.$router.push('modelTable')

				//if error, highlight field and wrap with error
				if (response.keyPath) {
					//TODO:
					console.log(response);
				} else {
					//success
					//Show notification and re-route
					notificationSpice.info('Successfully Created ' + this.pageTitle);
					this.$router.go(-1);
				}
			});
		}

	}
};