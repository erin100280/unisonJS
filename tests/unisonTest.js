var unison = require(require('path').join(__dirname, '../index.js'));
var console = require('console');

var checkAndGo = new unison.CheckAndGo({
		users: ['user01', 'user02']
	,	callback: function(err) {
			console.log(err || '<DONE>');
		}
});

setTimeout(function() {
	console.log('checking user01');
	checkAndGo.check('user01')
}, 4000);
setTimeout(function() {
	console.log('checking user02');
	checkAndGo.check('user02')
}, 2000);
