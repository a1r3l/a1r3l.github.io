console.log("2DCanvas Conected");

function twoDCanvas(){
	this.canvas = null;
	this.canvasContainer = null;
	this.context = null;
	this.onCanvas = false;
	this.mousePos = {x:null,y:null};
}

twoDCanvas.prototype.init =  function (){
	//SetUpCanvasComponents
	this.setUpCanvas();
	var that = this;
	this.mousePosUpdate();
	this.setPaintStyle(5,'round','round','blue')
	this.setListeners();
}

twoDCanvas.prototype.setUpCanvas= function(){
	this.canvasContainer = document.getElementById('editCanvas');
	var canvasStyle = getComputedStyle(this.canvasContainer);
	this.canvas = document.getElementById('2dCanvas');
	this.canvas.width = parseInt(canvasStyle.getPropertyValue('width'));
	this.canvas.height = parseInt(canvasStyle.getPropertyValue('height'));
	this.context = this.canvas.getContext("2d");
}

twoDCanvas.prototype.mousePosUpdate = function(){
	that = this;
	this.canvas.addEventListener('mousemove',function(e){
		var bbox = that.canvas.getBoundingClientRect();
		that.mousePos.x = e.clientX - bbox.left * (that.canvas.width/bbox.width); //- this.offsetLeft;
		that.mousePos.y = e.clientY - bbox.top * (that.canvas.height/bbox.height); //- this.offsetTop;
	},false);
}

twoDCanvas.prototype.setPaintStyle = function(lineWidth,lineJoin,lineCap,color){
	this.context.lineWidth = lineWidth;
	this.context.lineJoin = lineJoin;
	this.context.lineCap = lineCap;
	this.context.strokeStyle = color;
}

twoDCanvas.prototype.setListeners = function(){
	that = this;
	//this.canvas.addEventListener('mouseover',function(){
		//that.onCanvas = true;
	//});

	this.canvas.addEventListener('mousedown',function(){
		that.context.beginPath();
		that.context.moveTo(that.mousePos.x,that.mousePos.y);

		that.canvas.addEventListener('mousemove',function(){
			that.onPaint(that);	
		},false);
	},false);

	this.canvas.addEventListener('mouseup', function(){
		that.canvas.removeEventListener('mousemove',that.onPaint,false);
	},false);

	/*this.canvas.addEventListener('mouseleave',function(){
		that.canvas.removeEventListener('mousemove',that.onPaint,false);
	});*/
}

twoDCanvas.prototype.onPaint = function(canvas){
	//console.log(canvas);
	canvas.context.lineTo(canvas.mousePos.x,canvas.mousePos.y);
	canvas.context.stroke();
}