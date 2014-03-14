
var Datastore = require('nedb');
var events = require('events');

function Store(){
	 this.db = new Datastore({ filename: 'db', autoload: true });
}

Store.prototype = new events.EventEmitter;

Store.prototype.add = function(doc, cb){
	var self = this;
	self.db.insert(doc, function(err, newDoc) {   // Callback is optional
		self.emit('add', newDoc);
		if(!cb)
			return
		cb(newDoc);
	});
}

Store.prototype.forEach = function(cb){
	var self = this;
	self.db.find({}, function(err, docs) {
		if(!cb)
			return
		
		docs.forEach(cb);
	});
}

Store.prototype.clear = function(cb){
	var self = this;
	self.db.remove({}, { multi: true }, function(err, numRemoved) {
		if(!cb)
			return
		cb(numRemoved);
	});
}

module.exports = Store;
