<template>
	<div>
		<input type="email" :value="input.value" class="form-control" @change="input.onChange"/>
	</div>
</template>

<script>
	/**
	 * Created by iyobo on 2017-01-14.
	 */
	const _ = require('lodash');
	import Vue from 'vue';


	export default Vue.component('EmailField', {
		components: {},
		props: ['name', 'schema', 'input'],
		data: function () {
			return {}
		},

		methods: {}
	});
</script>