/*
*	POST new contact
*/

exports.new = function(req, res) {
	contactProvider.save({
		name: req.param('name'),
		email: req.param('email')
	}, function(error, docs) {
		res.redirect('/')
	});
}