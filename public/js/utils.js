/**
 * Created by billtt on 11/16/2017.
 */

String.prototype.shuffle = function () {
	var a = this.split(""),
		n = a.length;

	for(var i = n - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	return a.join("");
};

function simpleEncrypt(str) {
	var chars = str.split('');
	var k = Math.ceil(Math.random() * 2);
	for (var i=0; i<chars.length; i++) {
		if ((i + k) % 2) {
			chars[i] = String.fromCharCode(str.charCodeAt(i) + 2);
		}
	}
	return chars.join('');
}
