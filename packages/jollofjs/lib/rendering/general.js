/**
 * Created by iyobo on 2016-04-24.
 *
 * For Common Nunjuck filters
 * @param nunjucksEnv
 */
module.exports = function(nunjucksEnv){
	
	nunjucksEnv.addFilter('shorten', function(str, count) {
		return str.slice(0, count || 5);
	});

	nunjucksEnv.addFilter('showError', function(str) {
		if(str){
			return '<span class="error">'+str+'</span>'
		}
		else
			return ""
	});

	nunjucksEnv.addFilter('stringify', function(obj) {
		return JSON.stringify(obj);
	});
	
}