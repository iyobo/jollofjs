var input = [5,1,7,4,9,2,3,4,4,9,2]

function quicksort(a) {
	var stack = [[0, a.length]];
	while (1) {
		var stackLength = stack.length;
		if (! stackLength) {
			break;
		}
		var l = stack[stackLength - 1][0],
			r = stack[stackLength - 1][1];
		if (l >= r - 1) {
			stack.pop();
			continue;
		}
		var p = r - 1;
		var y = l;
		var tmp;
		for (var i = l; i < r - 1; i++)
			if (a[i] < a[p])
			{
				tmp = a[i];
				a[i] = a[y];
				a[y] = tmp;
				y++;
			}
		tmp = a[y];
		a[y] = a[r - 1];
		a[r - 1] = tmp;
		stack.pop();
		stack.push([y + 1, r]);
		stack.push([l, y]);
	}
	return a;
}


console.log(quicksort(input, 0, input.length-1))