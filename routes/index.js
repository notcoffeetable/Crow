
/*
 * GET home page.
 */

exports.index = function(req, res){
  contactProvider.findAll(function(error,docs) {
  	res.render('index.jade', {
  		locals: {
  			title: 'Contacts',
  			contacts:docs
  		}
  	});
  })
};