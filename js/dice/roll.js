'use strict';

const NumberRange = require('./numberRange.js');

const _fateMapping = {
	'-1': '-',
	'0': '0',
	'1': '+'
};

class Roll {
	constructor(inputString, options){
		this._options = options;

		this.error = false; // Set a flag to indicate the input is invalid
		this.errorMessage = '';

		var matchParams = /([0-9]+)d([0-9F]+)(.*)/.exec(inputString);
		if (matchParams === null) {
			this.error = true;
			this.errorMessage = 'Error: invalid roll command.';
			return;
		}
		this._diceCount = parseInt(matchParams[1], 10);
		if (this._diceCount > this._options.maxCount) {
			this.error = true;
			this.errorMessage = 'Error: max number of dice exceeded.';
			return;
		}
		this._isFateDice = matchParams[2] === 'F';
		this._diceSize = this._isFateDice ? 3 : parseInt(matchParams[2], 10);

		this._isTypeSuccess = false;
		this._cs = new NumberRange();
		this._cf = new NumberRange();
		this._cs.setGreaterThan(this._diceSize);
		this._cf.setLessThan(1);

		this._parseMods(matchParams[3]);

		this._results = [];
		this._sum = 0;
		this._successes = 0;
	}

	_parseMods(modString){
		if (modString !== '') {
			var modRegex = /((?:f|![!p]?|[kd][hl]?|ro?|s[ad]|c[sf])?)([<=>]?)([0-9]*)/g;
			var matchMod;
			while ((matchMod = modRegex.exec(modString)) !== null && matchMod[0] !== '') {
				matchMod[2] = matchMod[2] || '=';
				matchMod[3] = parseInt(matchMod[3], 10);
				switch (matchMod[1]) {
					case '':
					case 's':
						if (!isNaN(matchMod[3])) {
							this._initialiseSuccessRange();
							switch (matchMod[2]) {
								case '>':
									this._s.addGreaterThan(matchMod[3]);
									break;
								case '<':
									this._s.addLessThan(matchMod[3]);
									break;
								case '=':
									this._s.addSpecificEquality(matchMod[3]);
									break;
							}
						}
						break;
					case 'f':
						if (!isNaN(matchMod[3])) {
							this._initialiseSuccessRange();
							switch (matchMod[2]) {
								case '>':
									this._f.addGreaterThan(matchMod[3]);
									break;
								case '<':
									this._f.addLessThan(matchMod[3]);
									break;
								case '=':
									this._f.addSpecificEquality(matchMod[3]);
									break;
							}
						}
						break;
					case 'cs':
						if (!isNaN(matchMod[3])) {
							this._initialiseSuccessRange();
							switch (matchMod[2]) {
								case '>':
									this._cs.addGreaterThan(matchMod[3]);
									break;
								case '<':
									this._cs.addLessThan(matchMod[3]);
									break;
								case '=':
									this._cs.addSpecificEquality(matchMod[3]);
									break;
							}
						}
						break;
					case 'cf':
						if (!isNaN(matchMod[3])) {
							this._initialiseSuccessRange();
							switch (matchMod[2]) {
								case '>':
									this._cf.addGreaterThan(matchMod[3]);
									break;
								case '<':
									this._cf.addLessThan(matchMod[3]);
									break;
								case '=':
									this._cf.addSpecificEquality(matchMod[3]);
									break;
							}
						}
						break;
					case '!':
						break;
					case '!!':
						break;
					case '!p':
						break;
					case 'k':
						break;
					case 'kh':
						break;
					case 'kl':
						break;
					case 'd':
						break;
					case 'dh':
						break;
					case 'dl':
						break;
					case 'r':
						break;
					case 'ro':
						break;
					case 'sa':
						break;
					case 'sd':
						break;
				}
			}
		}
	}

	_sumResults(){
		var sum = 0;
		for (var resultIndex = 0; resultIndex < this._results.length; resultIndex++) {
			sum += this._results[resultIndex];
		}
		this._sum = sum;
	}

	_tallyResults(){
		var successes = 0;
		for (var resultIndex = 0; resultIndex < this._results.length; resultIndex++) {
			var result = this._results[resultIndex];
			if (this._s.isInRange(result)) {
				successes++;
			}
			if (this._f.isInRange(result)) {
				successes--;
			}
		}
		this._successes = successes;
	}

	_getRandomDieResult(){
		return 1 + Math.floor(Math.random() * this._diceSize);
	}

	_initialiseSuccessRange(){
		if (!this._isTypeSuccess) {
			this._isTypeSuccess = true;
			this._s = this._s || new NumberRange();
			this._f = this._f || new NumberRange();
		}
	}

	static _formatCritSuccess(value){
		return '**' + value + '**';
	}

	static _formatCritFail(value){
		return '__' + value + '__';
	}

	static _formatDropped(value){
		return '~~' + value + '~~';
	}

	_formatResult(result){
		if (this._cs.isInRange(result)) {
			result = Roll._formatCritSuccess(result);
		}
		if (this._cf.isInRange(result)) {
			result = Roll._formatCritFail(result);
		}
		return result;
	}

	executeDice(){
		for (var rollCount = this._diceCount; rollCount > 0; rollCount--) {
			var result = this._getRandomDieResult();
			if (this._isFateDice) {
				result -= 2;
			}
			this._results.push(result);
		}
		if (this._isTypeSuccess) {
			this._tallyResults();
		} else {
			this._sumResults();
		}
	}

	isTypeSuccess(){
		return this._isTypeSuccess;
	}

	getSum(){
		return this._sum;
	}

	getSuccesses(){
		return this._successes;
	}

	toString(){
		var outputString = '(';
		for (var resultIndex = 0; resultIndex < this._results.length; resultIndex++) {
			var result = this._results[resultIndex];
			if (this._isFateDice) {
				result = _fateMapping[result];
			} else {
				result = this._formatResult(result);
			}
			outputString += result;
			if (resultIndex !== this._results.length - 1) {
				outputString += this._isFateDice ? ' ' : '+';
			}
		}
		outputString += ')';
		return outputString;
	}
}

module.exports = Roll;