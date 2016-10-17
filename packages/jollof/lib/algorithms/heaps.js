/**
 * Created by iyobo on 2016-04-24.
 */
/*
 Heap's algorithm generates all possible permutations of N objects
 */

function swap(array,i1, i2){
	if(!Array.isArray(array))
	{
		console.error("Not an array"+ array)
		return;
	}
	// console.log("swapping from "+array)
	var buffer = array[i1]
	array[i1] = array[i2]
	array[i2] = buffer
	// console.log("to "+array)
}

function generateAllCombinations(n,a){
	if (n===1)
		console.log(a)
	else{
		for (var i=0; i<n-1; i++){
			generateAllCombinations(n-1,a)
			if(n%2==0){
				swap(a,1,n-1)
			}
			else
			{
				swap(a,0,n-1)
			}
		}
		generateAllCombinations(n-1,a)
	}
}

var A = ["red","yellow","green","meat"]
var N = A.length

generateAllCombinations(N,A)

module.exports = generateAllCombinations()

// function fibonacci(n){
// 	var cur= [];
// 	for(var i=0; i<n; i++){
//
// 		var sum=0;
// 		if(i==1)
// 			sum = 1;
//
// 		if(cur.length>1){
// 			var first = cur.length -1;
// 			var second = 0;
//
// 			if(cur.length >= 2)
// 				second = cur.length-2;
//
// 			sum += cur[first]+cur[second];
// 		}
// 		cur.push(sum);
// 	}
//
// 	console.log(cur);
// }