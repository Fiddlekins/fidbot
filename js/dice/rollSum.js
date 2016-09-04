'use strict';
var Roll = require('./roll.js');

var RollSum = function(inputString){
	var rollArray = [];
	var braceOpen = 0;
	var lastPlusIndex = 0;
	var splitString;
	for (var charIndex = 0; charIndex < inputString.length; charIndex++) {
		var char = inputString.charAt(charIndex);
		if (char === '{') {
			braceOpen++;
		}
		if (char === '}') {
			braceOpen--;
		}
		if (char === '+' && braceOpen === 0) {
			splitString = inputString.slice(lastPlusIndex, charIndex);
			if (splitString.charAt(0) === '{') {
				rollArray.push(new RollGroup(splitString));
			} else {
				rollArray.push(new Roll(splitString));
			}
			lastPlusIndex = charIndex + 1;
		}
	}
	splitString = inputString.slice(lastPlusIndex);
	if (splitString.charAt(0) === '{') {
		rollArray.push(new RollGroup(splitString));
	} else {
		rollArray.push(new Roll(splitString));
	}

	this._members = rollArray;
	this._sum = 0;
	this._successes = 0;
	this.error = false;
	this.errorMessage = '';
	this._isTypeSuccess = this._members[0].isTypeSuccess();

	var memberIndex, member;
	for (memberIndex = 0; memberIndex < this._members.length; memberIndex++) {
		member = this._members[memberIndex];
		if (member.error) {
			this.error = true;
			this.errorMessage = member.errorMessage;
			return;
		}
		if (member.isTypeSuccess() !== this._isTypeSuccess) {
			this.error = true;
			this.errorMessage = 'Error: mixed sum and success roll types.';
			return;
		}
	}
};

RollSum.prototype.executeDice = function(){
	for (var memberIndex = 0; memberIndex < this._members.length; memberIndex++) {
		var member = this._members[memberIndex];
		member.executeDice();
		if (this._isTypeSuccess) {
			this._successes += member.getSuccesses();
		} else {
			this._sum += member.getSum();
		}
	}
};

RollSum.prototype.isTypeSuccess = function(){
	return this._isTypeSuccess;
};

RollSum.prototype.getSum = function(){
	return this._sum;
};

RollSum.prototype.getSuccesses = function(){
	return this._successes;
};

RollSum.prototype.toString = function(){
	var outputString = '';
	for (var memberIndex = 0; memberIndex < this._members.length; memberIndex++) {
		var member = this._members[memberIndex];
		outputString += member.toString();
		if (memberIndex !== this._members.length - 1) {
			outputString += '+';
		}
	}
	return outputString;
};

var RollGroup = function(inputString){
	this.error = true;
	this.errorMessage = 'Error: grouped rolls not yet supported.';
	return;

	var rollArray = [];
	var braceOpen = 0;
	var lastCommaIndex = 1;
	var splitString;
	for (var charIndex = 1; charIndex < inputString.length; charIndex++) {
		var char = inputString.charAt(charIndex);
		if (char === '{') {
			braceOpen++;
		}
		if (char === '}') {
			braceOpen--;
			if (braceOpen < 0) {
				break;
			}
		}
		if (char === ',' && braceOpen === 0) {
			splitString = inputString.slice(lastCommaIndex, charIndex);
			rollArray.push(new RollSum(splitString));
			lastCommaIndex = charIndex + 1;
		}
	}
	splitString = inputString.slice(lastCommaIndex, charIndex);
	rollArray.push(new RollSum(splitString));

	var optionsString = inputString.slice(charIndex + 1);

	this._members = rollArray;
	this._optionsString = optionsString;

	this._sum = 0;
	this._successes = 0;
	this.error = false;
	this.errorMessage = '';
	this._isTypeSuccess = this._members[0].isTypeSuccess();

	var memberIndex, member;
	for (memberIndex = 0; memberIndex < this._members.length; memberIndex++) {
		member = this._members[memberIndex];
		if (member.error) {
			this.error = true;
			this.errorMessage = member.errorMessage;
			return;
		}
		if (member.isTypeSuccess() !== this._isTypeSuccess) {
			this.error = true;
			this.errorMessage = 'Error: mixed sum and success roll types.';
			return;
		}
	}
};

RollGroup.prototype.executeDice = function(){
	for (var memberIndex = 0; memberIndex < this._members.length; memberIndex++) {
		var member = this._members[memberIndex];
		member.executeDice();
		if (this._isTypeSuccess) {
			this._successes += member.getSuccesses();
		} else {
			this._sum += member.getSum();
		}
	}
};

RollGroup.prototype.isTypeSuccess = function(){
	return this._isTypeSuccess;
};

RollGroup.prototype.getSum = function(){
	return this._sum;
};

RollGroup.prototype.getSuccesses = function(){
	return this._successes;
};

RollGroup.prototype.toString = function(){
	var outputString = '';
	for (var memberIndex = 0; memberIndex < this._members.length; memberIndex++) {
		var member = this._members[memberIndex];
		outputString += member.toString();
		if (memberIndex !== this._members.length - 1) {
			outputString += '+';
		}
	}
	return outputString;
};

module.exports = RollSum;