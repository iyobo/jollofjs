'use strict'

function Car(){

	this.honk = function(){
		console.log("Pam Pam")
	};

	this._ignite = function(){
		console.log("We on fire!")
	}

	this.fuel = function(){
		console.log("Give me fuel")
	}
}

function Tesla(){
	Car.call(this)

	this.fuel = function(){
		console.log("Give me Electricity")
	}
}

var Subaru = new Car.prototype

new Tesla()._ignite()
new Subaru.fuel();