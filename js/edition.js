var Edition = function(){}

Edition.prototype.init = function() {
	this.changeVal();
	this.changeColor();
	this.clickArrow();
	this.clickZoom();
};

Edition.prototype.changeVal = function(){
	var line = document.querySelector('.line');
	document.querySelector('#range').onchange = function(){
		line.style.width = this.value * 5 + "px";
		line.style.height = this.value * 5 + "px";
		var scene = canvas.changeBrushSize(this.value);
		//console.log(line.clientWidth + " " + this.value);
	};
};

Edition.prototype.changeColor = function(){
	var color = document.querySelectorAll('.color');
	var line = document.querySelector('.line');
	color.forEach(event);
	function event(item){
		item.onclick = function(e){
			line.style.backgroundColor = item.getAttribute('name');
			canvas.changeBrushColor(item.getAttribute('name'));
		}
	}
}
Edition.prototype.clickArrow = function(){
	var interval = null;
	var arrows = document.querySelectorAll('.arrow');
	arrows.forEach(event);
	function event(item){
		item.onmousedown = function(){
			type = this.className.split(" ")[1];
			interval = setInterval(function(){
				canvas.moveCamera(type);
			}, 10); 
		}
		item.onmouseup = function(){
			clearInterval(interval);
		}
	}
}

Edition.prototype.clickZoom = function(){
	var interval = null;
	var zooms = document.querySelectorAll('.zoombut');
	zooms.forEach(event);
	function event(item){
		item.onmousedown = function(){
			type = this.className.split(" ")[1];
			interval = setInterval(function(){
				canvas.moveCamera(type);
			}, 10); 
		}
		item.onmouseup = function(){
			clearInterval(interval);
		}
	}
}