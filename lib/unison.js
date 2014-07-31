var unison;

(function() {
	var browser = (typeof window !== 'undefined' && typeof document !== 'undefined') ? true : false;
	var nodejs = !browser;
	var _global = (browser ? window : global || {});

	function _extend(obj, members) {
		for(var nam in members) { obj[nam] = members[nam]; };
	};
	function _emptyFn() {};

	function _createCallback(instance, field) {
		return function(err, val) {
			if(err) { instance.error(err); }
			else if(instance.$$isCheckAndGo) { instance.check(field); }
			else if(instance.$$isFillAndGo) { instance.set(field, val); }
			else { throw("I don't know how to handle this."); };
		};
	};

	function _scanChecked(users, checked, errors, errorMessages) {
		for(var ii = 0, il = users.length; ii < il; ii++) {
			if(!checked[users[ii]]) { return false; };
		};
		return true;
	};
	function _scanErrors(users, errors) {
		for(var ii = 0, il = users.length; ii < il; ii++) {
			if(errors[users[ii]]) { return true; };
		};
		return false;
	};

	function _check(id, users, checked, errors, errorMessages) {
		checked[id] = true;
		return _scanChecked(users, checked);
	};

	function _set(field, value, fields, checked, values, errors, errorMessages) {
		values[field] = value;
		return _check(field, fields, checked);
	};

	function _setError(id, message, errors, errorMessages) {
		errorMessages[id] = message;
		errors[id] = true;
	};

	unison = {
			CheckAndGo: function CheckAndGo__Constructor(options, callback) {
				var me = this;
				var fields = options.fields || [];
				var checked = {};
				var errors = {};
				var errorMessages = {};

				callback = callback || options.callback || _emptyFn;

				_extend(me, {
						$$isCheckAndGo: true	
					,	check: function(id) {
							if(_check(id, fields, checked, errors, errorMessages)) {
								me.onFilled();
							};
							return me;
						}
					,	createCallback: function(field) { return _createCallback(me, field); }
					,	error: function(id, message) { _setError(id, message, errors, errorMessages); }
					,	onError: function(err) { callback(err, null); }
					,	onFilled: function() {
							if(_scanErrors(fields, errors)) {
								me.onError();
							}
							else { callback(null, me); };
						}
				});
			
				return me;
			}
		,	FillAndGo: function FillAndGo_Constructor(options, callback) {
				var me = this;
				var fields = options.fields || [];
				var checked = {};
				var values = [];
				var errors = {};
				var errorMessages = {};

				callback = callback || options.callback || _emptyFn;

				_extend(me, {
						$$isFillAndGo: true	
					,	set: function(field, value) {
							if(_set(field, value, fields, checked, value, errors, errorMessages)) {
								me.onFilled();
							};
							return me;
						}
					,	createCallback: function(field) { return _createCallback(me, field); }
					,	error: function(field, message) { _setError(field, message, errors, errorMessages); }
					,	onError: function(err) { callback(err, null); }
					,	onFilled: function() {
							if(_scanErrors(fields, errors)) {
								me.onError();
							}
							else { callback(null, me); };
						}
				});
			
				Object.defineProperty(me, 'data', {
						get: function() { return values; }
				});

				return me;
			}
	};


	if(nodejs) { module.exports = unison; };



}());
