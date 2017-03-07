console.log("Canvas Conected");

var planesTextures = [];
//var rayCaster = new THREE.RayCaster();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var paint = null;

function Canvas(){
	this.canvasContainer = null;
	this.renderer = null;
	this.camera = null;
	this.scene = null;
	//this.control = null;
	this.textureLoader= null;
	this.wallone = null;
	this.walltwo = null;
	this.wallthre= null;
	this.wallfour = null;	
};

Canvas.prototype.init = function(){
	//Aqui metes todo lo del init
	THREE.ImageUtils.crossOrigin = '';
	this.canvasContainer = document.querySelector(".canvasContainer");
	//Creo la Escena
	this.createScene();
	//Creo el Renderer
	this.createRenderer();
	//Listener al raton
	this.setEventsListeners();
	//Creo la Camara
	this.createCamera();
	//Creo el suelo de hierba
	this.createPlane(1200,2,1200,"grass");
	//Metele posicione
	this.createSceneWalls("muros");
	//Metele posicione
	this.createAcera("acera");
	//Metele posicione
	this.createStreet("carretera");
	//Creo Edificio Central
	this.createOBJ(0,0,-400,"building");
	//Creo Farolas
	this.createLamp(280,0,65,"lampara");
	this.createLamp(-280,0,65,"lampara");
	//Creo Edificio de Alrededores
	this.createSideBuildings(539,78,0,"latbuildings");
	//Creo la skybox
	this.createSkybox("skybox");
	//Creo los dos muros grafiteables
	this.wallone = new Wall("one",this.scene,-192,32,2);
	this.walltwo = new Wall("two",this.scene,192,32,2);
	//Añado todo al canvasContainer
	//window.addEventListener( 'resize', this.onWindowResize(this.camera,this.renderer), true );
	this.canvasContainer.appendChild(this.renderer.domElement);
	this.renderCanvas();
}
//Funcion para crear la escena de nuestro mundo 3D
Canvas.prototype.createScene = function(){
	this.scene = new THREE.Scene();
	this.scene.fog = new Fog(0x9c9c9c , 200,1000);
	this.textureLoader = new THREE.TextureLoader();
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

	//control = new THREE.OrbitControls(this.camera,this.renderer.domElement);
}

Canvas.prototype.createLight = function(x,y,z){
	var light = new THREE.PointLight(0xffffff,1,0,1);
	light.position.set(x,y,z)
	this.scene.add(light);
}

//Función recursiva render que pintara la Scene en al WEB
Canvas.prototype.renderCanvas = function(){
	//console.log("x " + this.camera.position.x + " y " +this.camera.position.y + " z " +this.camera.position.z)
	raycaster.setFromCamera( mouse, this.camera );
	this.renderer.render(this.scene,this.camera);
	requestAnimationFrame(this.renderCanvas.bind(this));
}

Canvas.prototype.createPlane = function(x,y,z,name){
	var geometry = new THREE.CubeGeometry(x,y,z);
	var texture = this.textureLoader.load('imgs/grass.jpg');
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 100, 100);
	var material = new THREE.MeshPhongMaterial({map: texture});
	var plane = new THREE.Mesh(geometry,material);
	plane.name = name;
	plane.position = new THREE.Vector3(0,-2,0); 
	this.scene.add(plane);
}

Canvas.prototype.createAcera = function(name){

	var frontal = new THREE.CubeGeometry(640,2,70);
	var texture = this.textureLoader.load('imgs/baldosa.jpg');

	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 60, 8);

	var material = new THREE.MeshPhongMaterial({map: texture});
	var front = new THREE.Mesh(frontal,material);
	front.name = name;
	front.position.set(0,1,35);
	
	var lateralTexture = this.textureLoader.load('imgs/baldosa.jpg');
	lateralTexture.wrapS = lateralTexture.wrapT = THREE.RepeatWrapping;
	lateralTexture.repeat.set( 8, 60);
	var material2 = new THREE.MeshPhongMaterial({map: lateralTexture});
	
	//interiores
	var lateral = new THREE.CubeGeometry(70,2,640);
	var left = new THREE.Mesh(lateral,material2);
	left.position.set(-355,1,-250);
	left.name = name;
	var right = new THREE.Mesh(lateral,material2);
	right.position.set(355,1,-250);
	right.name = name;
	//exteriores
	var lateral2 = new THREE.CubeGeometry(60,2,640);
	var left2 = new THREE.Mesh(lateral2,material2);
	left2.position.set(-520,1,-150);
	left2.name=name;
	var right2 = new THREE.Mesh(lateral2,material2);
	right2.position.set(520,1,-150);
	right2.name=name;
	this.scene.add(left);
	this.scene.add(right);
	this.scene.add(left2);
	this.scene.add(right2);
	this.scene.add(front);
}

Canvas.prototype.createBuilding = function(x,y,z,name){
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

Canvas.prototype.createOBJ = function(x,y,z,name){
	var that = this;
	var manager = new THREE.LoadingManager();
	var texture = this.textureLoader.load('obj/build10/Build10.jpg')
	var objLoader = new THREE.OBJLoader(manager);
    var material = new THREE.MeshBasicMaterial({map:texture});
    objLoader.load('obj/build10/Build10_obj.obj', function (obj) {
        obj.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
            obj.scale.set(1.5,1,1.5);
            obj.name = name;
            obj.position.set(x,y,z);
        });
        that.scene.add(obj);
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

Canvas.prototype.createLamp = function(x,y,z,name) {
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
			object.name = name; 
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

Canvas.prototype.createStreet = function(name){
	
	//CARRETERA HORIZONTAL
	var geometry = new THREE.CubeGeometry(780 ,1,100);
	var texture = this.textureLoader.load('imgs/carretera.jpg');
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 5, 1);
	var material = new THREE.MeshPhongMaterial({map: texture});
	var plane = new THREE.Mesh(geometry,material);
	plane.name = name;
	plane.position.y += 1;
	plane.position.z += 120;  
	
	//ESQUINAS DEL MAPA
	var cornerGeometry = new THREE.CubeGeometry(100,1,100);
	var cornerTexture = this.textureLoader.load('imgs/esq_drch.jpg');
	var cornerMaterial = new THREE.MeshPhongMaterial({map: cornerTexture});
	var rightCorner  = new THREE.Mesh(cornerGeometry,cornerMaterial);
	rightCorner.position.set(-440,1,120);
	rightCorner.name = name;
	var cornerTextDer = this.textureLoader.load('imgs/esq_izq.jpg');
	var cornerMaterial2 = new THREE.MeshPhongMaterial({map: cornerTextDer});
	var leftCorner  = new THREE.Mesh(cornerGeometry,cornerMaterial2);
	leftCorner.name = name;
	leftCorner.position.set(440,1,120);

	//CARETRAS PARALELAS HACIA DENTRO
	var sideStrets = new THREE.CubeGeometry(100,1,600);
	var texture2 = this.textureLoader.load('imgs/carretera_up.jpg');
	texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
	texture2.repeat.set( 1, 5);
	var material2 = new THREE.MeshPhongMaterial({map: texture2});
	leftStreet = new THREE.Mesh(sideStrets,material2);
	rightStreet = new THREE.Mesh(sideStrets,material2);

	leftStreet.position.set(440,1,-230);
	leftStreet.name = name;
	rightStreet.position.set(-440,1,-230);
	rightStreet.name = name;
	this.scene.add(leftStreet);
	this.scene.add(rightStreet);
	this.scene.add(leftCorner);
	this.scene.add(rightCorner);
	this.scene.add(plane);
}

Canvas.prototype.createSceneWalls = function(name){
	var front = new THREE.CubeGeometry(256,64,3);
	var texture = this.textureLoader.load('imgs/wall.3.jpg');
	
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 6, 1);

	var material = new THREE.MeshPhongMaterial({map: texture});
	var frontLeft = new THREE.Mesh(front,material);
	var frontRight = new THREE.Mesh(front,material);

	frontLeft.position.set(-192,32,0);
	frontLeft.name = name;
	frontRight.position.set(192,32,0);
	frontRight.name = name;
	//Geometria de las parede laterales
	var lateral = new THREE.CubeGeometry(3,64,640);
	//pared derecha
	var rightWall = new THREE.Mesh(lateral,material);
	rightWall.position.set(319,32,-320);
	rightWall.name = name;
	var leftWall = new THREE.Mesh(lateral,material);
	leftWall.position.set(-319,32,-320);
	leftWall.name = name;
	//Entrance
	var gateGeo = new THREE.PlaneGeometry(128,130);
	var gateTexture = this.textureLoader.load('imgs/entrance.png');
	var gateMat = new THREE.MeshPhongMaterial({map:gateTexture,transparent:true});
	var gate = new THREE.Mesh(gateGeo,gateMat);
	gate.name = "Gate";
	gate.position.set(0,40,0);

	this.scene.add(frontLeft);
	this.scene.add(frontRight);
	this.scene.add(leftWall);
	this.scene.add(rightWall);
	this.scene.add(gate);
}

Canvas.prototype.createSkybox = function(name){
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: this.textureLoader.load( 'imgs/skybox/posx.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: this.textureLoader.load( 'imgs/skybox/negx.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: this.textureLoader.load( 'imgs/skybox/posy.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: this.textureLoader.load( 'imgs/skybox/negy.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: this.textureLoader.load( 'imgs/skybox/posz.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: this.textureLoader.load( 'imgs/skybox/negz.jpg' ) }));
	for (var i = 0; i < 6; i++)
	   materialArray[i].side = THREE.BackSide;
	var skyboxMaterial = new THREE.MultiMaterial( materialArray );
	var skyboxGeom = new THREE.CubeGeometry( 1100, 1000, 1100, 1, 1, 1 );
	var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
	skybox.name = name;
	skybox.position.set(0,0,-50);
	this.scene.add( skybox );
}


Canvas.prototype.createDrawPlane = function(x,y,z,name) {
	var canvas = document.querySelector('#twodCanvas');
	var geometry = new THREE.PlaneGeometry(128,64);
	if(CanvasTexture == null) CanvasTexture = new THREE.Texture(canvas);
	var material = new THREE.MeshPhongMaterial({map: CanvasTexture,transparent: true});
	CanvasTexture.needsUpdate = true;
	var draw = new THREE.Mesh(geometry,material);
	draw.position.set(x,y,z);
	draw.name = name;
	this.scene.add(draw);
};

Canvas.prototype.createSideBuildings = function(x,y,z,name) {
	var geometry = new THREE.PlaneGeometry(1200,200);
	var texture = this.textureLoader.load('imgs/sidebuild.png');
	
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 5, 1);
	
	var material = new THREE.MeshPhongMaterial({map: texture, transparent: true});
	var leftSide = new THREE.Mesh(geometry,material);
	var rightSide = new THREE.Mesh(geometry,material);
	leftSide.position.set(-x,y,z);
	leftSide.name = name;
	leftSide.rotateY(this.degToRad(90));
	rightSide.position.set(x,y,z);
	rightSide.name=name;
	rightSide.rotateY(this.degToRad(-90));
	
	this.scene.add(leftSide);
	this.scene.add(rightSide);
};

Canvas.prototype.mouseMove = function(event){

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

Canvas.prototype.degToRad = function(degrees) {
	return degrees * (Math.PI/180);
};

Canvas.prototype.getScene= function(){
	return this.scene;
}

Canvas.prototype.onWindowResize = function (camera,renderer){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

Canvas.prototype.setEventsListeners = function(){
	var that = this;
	this.renderer.domElement.addEventListener('mousedown', function(e){
		that.drawOnPlane(e,that);
		paint = true;
	},false);	
	this.renderer.domElement.addEventListener('mousemove',function(e){
		if(paint) that.drawOnPlane(e,that);
	} ,false);
	this.renderer.domElement.addEventListener('mouseup', function(){
		paint = false;
		that.renderer.domElement.removeEventListener('mousemove',that.drawOnPlane);
	},false);


}

Canvas.prototype.drawOnPlane = function(e,that){
	
	mouse.x = (e.clientX / that.renderer.domElement.width) * 2 - 1;
    mouse.y = -(e.clientY / that.renderer.domElement.height) * 2 + 1;

	var intersects = raycaster.intersectObjects(this.scene.children);

	for (var i = 0 ; i < intersects.length; i++){
		if(intersects[i].object.name == "planoone"){
			var xPos = intersects[i].point.x;
			var yPos = intersects[i].point.y;
			var canvasX = xPos + 320;
			var canvasY = 64 - yPos; 
			
			intersects[i].object.wall.twoDcanvas.mousePos.x = canvasX;
			intersects[i].object.wall.twoDcanvas.mousePos.y = canvasY;
			intersects[i].object.wall.twoDcanvas.paint = true;
			intersects[i].object.wall.twoDcanvas.draw(intersects[i].object.wall.twoDcanvas);
			//console.log(intersects[i].object.wall.twoDcanvas);
			//console.log("Choco con PlanoOne: x:" + canvasX + "y:" + canvasY);
		}
		else if (intersects[i].object.name == "planotwo"){
			var xPos = intersects[i].point.x;
			var yPos = intersects[i].point.y;
			var canvasX = xPos - 64;
			var canvasY = 64 - yPos;
			intersects[i].object.wall.twoDcanvas.mousePos.x = canvasX;
			intersects[i].object.wall.twoDcanvas.mousePos.y = canvasY;
			intersects[i].object.wall.twoDcanvas.paint = true;
			intersects[i].object.wall.twoDcanvas.draw(intersects[i].object.wall.twoDcanvas);
		}
	}
}
