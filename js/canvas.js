console.log("Canvas Conected");

function Canvas(){
	this.canvasContainer = null;
	this.renderer = null;
	this.camera = null;
	this.scene = null;	
};

Canvas.prototype.init = function(){
	//Aqui metes todo lo del init
	THREE.ImageUtils.crossOrigin = '';
	this.canvasContainer = document.querySelector(".canvasContainer");
	this.createScene();
	this.createRenderer();
	this.createCamera();
	this.createPlane();
	this.createFrontWall();
	//this.createBuilding();
	this.createLight(this.camera.position.x,this.camera.position.y,this.camera.position.z);

	this.canvasContainer.appendChild(this.renderer.domElement);
	this.renderCanvas();
}
//Funcion para crear la escena de nuestro mundo 3D
Canvas.prototype.createScene = function(){
	this.scene = new THREE.Scene();
}

//Funcion para crear el renderer del mundo 3D
Canvas.prototype.createRenderer = function(){
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setClearColor(0xFFFFFF, 0.1);
	this.renderer.setSize(this.canvasContainer.clientWidth,this.canvasContainer.clientHeight);
}

//Función para crear una camara perspectiva que mira al centro del mundo
Canvas.prototype.createCamera = function(){
	this.camera = new THREE.PerspectiveCamera(75,this.canvasContainer.clientWidth/this.canvasContainer.clientHeight,1, 1000);
	this.camera.position.x = -10;
	this.camera.position.y = 60;
	this.camera.position.z = 150;
	this.camera.lookAt(new THREE.Vector3(0,0,0));
}

Canvas.prototype.createLight = function(x,y,z){
	var light = new THREE.PointLight(0xffffff,1,500,1);
	light.position.set(x,y,z)
	this.scene.add(light);
}

//Función recursiva render que pintara la Scene en al WEB
Canvas.prototype.renderCanvas = function(){
	this.renderer.render(this.scene,this.camera);
	requestAnimationFrame(this.renderCanvas.bind(this));
}

Canvas.prototype.createPlane = function(){
	var geometry = new THREE.CubeGeometry(1000,3,1000);
	var texture = new THREE.ImageUtils.loadTexture('imgs/ground.jpg');
	var material = new THREE.MeshPhongMaterial({map: texture});
	var plane = new THREE.Mesh(geometry,material);
	plane.position = new THREE.Vector3(0,0,0); 
	this.scene.add(plane);
}

Canvas.prototype.createFrontWall = function(){
	var geometry = new THREE.CubeGeometry(300,50,3);
	var texture = new THREE.ImageUtils.loadTexture('imgs/wall.3.jpg');
	
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 6, 1);

	var material = new THREE.MeshPhongMaterial({map: texture});
	var wall = new THREE.Mesh(geometry,material);
	wall.position.y += 25;
	wall.position.z +=75; 
	wall.name = "wall";
	this.scene.add(wall);
}

Canvas.prototype.createSkybox = function(){
	var urlPrefix = "imgs/Skybox/";
	var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
    urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
    urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
	var textureCube = THREE.ImageUtils.loadTextureCube( urls );

	var shader = THREE.ShaderUtils.lib["cube"];
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
	uniforms['tCube'].texture= textureCube;   // textureCube has been init before
	var material = new THREE.MeshShaderMaterial({
    	fragmentShader    : shader.fragmentShader,
    	vertexShader  : shader.vertexShader,
    	uniforms  : uniforms
	});

	skyboxMesh    = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true ), material );
	// add it to the scene
	scene.addObject( skyboxMesh );
}
/*Canvas.prototype.createBuilding = function(){
	that = this;
	var manager = new THREE.LoadingManager();
	var loader = new THREE.ObjectLoader(manager);
	var texture = new THREE.ImageUtils.loadTexture('imgs/building.jpg');
	var material = new THREE.MeshPhongMaterial({map: texture});
	loader.load('obj/building.obj',function(obj){
		obj.traverse(function(){
			if (child instanceof THREE.Mesh) {
                child.material = material;
            }	
		});
		obj.position.z -=10;
		that.scene.add(obj);
	});
}*/
