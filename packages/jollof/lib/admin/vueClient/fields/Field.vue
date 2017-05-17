<template>
	<div>
		<div class="form-group">
			<label class="control-label col-sm-12" for="email">{{name}}: <span
					class="bg-warning">{{input.error}}</span></label>
			<div class="col-sm-12">


				<TextField :name="name" :schema="schema" :input="input"  v-if="schema.meta.type==='String'"></TextField>
				<NumberField :name="name" :schema="schema" :input="input"  v-if="schema.meta.type==='Number'"></NumberField>
				<DateField :name="name" :schema="schema" :input="input"  v-if="schema.meta.type==='Date'"></DateField>
				<EmailField :name="name" :schema="schema" :input="input"  v-if="schema.meta.type==='Email'"></EmailField>
				<PhoneField :name="name" :schema="schema" :input="input"  v-if="schema.meta.type==='Phone'"></PhoneField>
				<UrlField :name="name" :schema="schema" :input="input"  v-if="schema.meta.type==='Url'"></UrlField>
				<TextAreaField :name="name" :schema="schema" :input="input"  v-if="schema.meta.type==='TextArea'"></TextAreaField>

				<!--<input type="text" :value="input.value" class="form-control" @change="input.onChange"/>-->
				<!--<a href="javascript:;" @click="input.onChange(null,'foobar')">Change to something else</a>-->

			</div>
			<br/>
		</div>
	</div>
</template>


<script>
	/**
	 * Created by iyobo on 2017-01-14.
	 */
	const _ = require('lodash');
	import Vue from 'vue';
	import NumberField from './NumberField.vue';
	import EmailField from './EmailField.vue';
	import PhoneField from './PhoneField.vue';
	import UrlField from './UrlField.vue';
	import TextField from './TextField.vue';
	import DateField from './DateField.vue';

	export default Vue.component('JollofField', {
		components: {
			TextField,
			UrlField,
			PhoneField,
			DateField,
			EmailField,
			NumberField
		},
		props: ['name', 'schema', 'input'],
		data: function () {
			console.log(this.schema);
			return {
			}
		},

		methods: {


		}
	});

</script>