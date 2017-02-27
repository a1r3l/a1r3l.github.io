console.log("Canvas Conected");

var CanvasTexture = null;

function Canvas(){
	this.canvasContainer = null;
	this.renderer = null;
	this.camera = null;
	this.scene = null;
	this.control = null;	
};

Canvas.prototype.init = function(){
	//Aqui metes todo lo del init
	THREE.ImageUtils.crossOrigin = '';
	this.canvasContainer = document.querySelector(".canvasContainer");
	this.createScene();
	this.createRenderer();
	this.createCamera();
	
	this.createPlane(1200,2,1200);
	//Metele posicione
	this.createAcera();
	//Metele posicione
	this.createStreet();
	//Metele posicione
	this.createFrontWall();
	//Metele posicione
	this.createBuilding(-560,0,-200);
	//Metele posicione
	this.createStop();
	this.createLamp(280,0,65);
	this.createLamp(-280,0,65);
	this.createSkybox();
	this.createDrawPlane(-187,32,2);
	this.createDrawPlane(187,32,2);
	this.createDrawPlane(59,32,2);

	//this.createLight(0,100,200);
	this.canvasContainer.appendChild(this.renderer.domElement);
	this.renderCanvas();
}
//Funcion para crear la escena de nuestro mundo 3D
Canvas.prototype.createScene = function(){
	this.scene = new THREE.Scene();
	this.scene.fog = new Fog(0x9c9c9c , 100,1000);
}

//Funcion para crear el renderer del mundo 3D
Canvas.prototype.createRenderer = function(){
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setClearColor(0xFFFFFF, 0.1);
	this.renderer.setSize(this.canvasContainer.clientWidth,this.canvasContainer.clientHeight);
}

//Función para crear una camara perspectiva que mira al centro del mundo
Canvas.prototype.createCamera = function(){
	this.camera = new THREE.PerspectiveCamera(85,this.canvasContainer.clientWidth/this.canvasContainer.clientHeight,1, 2000);
	this.camera.position.x = -10;
	this.camera.position.y = 100;
	this.camera.position.z = 200;
	this.camera.lookAt(new THREE.Vector3(0,0,0));

	control = new THREE.OrbitControls(this.camera,this.renderer.domElement);
}

Canvas.prototype.createLight = function(x,y,z){
	var light = new THREE.PointLight(0xffffff,1,0,1);
	light.position.set(x,y,z)
	this.scene.add(light);
}

//Función recursiva render que pintara la Scene en al WEB
Canvas.prototype.renderCanvas = function(){
	//console.log("x " + this.camera.position.x + " y " +this.camera.position.y + " z " +this.camera.position.z)
	this.renderer.render(this.scene,this.camera);
	requestAnimationFrame(this.renderCanvas.bind(this));
}

Canvas.prototype.createPlane = function(x,y,z){
	var geometry = new THREE.CubeGeometry(x,y,z);
	var texture = new THREE.ImageUtils.loadTexture('imgs/grass.jpg');
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 100, 100);
	var material = new THREE.MeshPhongMaterial({map: texture});
	var plane = new THREE.Mesh(geometry,material);
	plane.position = new THREE.Vector3(0,-2,0); 
	this.scene.add(plane);
}

Canvas.prototype.createAcera = function(){
	var geometry = new THREE.CubeGeometry(600,4,70);
	var texture = new THREE.ImageUtils.loadTexture('imgs/baldosa.jpg');

	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 60, 8);

	var material = new THREE.MeshPhongMaterial({map: texture});
	var front = new THREE.Mesh(geometry,material);
	front.position.set(0,2,35);
	
	var texture2 = new THREE.ImageUtils.loadTexture('imgs/baldosa.jpg');
	texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
	texture2.repeat.set( 8, 60);
	var material2 = new THREE.MeshPhongMaterial({map: texture2});
	
	var geometry1 = new THREE.CubeGeometry(50,4,600);
	var left = new THREE.Mesh(geometry1,material2);
	left.position.set(-275,2,-300);

	var right = new THREE.Mesh(geometry1,material2);
	right.position.set(275,2,-300);

	this.scene.add(left);
	this.scene.add(right);
	this.scene.add(front);
}

Canvas.prototype.createBuilding = function(x,y,z){
	var that = this;
	var manager = new THREE.LoadingManager();
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load('obj/build2/building.mtl', function(materials){
		materials.preload();
		var objLoader = new THREE.OBJLoader(manager);
		objLoader.setMaterials(materials);
		objLoader.load('obj/build2/building.obj',function(object){
			object.scale.set(4,4,4);
			object.position.set(x,y,z)
			that.scene.add(object);			
		});
	});
}

Canvas.prototype.createStop = function() {
	var that = this;
	var manager = new THREE.LoadingManager();
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load('obj/stop/stop.mtl', function(materials){
		materials.preload();

		var objLoader = new THREE.OBJLoader(manager);
		objLoader.setMaterials(materials);
		objLoader.load('obj/stop/stop.obj',function(object){
			object.scale.set(4,6,4);
			object.position.set(280,20,65)
			that.scene.add(object);
		});
	});
};

Canvas.prototype.createLamp = function(x,y,z) {
	var that = this;
	var manager = new THREE.LoadingManager();
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load('obj/lamp/StreetLamp.mtl', function(materials){
		materials.preload();

		var objLoader = new THREE.OBJLoader(manager);
		objLoader.setMaterials(materials);
		objLoader.load('obj/lamp/StreetLamp.obj',function(object){
			object.scale.set(4,6,4);
			object.position.set(x,y,z)
			object.rotation.y += that.degToRad(-90); 
			that.scene.add(object);			
			that.createLight(x,y+80,z+30);
		});
	});
};

Canvas.prototype.createTree = function(x,y,z) {
	var that = this;
	var manager = new THREE.LoadingManager();
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load('obj/tree/tree.mtl', function(materials){
		materials.preload();

		var objLoader = new THREE.OBJLoader(manager);
		objLoader.setMaterials(materials);
		objLoader.load('obj/tree/tree.obj',function(object){
			object.scale.set(4,6,4);
			object.position.set(x,y,z)
			that.scene.add(object);			
		});
	});
};

Canvas.prototype.createStreet = function(){
	
	//CARRETERA HORIZONTAL
	var geometry = new THREE.CubeGeometry(600,1,100);
	var texture = new THREE.ImageUtils.loadTexture('imgs/carretera.jpg');
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 5, 1);
	var material = new THREE.MeshPhongMaterial({map: texture});
	var plane = new THREE.Mesh(geometry,material);
	plane.position.y += 1;
	plane.position.z += 120;  
	
	//ESQUINAS DEL MAPA
	var cornerGeometry = new THREE.CubeGeometry(100,1,100);
	var cornerTexture = new THREE.ImageUtils.loadTexture('imgs/esq_drch.jpg');
	var cornerMaterial = new THREE.MeshPhongMaterial({map: cornerTexture});
	var rightCorner  = new THREE.Mesh(cornerGeometry,cornerMaterial);
	rightCorner.position.set(-350,1,120);
	var cornerTextDer = THREE.ImageUtils.loadTexture('imgs/esq_izq.jpg');
	var cornerMaterial2 = new THREE.MeshPhongMaterial({map: cornerTextDer});
	var leftCorner  = new THREE.Mesh(cornerGeometry,cornerMaterial2);
	leftCorner.position.set(350,1,120);

	//CARETRAS PARALELAS HACIA DENTRO
	var sideStrets = new THREE.CubeGeometry(100,1,600);
	var texture2 = new THREE.ImageUtils.loadTexture('imgs/carretera_up.jpg');
	texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
	texture2.repeat.set( 1, 5);
	var material2 = new THREE.MeshPhongMaterial({map: texture2});
	leftStreet = new THREE.Mesh(sideStrets,material2);
	rightStreet = new THREE.Mesh(sideStrets,material2);

	leftStreet.position.set(350,1,-230);
	rightStreet.position.set(-350,1,-230);

	this.scene.add(leftStreet);
	this.scene.add(rightStreet);
	this.scene.add(leftCorner);
	this.scene.add(rightCorner);
	this.scene.add(plane);
}

Canvas.prototype.createFrontWall = function(){
	var geometry = new THREE.CubeGeometry(500,64,3);
	var texture = new THREE.ImageUtils.loadTexture('imgs/wall.3.jpg');
	
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 6, 1);

	var material = new THREE.MeshPhongMaterial({map: texture});
	var wall = new THREE.Mesh(geometry,material);
	wall.position.set(0,32,0);
	wall.name = "wall";
	

	var geometry2 = new THREE.CubeGeometry(3,64,500);
	var rightWall = new THREE.Mesh(geometry2,material);
	rightWall.position.set(249,32,-249);

	var leftWall = new THREE.Mesh(geometry2,material);
	leftWall.position.set(-249,32,-249);
	
	this.scene.add(wall);
	this.scene.add(leftWall);
	this.scene.add(rightWall);
}

Canvas.prototype.createSkybox = function(){
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'imgs/skybox/posx.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'imgs/skybox/negx.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'imgs/skybox/posy.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'imgs/skybox/negy.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'imgs/skybox/posz.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'imgs/skybox/negz.jpg' ) }));
	for (var i = 0; i < 6; i++)
	   materialArray[i].side = THREE.BackSide;
	var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyboxGeom = new THREE.CubeGeometry( 1200, 1000, 1200, 1, 1, 1 );
	var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
	this.scene.add( skybox );
}

Canvas.prototype.degToRad = function(degrees) {
	return degrees * (Math.PI/180);
};

Canvas.prototype.createDrawPlane = function(x,y,z) {
	var canvas = document.querySelector('#twodCanvas');
	var geometry = new THREE.PlaneGeometry(128,64);
	if(CanvasTexture == null) CanvasTexture = new THREE.Texture(canvas);
	var material = new THREE.MeshPhongMaterial({map: CanvasTexture,transparent: true});
	CanvasTexture.needsUpdate = true;
	var draw = new THREE.Mesh(geometry,material);
	draw.position.set(x,y,z);
	this.scene.add(draw);
};


/*Canvas.prototype.loadOBJ = function(objPath,texturePath,scene,x,y,z)
{
    var loader = new THREE.OBJLoader();
    var that = this;
    loader.load(objPath, function (object) {
        object.traverse( function ( child ) {
             if ( child instanceof THREE.Mesh )
             {
                 var texture = new THREE.Texture();
                 var imgLoader = new THREE.ImageLoader();

                 imgLoader.load( texturePath, function ( image ) {
                     texture.image = image;
                     texture.needsUpdate = true;
                 } );
                 child.material.map = texture;
                 }
             } );

        that.mesh = object;
        scene.add(object);
        that.move(0, -10, -30);
    });
    return;
};*/