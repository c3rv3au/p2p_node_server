var Widget = require('../classes/widget.js');

Search_box.prototype = new Widget();

//Constructor
function Search_box() {
	Widget.apply(this);
}

Search_box.prototype.show_html = function(webrequest, callback) {
	res = webrequest.res;
	
	res.write("<form action='/search'><input type='text' name='q'><input type='submit' name='b' value='Submit'></form>");
	
	return callback();
}

module.exports = Search_box;
