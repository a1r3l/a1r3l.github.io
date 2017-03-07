console.log("2DCanvas Conected");

function twoDCanvas(name){
	this.name = name;
	this.canvas = null;
	this.canvasContainer = null;
	this.context = null;
	this.onCanvas = false;
	this.mousePos = {x:null,y:null};
	//SPRAY VARIABLES
	this.paint = false;
	this.density = null;
}

twoDCanvas.prototype.init =  function (){
	//SetUpCanvasComponents
	this.setUpCanvas();
	this.mousePosUpdate();
	this.setPaintStyle(2,'round','round','blue',50);
	this.setListeners();
}

twoDCanvas.prototype.setUpCanvas= function(){
	this.canvasContainer = document.getElementById('editCanvas');
	var canvasStyle = getComputedStyle(this.canvasContainer);
	this.canvas = document.createElement('canvas');
	this.canvas.id = this.name;
	this.canvas.width = parseInt(canvasStyle.getPropertyValue('width'));
	this.canvas.height = parseInt(canvasStyle.getPropertyValue('height'));
	this.canvasContainer.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");
}

twoDCanvas.prototype.mousePosUpdate = function(){
	var that = this;
	this.canvas.addEventListener('mousemove',function(e){
		var bbox = that.canvas.getBoundingClientRect();
		that.mousePos.x = e.clientX - bbox.left * (that.canvas.width/bbox.width); //- this.offsetLeft;
		that.mousePos.y = e.clientY - bbox.top * (that.canvas.height/bbox.height); //- this.offsetTop;
	},false);
}

twoDCanvas.prototype.setPaintStyle = function(radius,lineJoin,lineCap,color,density){
	this.context.lineWidth = radius;
	this.context.lineJoin = lineJoin;
	this.context.lineCap = lineCap;
	this.context.fillStyle = color;
	this.density = density;
}

twoDCanvas.prototype.setListeners = function(){
	var that = this;
	this.canvas.addEventListener('mousedown',function(){
		that.paint = true;
		//CanvasTexture.needsUpdate = true;
		that.draw(that);
		that.updateTexture();
	});

	this.canvas.addEventListener('mouseup', function(){
		that.paint = false;
		//CanvasTexture.needsUpdate = true;
		that.updateTexture();
		that.canvas.removeEventListener('mousemove',that.draw,false);
	},false);

	this.canvas.addEventListener('mouseleave',function(){
		that.paint = false;
	});
	this.canvas.addEventListener('mousemove',function(){
		//CanvasTexture.needsUpdate = true;
		that.updateTexture();
		that.draw(that);
	});
}

twoDCanvas.prototype.getRandomFloat = function(min,max) {
  		return Math.random() * (max - min) + min;
};

twoDCanvas.prototype.draw = function(canvas) {
	console.log("x:" + this.mousePos.x + " y:" + this.mousePos.y);
	if(canvas.paint){
		for (var i = canvas.density; i--; ) {
		var angle = canvas.getRandomFloat(0, Math.PI*2);
		var radius = canvas.getRandomFloat(0, canvas.context.lineWidth);
			canvas.context.fillRect(
	    	canvas.mousePos.x + radius * Math.cos(angle),
	        canvas.mousePos.y + radius * Math.sin(angle), 
	        1, 1);
	    }
	    canvas.updateTexture();	
	}
};

twoDCanvas.prototype.updateTexture = function(){
	if(this.name == "twodCanvasone"){
		planesTextures[0].needsUpdate = true;
	}

	else if(this.name == "twodCanvastwo"){
		planesTextures[1].needsUpdate = true;
	}
}
