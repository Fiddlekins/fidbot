'use strict';

const normalChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const wideChars = 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ';

class Wide {

	static wide(message, parameters){
		message.channel.sendMessage(Wide._makeWide(parameters.join(' ')));
	}

	static _makeWide(inputString){
		if (inputString) {
			return inputString.replace(/./g, function($0){
				let normalIndex = normalChars.indexOf($0);
				if (normalIndex >= 0) {
					return wideChars[normalIndex];
				} else {
					return $0;
				}
			});
		}
		return `A wide nothing is still a nothing.`;
	}
}

module.exports = Wide;
