/**
 * Created by iyobo on 2016-10-27.
 */


/**
 * Takes a schema. Returns a model
 * @param schema
 * @returns {*}
 */
module.exports.modelize = function ( schema ) {

	const Model = class {
		constructor(data){
			this.data = data;
		}

		static * get(id){
			return 'Got '+schema.name;
		}

		static * list(id){
			return 'List '+schema.name;
		}

		static * update(id){
			return "Hohoho";
		}

		static * updateAll(id){
			return "Hohoho";
		}

		static * delete(id){
			return "Hohoho";
		}

		validate(){
			return true;
		}

		* save (){
			if(this.validate()){
				return "Saving "+schema.name;
			}
		}



	};

	// This way when we can new jollof.models.user({firstName:'Joe'})
	return Model;
}