console.log("Main Conected");
var canvas = null;

var CANVAS = {
	init: function(){
		canvas = new Canvas();
		edition = new Edition();
		canvas.init();	
		edition.init();

	}
}

// var twoDCANVAS = {
// 	init: function(){
// 		var canvas = new twoDCanvas();
// 		canvas.init();
// 	}
// }
//twoDCANVAS.init();

CANVAS.init();