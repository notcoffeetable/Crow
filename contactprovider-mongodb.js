var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ContactProvider = function(host, port) {
	this.db = new Db('node-mongo-crow', new Server(host, port, {auto_reconnect: true}, {}), {safe:false});
	this.db.open(function(){});
};

ContactProvider.prototype.getCollection = function(callback) {
	this.db.collection('contacts', function(error, contact_collection) {
		if(error) callback(error)
		else callback(null, contact_collection);
	});
};

ContactProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error, contact_collection) {
		if(error) callback(error);
		else {
			contact_collection.find().toArray(function(error, results) {
				if(error) callback(error)
				else callback(null, results)
				});
		}
	});
}

ContactProvider.prototype.findById = function(id, callback) {
	this.getCollection(function(error, contact_collection) {
		if(error) callback(error)
		else {
			contact_collection.findOne({_id: contact_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
				if(error) callback(error)
		  		else callback(null, result)
		  	});
		}
	});
}

ContactProvider.prototype.save = function(contacts, callback) {
	this.getCollection(function(error, contact_collection) {
		if(error) callback(error)
		else {
			if(typeof(contacts.length) == "undefined")
				contacts = [contacts];

			for(var i = 0; i < contacts.length; i++) {
				contact = contacts[i];
				contact.created_at = new Date();

				contact_collection.insert(contacts, function() {
					callback(null, contacts);
				});
			}
		}
	});
}

exports.ContactProvider = ContactProvider;