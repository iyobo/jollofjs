/**
 * Created by iyobo on 2016-07-21.
 */
function * fen (){
	var val = yield Promise.resolve('Me')
	console.log("fenning",val)
}

yield fen();