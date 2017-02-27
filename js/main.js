console.log("Main Conected");

var CANVAS = {
	init: function(){
		var canvas = new Canvas();
		canvas.init();	
	}
}

var twoDCANVAS = {
	init: function(){
		var canvas = new twoDCanvas();
		canvas.init();
	}
}

twoDCANVAS.init();
CANVAS.init();