/**
 * Created by iyobo on 2016-09-18.
 */
const data = require('../../index').data;
const types = data.types;

//Models use names
const schema = {
	name: 'Testy',
	structure: {
		aString: String,
		aNumber: Number,
		reqString: {
			type: String, required: true
		},
		reqNumber: {
			type: Number, required: true, range: '1-10', errors: {
				range: 'This must be between 1 and 10 tho'
			}
		},
		reqBoolean: { type: Boolean, required: true },
		powers: { type: String, enum: ['Invisibility', 'Super Strength'] },
		stringArray: [String],
		anObj: {
			aNumber: Number,
			aString: { type: String }
		},
		objArray: [{
			itemString: String,
			itemBool: { type: Boolean },
			itemNumber: Number,
		}],
		email: types.Email(),
		location: types.Location(),
		geoSpots: [types.Location({required:true})],

	}

};


module.exports = data.registerModel(schema);