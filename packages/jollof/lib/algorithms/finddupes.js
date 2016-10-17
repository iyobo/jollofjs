'use strict'
var list = [1, 0, 99, 9, 2, 1];

function swap(arr, x, y) {
	var buf = arr[x];
	arr[x] = arr[y];
	arr[y] = buf;

}

/**
 * Sorts
 * - Bubble
 * - Insertion
 * - Quick
 */

function insertionsort(arr){


}
var cmp = (n1, n2) => n1 - n2;

function bubbleSort(arr){
	var len = arr.length;
	for (var i = len-1; i>=0; i--){
		for(var j = 1; j<=i; j++){
			if(arr[j-1]>arr[j]){
				var temp = arr[j-1];
				arr[j-1] = arr[j];
				arr[j] = temp;
			}
		}
	}
	return arr;
}

function selectionSort(arr){
	var minIdx, temp,
		len = arr.length;
	for(var i = 0; i < len; i++){
		minIdx = i;
		for(var  j = i+1; j<len; j++){
			if(arr[j]<arr[minIdx]){
				minIdx = j;
			}
		}
		temp = arr[i];
		arr[i] = arr[minIdx];
		arr[minIdx] = temp;
	}
	return arr;
}

function insertionSort(arr){
	var i, len = arr.length, el, j;

	for(i = 1; i<len; i++){
		el = arr[i];
		j = i;

		while(j>0 && arr[j-1]>toInsert){
			arr[j] = arr[j-1];
			j--;
		}

		arr[j] = el;
	}

	return arr;
}

function merge(left, right){
	var result = [],
		lLen = left.length,
		rLen = right.length,
		l = 0,
		r = 0;
	while(l < lLen && r < rLen){
		if(left[l] < right[r]){
			result.push(left[l++]);
		}
		else{
			result.push(right[r++]);
		}
	}
	//remaining part needs to be addred to the result
	return result.concat(left.slice(l)).concat(right.slice(r));
}
function mergeSort(arr){
	var len = arr.length;
	if(len <2)
		return arr;
	var mid = Math.floor(len/2),
		left = arr.slice(0,mid),
		right =arr.slice(mid);
	//send left and right to the mergeSort to broke it down into pieces
	//then merge those
	return merge(mergeSort(left),mergeSort(right));
}


console.log(bubbleSort(list))