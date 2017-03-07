console.log("Wall Conected!");

CanvasTexture = null;

function Wall(id,scene,x,y,z){
	this.scene = null;
	this.texture = null;
	this.drawablePlane = null;
	this.twoDcanvas = null;
	this.init(id,scene,x,y,z);
}

Wall.prototype.init = function(id,scene,x,y,z) {
	this.scene = scene;
	this.twoDcanvas = new twoDCanvas("twodCanvas"+id);
	this.twoDcanvas.init();
	this.drawablePlane = this.createDrawPlane(id,this.scene,x,y,z,"plano"+id);
};

Wall.prototype.createDrawPlane = function(id,scene,x,y,z,name) {

		var canvas = document.querySelector('#twodCanvas'+id);
		var geometry = new THREE.PlaneGeometry(256,64);
		if(this.texture == null) this.texture = new THREE.Texture(canvas);
		planesTextures.push(this.texture);
		var material = new THREE.MeshPhongMaterial({map: this.texture,transparent: true});
		this.texture.needsUpdate = true;
		var draw = new THREE.Mesh(geometry,material);
		draw.position.set(x,y,z);
		draw.name = name;
		draw.wall = this;
		scene.add(draw);

	return draw;
};