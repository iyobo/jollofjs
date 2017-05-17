/**
 * Created by iyobo on 2016-04-24.
 *
 * For commonly accessed Nunjucks extensions
 * @param nunjucksEnv
 */
module.exports = function(nunjucksEnv){

	//General helpers
	require('./general')(nunjucksEnv)

	//Form Fields
	require('./fields')(nunjucksEnv)

}