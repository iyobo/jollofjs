/**
 * Created by iyobo on 2016-05-25.
 */

function swap(arr,a,b){
	var temp = arr[a]
	arr[a] = arr[b]
	arr[b] = temp
}
function sort(arr){

	var n = arr.length
	var walli=0
	var pivoti = n-1

	for(var i=0; i< n; i++){
		if(arr[i] < arr[pivoti]){

		}
	}

	return arr;
}

console.log(sort([23,42,4,16,8,15,42]));