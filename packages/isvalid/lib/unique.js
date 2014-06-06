var objectEquals = function(obj1, obj2) {
	
	if (!arrayEquals(Object.keys(obj1).sort(), Object.keys(obj2).sort())) return false;
	
	for (var key in obj1) {
		if (!equals(obj1[key], obj2[key])) return false;
	}
	
	return true;
	
};

var arrayEquals = function(obj1, obj2) {
		
	if (obj1.length != obj2.length) return false;
	
	for (var idx = 0 ; idx < obj1.length ; idx ++) {
		if (!equals(obj1[idx], obj2[idx])) return false;
	}
			
	return true;
	
};

var equals = function(obj1, obj2) {
	
	if ((obj1 && !obj2) || (!obj1 && obj2)) return false;
	if (obj1.constructor.name != obj2.constructor.name) return false;
	
	if ('Object' == obj1.constructor.name) return objectEquals(obj1, obj2);
	if ('Array' == obj1.constructor.name) return arrayEquals(obj1, obj2);
		
	return (obj1 == obj2);
		
};

module.exports.equals = equals;
