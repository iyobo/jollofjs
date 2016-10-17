/**
 * Copyright: Daniel Bunzendahl
 * License: MIT
 *
 * Koa Sub-Domain Constructor.
 * @param {Object} sub Subdomain can be also a FQDN or a wildcard like *.example.com
 * œparam {Object} r Can be a generator function or a Koa-router
 * @api public
 */
function Subdomain(sub, r){
	if (!(this instanceof Subdomain)){
		var instance = new Subdomain(sub, r);
		return instance;
	}

	if(!sub || !r || typeof sub !== 'string' || (typeof r !== "object" && typeof r !== "function")){
		throw new Error('Missing or wrong params! Expected first param a STRING (is '+(typeof sub)+') and second a GENERATOR-Object or a function (is '+(typeof r)+')');
	}
	/**
	 * steps to test:
	 * 1) sub === this.hostname
	 * 2) this.subdomain[0] === sub
	 * 3) typeof this.subdomain[1] === 'string' // or wildcard => sub sub domain ?
	 */
	return function *(next){
		// for the case someone enters a complete domain name
		// e.g. 'sub.example.com'
		// instead of 'sub' or '*'


		if(sub === this.hostname){
			if(typeof r.routes === "function") {
				yield r.routes();
			} else
			{
				yield r;
			};

		}

		var subdomain = this.subdomains[0] || '';
		if (subdomain === sub && sub[0] !== '*' && !this.subdomains[1]) {
			if(typeof r.routes === "function") {
				yield r.routes();
			} else
			{
				yield r;
			};
		} else if(typeof this.subdomains[1] === 'string'
			|| sub[0] === "*"){
			var subdomainsstring = "";
			var length = this.subdomains.length;
			for(var i=length; i > 0; i-- ){
				if(subdomainsstring === ""){
					subdomainsstring += this.subdomains[i-1];
				}else {
					subdomainsstring += "."+this.subdomains[i-1];
				}
			}
			// wildcard subdomain at most left in "sub" string
			var splittedSub = sub.split(".");
			if(splittedSub[0] === "*"){
				var subdomains = this.subdomains;
				var hostname = this.hostname.split(".");
				var hostnamelength = hostname.length;
				// reverse lookup arrays against each other
				for(var s=hostnamelength; s > 0; s--){
					var hostnamepop = hostname.pop();
					if(subdomains.length > 0){
						var shift = subdomains.shift();
					}
					var pop = splittedSub.pop();

					if(shift === pop || hostnamepop === pop){
						continue;
					} else {
						if(pop === "*"){
							if(typeof r.routes === "function") {
								yield r.routes();
							} else
							{
								yield r;
							};
							break;
						} else {
							yield next;
							break;
						}
					}
				}
			}

			// NOTE: app.subdomainOffset is the base!
			if(subdomainsstring === sub){
				if(typeof r.routes === "function") {
					yield r.routes();
				} else
				{
					yield r;
				};
			} else {
				yield next;
			}
		}
		else{
			yield next;
		}
	};


}

module.exports = Subdomain;