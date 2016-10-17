/**
 * Created by iyobo on 2016-05-25.
 */

function swap(arr,a,b){
	var temp = arr[a]
	arr[a] = arr[b]
	arr[b] = temp
}
function sort(arr){

	for(var i=1; i<arr.length; i++){
		if(arr[i]<arr[i-1]){
			for(var j=i; j>=0; j--){
				if(arr[j]<arr[j-1])
					swap(arr,j,j-1)
				else
					break;
			}
		}
	}

	return arr;
}

console.log(sort([23,42,4,16,8,15,1]));