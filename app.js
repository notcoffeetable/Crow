
/**
 * Module dependencies.
 */

var express = require('express');
var ContactProvider = require('./contactprovider-mongodb.js').ContactProvider;
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var contactProvider = new ContactProvider('localhost', 27017)

// app.get('/', routes.index);
app.get('/', function(req, res){
  contactProvider.findAll(function(error,docs) {
  	res.render('index.jade', {
  		title: 'Contacts',
		contacts:docs
  	});
  })
});

app.get('/contact/new', function(req, res) {
    res.render('contact_new.jade', { title: 'New Contact' });
});


// app.post('/contact/new', routes.new);
app.post('/contact/new', function(req, res) {
	contactProvider.save({
		name: req.param('name'),
		email: req.param('email')
	}, function(error, docs) {
		res.redirect('/')
	});
});			

// app.get('/contact/:id', routes.getById);


app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
