// A widget is shown on a page of a website
function Widget() {
   this.on_all_page = false;
}

Widget.prototype.load_from_db = function(datas) {
	this.config = datas;
}

Widget.prototype.show_html = function() {
}

// export the class
module.exports = Widget;