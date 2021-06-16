var scene, camera, cameras, cameraIndex, renderer, controls, clock, raycaster, blocker, instructions, planeMesh, prevTime;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
// This will define how far player is from the ground (ray points towards ground and makes sure player won't go through)
let playerHeight = 2.5;
let movementSpeed = 35.0;
//====

init();


// Player
function init(){
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  var gui = new dat.GUI();

  //const helper = new THREE.CameraHelper( light.shadow.camera );
  //scene.add( helper );


  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio); 
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  document.getElementById('webgl').appendChild(renderer.domElement);
  // renderer.shadowMapCullFace = THREE.CullFaceNone;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.fog = new THREE.Fog( "rgb(150, 150, 150)", 10, 150 );


 // const geometry = new THREE.BoxBufferGeometry(4, 4, 4); 
  //const material = new THREE.MeshLambertMaterial({color: 0x00ff00 });
  //const mesh = new THREE.Mesh(geometry, material); // Generate mesh
  //mesh.castShadow = true; // Whether the object is rendered into the shadow map, the default value is false
  //mesh.position.set(0, 3, 0); // set object position
  //scene.add(mesh); // add to the scene


  var AmbientLight = new THREE.AmbientLight( 0x404040, 0.01 ); // soft white light
  scene.add( AmbientLight );


   // Create directional light
  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set( 3, 130, -88);
  light.shadow.bias = 0.000001;
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;

  light.shadow.camera.left = -100;
  light.shadow.camera.right = 30;
  light.shadow.camera.top = 35;
  light.shadow.camera.bottom = -30;

  light.castShadow = true;
  //light.target = mesh;
  scene.add(light); 

  //var helper9 = new THREE.DirectionalLightHelper( light );
  //scene.add( helper9 );


  const geometry = new THREE.BoxBufferGeometry(4, 10, .5); 
  const geometryMaterial = getMaterial('phong', 'rgb(110, 110, 110)');
  const cube = new THREE.Mesh(geometry, geometryMaterial); // Generate mesh
  cube.castShadow = true; // Whether the object is rendered into the shadow map, the default value is false
  cube.position.set(2.5, 0, 5.2); // set object position
  scene.add(cube); // add to the scene
  cube.rotation.set(0,180,0);

  const geometry_1 = new THREE.BoxBufferGeometry(8, 12, .5); 
  const geometryMaterial1 = getMaterial('phong', 'rgb(130, 130, 130)');
  const cube1 = new THREE.Mesh(geometry_1, geometryMaterial1); // Generate mesh
  cube1.castShadow = true; // Whether the object is rendered into the shadow map, the default value is false
  cube1.position.set(-3, 0, 19.5); // set object position
  scene.add(cube1); // add to the scene
  //cube1.rotation.set(0,180,0);

  const geometry_2 = new THREE.BoxBufferGeometry(4, 8, 4); 
  const geometryMaterial2 = getMaterial('phong', 'rgb(120, 120, 120)');
  const cube2 = new THREE.Mesh(geometry_2, geometryMaterial2); // Generate mesh
  cube2.castShadow = true; // Whether the object is rendered into the shadow map, the default value is false
  cube2.position.set(-10, 0, 12); // set object position
  scene.add(cube2); // add to the scene
  //cube1.rotation.set(0,180,0);

  const geometry_3 = new THREE.BoxBufferGeometry(2.2, 3, .2); 
  const geometryMaterial3 = getMaterial('phong', 'rgb(140, 140, 140)');
  const cube3 = new THREE.Mesh(geometry_3, geometryMaterial3); // Generate mesh
  cube3.castShadow = true; // Whether the object is rendered into the shadow map, the default value is false
  cube3.position.set(-10, 2, 10); // set object position
  scene.add(cube3); // add to the scene
  //cube1.rotation.set(0,180,0);
  const textureloader1 = new THREE.TextureLoader();
  geometryMaterial3.map = textureloader1.load('./Mann.jpg');
  geometryMaterial3.bumpMap = textureloader1.load('./white.jpg');
  geometryMaterial3.roughnessMap = textureloader1.load('./white.jpg');
  wrapTexturesOnMaterial( geometryMaterial3, 1, 1);
  //setMaterialToAllChildren(model,  geometryMaterial3);
  const geometry_4 = new THREE.BoxBufferGeometry(1.5, 2, .2); 
  const geometryMaterial4 = getMaterial('phong', 'rgb(140, 140, 140)');
  const cube4 = new THREE.Mesh(geometry_4, geometryMaterial4); // Generate mesh
  cube4.castShadow = true; // Whether the object is rendered into the shadow map, the default value is false
  cube4.position.set(9, 1.8, 7); // set object position
  cube4.rotation.set(0,0,0);
  scene.add(cube4); // add to the scene

  const textureloader2 = new THREE.TextureLoader();
  geometryMaterial4.map = textureloader2.load('./Gamboni.jpg');
  geometryMaterial4.bumpMap = textureloader2.load('./white.jpg');
  geometryMaterial4.roughnessMap = textureloader2.load('./white.jpg');
  wrapTexturesOnMaterial( geometryMaterial4, 1, 1);
  //setMaterialToAllChildren(model,  geometryMaterial3);




  const planeGeometry = new THREE.PlaneGeometry(500, 500); // Generate plane geometry
  const planeMaterial = getMaterial('phong', 'rgb(50, 50, 50)');
  //const planeMaterial = new THREE.PhongMaterial({color: 'rgb(50,50,50)'});
  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // Generate a flat grid
  planeMesh.receiveShadow = true; // Set the plane grid as the projection surface that accepts the shadow
  planeMesh.rotation.x = -Math.PI / 2; //Rotate 90 degrees around the X axis
  scene.add(planeMesh); // add to the scene
 

 // load the cube map
 var path = './';
 var format = '.jpg';
 var urls = [

    path + 'text1_nx' + format, path + 'text1_nx' + format,
		path + 'text1_nx' + format, path + 'text1_nx' + format,
		path + 'text1_nx' + format, path + 'text1_nx' + format

	];
	var reflectionCube = new THREE.CubeTextureLoader().load(urls);
	reflectionCube.format = THREE.RGBFormat;
	scene.background = reflectionCube;

  //scene.fog = new THREE.Fog( "rgb(191, 184, 157)", 50, 150 );
//  scene.fog = new THREE.Fog( "rgb(150, 150, 150)", 10, 100 );

  gui.add(light, 'intensity', 0, 10);
	gui.add(light.position, 'x', -500, 500);
	gui.add(light.position, 'y', -500, 500);
	gui.add(light.position, 'z', -500, 500);

  /*
  // dat.gui 
  var folder1 = gui.addFolder('light_1');
  folder1.add(light, 'intensity', 0, 50);
  folder1.add(light.position, 'x', -500, 500);
  folder1.add(light.position, 'y', -500, 500);
  folder1.add(light.position, 'z', -500, 500);

  // */
  // //Player
  // player = new THREE.Group();

  // const bodyGeometry = new THREE.CylinderBufferGeometry(0.4, 0.4, 1.6, 20);
  // const material = getMaterial('phong', 'rgb(255, 255, 255)');
  // const body = new THREE.Mesh(bodyGeometry, material);
  // body.position.y = 0.8;
  // // body.scale.z = 0.5;
  // const headGeometry = new THREE.SphereBufferGeometry(0.3, 20, 15);
  // const head = new THREE.Mesh(headGeometry, material);
  // head.position.y = 2.0;
  // player.add(body);
  // player.add(head);

  // cameras = [];
  // cameraIndex = 0;

  // const followCam = new THREE.Object3D();
  // followCam.position.copy(camera.position);
  // player.add(followCam);
  // cameras.push(followCam);

  // addKeyboardControl();

  // First Person Controls ===========
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 2000 );
  camera.position.set(0, 1, 8);
	camera.lookAt(new THREE.Vector3(10, 0, 5));


  blocker = document.getElementById( 'blocker' );
  instructions = document.getElementById( 'instructions' );

  controls = new THREE.PointerLockControls(camera, renderer.domElement);

  instructions.addEventListener( 'click', function () {
    controls.lock();
  } );
  controls.addEventListener( 'lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  } );
  controls.addEventListener( 'unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
  } );
  
  addPlayerControls(document);

  controls.getObject().position.set(-1, playerHeight, -8);
  lookTowards(controls.getObject().position, new THREE.Vector3(0, 0, 1));

  scene.add( controls.getObject() );

  // For not falling through ground
  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  // ===========



  window.addEventListener( 'resize', resize, false);
  
 // scene.add(ambient);
  scene.add(light);
  //scene.add(directionalLight);
  //scene.add(spotLight);
  // scene.add(player);




  let p1 = loadModel('./20210605_Room_Koerner_places.gltf')
    .then(result => {  
      // Get model
      let model = result.scene.children[0]; 

      // Set material
      const material = getMaterial('phong', 'rgb(100, 100, 100)');
      const textureloader = new THREE.TextureLoader();
      material.map = textureloader.load('./white.jpg');
      material.bumpMap = textureloader.load('./white.jpg');
      material.roughnessMap = textureloader.load('./white.jpg');
      wrapTexturesOnMaterial(material, 1, 1);
      setMaterialToAllChildren(model, material);

      // Set position
      model.position.set(-20,0,5);
      model.scale.set(1.5,1.5,1.5);
     // model.rotation.set(10,0,0);
     rotateObject(model, 0, 180, 0);
      return (model)
    });

  let p2 = loadModel('./20210605_triangle-wall_E2-01.gltf')
    .then(result => {  
      model = result.scene.children[0]; 

      // Set material
      const material = getMaterial('phong', 'rgb(120, 120, 120)');
      const textureloader = new THREE.TextureLoader();
      material.map = textureloader.load('./white.jpg');
     material.bumpMap = textureloader.load('./white.jpg');
      material.roughnessMap = textureloader.load('./white.jpg');
      wrapTexturesOnMaterial(material, 2, 2);
      setMaterialToAllChildren(model, material);
    material.bumpScale = 0.001;
      material.metalness = 0.01;
      material.roughness = 0.1;
      // Set position
      model.position.set(11,0,7.3);
      rotateObject(model, 0, 45, 0);
      //model.rotation.set(0,-10,0);
      model.scale.set(1,1,1);
      return (model);
    });

    let p3 = loadModel('./Plotegg_Ausstellung_test.glb')
    .then(result => {  
      gltfScene = result.scene; 

      // Set material
      const material = getMaterial('phong', 'rgb(110, 110, 110)');
      const textureloader = new THREE.TextureLoader();
      material.map = textureloader.load('./white.jpg');
      material.bumpMap = textureloader.load('./brown.jpg');
      material.roughnessMap = textureloader.load('./brown.jpg');
      wrapTexturesOnMaterial(material, 10, 10);
     setMaterialToAllChildren(gltfScene, material);


      // Set position
      gltfScene.scale.set(25000, 25000, 25000);
      gltfScene.position.set(200,-8, -40);

      return (gltfScene);
    });

    let p4 = loadModel('./20210605_Sheet-metal_column_7400-1600.gltf')
    .then(result => {  
      model = result.scene.children[0]; 

      // Set material
      const material = getMaterial('phong', 'rgb(100, 100, 100)');
      const textureloader = new THREE.TextureLoader();
      material.map = textureloader.load('./white.jpg');
      material.bumpMap = textureloader.load('./white.jpg');
      material.roughnessMap = textureloader.load('./white.jpg');
      wrapTexturesOnMaterial(material, 5, 5);
      setMaterialToAllChildren(model, material);

      // Set position
      model.position.set(20,0,25);
      model.scale.set(1.5,1.5,2);
      return (model);
    });

    let p5 = loadModel('./IC02B3_153_FDC_Gamboni_B_71.glb')
    .then(result => {  
      model = result.scene.children[0]; 

      // Set material
      const material = getMaterial('phong', 'rgb( 10, 10, 10)');
      const textureloader = new THREE.TextureLoader();
      //material.map = textureloader.load('/assets/textures/white.jpg');
      //material.bumpMap = textureloader.load('/assets/textures/white.jpg');
      //material.roughnessMap = textureloader.load('/assets/textures/white.jpg');
      //wrapTexturesOnMaterial(material, 1, 1);
      //setMaterialToAllChildren(model, material);

      // Set position
     // model.rotation.y = Math.PI / 2;
      //model.rotation.z = Math.PI / 2;
      //model.rotation.set(0,10,0);
      model.position.set(-3,1,19);
      model.scale.set(2,2,2);

      rotateObject(model, 0, 180, 0);
      return (model);
    });


    let p6 = loadModel('./20210605_glas-cabinet.gltf')
    .then(result => {  
      model = result.scene.children[0]; 

      // Set material
      const material = getMaterial('phong', 'rgb(0, 0, 0)');
      //const textureloader = new THREE.TextureLoader();
      //material.map = textureloader.load('/assets/textures/stone_white.jpg');
      //material.bumpMap = textureloader.load('/assets/textures/stone_white.jpg');
     // material.roughnessMap = textureloader.load('/assets/textures/stone_white.jpg');
     // wrapTexturesOnMaterial(material, 1, 1);
     // setMaterialToAllChildren(model, material);

      // Set position
      model.position.set(10,0,20);
      model.scale.set(1.5,1.5,2);
      return (model);
    });

    /*

    let p7 = loadModel('assets/models/20210605_Scenographic elements.gltf')
    .then(result => {  
      model = result.scene.children[0]; 

      // Set material
      const material = getMaterial('phong', 'rgb(200, 200, 200)');

     // const textureloader = new THREE.TextureLoader();
     // material.map = textureloader.load('/assets/textures/brown.jpg');
     // material.bumpMap = textureloader.load('/assets/textures/brown.jpg');
    //  material.roughnessMap = textureloader.load('/assets/textures/brown.jpg');
     // wrapTexturesOnMaterial(material, 1, 1);
     // setMaterialToAllChildren(model, material);
     // material.bumpScale = 0.001;
     // material.metalness = 0.5;
     // material.roughness = 0.1;

      // Set position
      model.position.set(0,0,-20);
      model.scale.set(2,1.5,2);
      return (model);
    });
*/
    let p8 = loadModel('./IC02B3_157_FDC_Gamboni_B_70.glb')
    .then(result => {  
      model = result.scene.children[0]; 

      // Set material
      const material = getMaterial('phong', 'rgb(60, 60, 60)');
      //const textureloader = new THREE.TextureLoader();
      //material.map = textureloader.load('/assets/textures/brown.jpg');
      //material.bumpMap = textureloader.load('/assets/textures/brown.jpg');
      //material.roughnessMap = textureloader.load('/assets/textures/brown.jpg');
      //wrapTexturesOnMaterial(material, 1, 1);
      //setMaterialToAllChildren(model, material);
      material.bumpScale = 0.001;
      material.metalness = 0.5;
      material.roughness = 0.1;
   
      // Set position
      model.position.set(2.3,1,5);
      model.scale.set(2,2,2);
      model.rotation.set(0,180,0);
      return (model);
    });

  prevTime = performance.now();

  //Once all asynchronous model loadings have finished, add them to scene
  //and start render loop (update)
  Promise.all([p1,p2,p3, p4, p5, p6, p8]).then(objs => {
    objs.forEach(obj => {
      scene.add(obj);
      // DO WHATEVER YOU WANT TO ALL GLTF MODELS
    });
    addShadowsToAllChildren(scene);
    update();
  });
}

function lookTowards(playerPos, directionVector) {
  camera.lookAt(playerPos.x + directionVector.x, playerPos.y + directionVector.y, playerPos.z + directionVector.z);
}

function setMaterialToAllChildren(traverseObject, material) {
  traverseObject.traverse(function( object ) {
    if ( object.isMesh ) {
      object.material = material;
    };
  });
}

function addShadowsToAllChildren(traverseObject) {
  traverseObject.traverse(function( object ) {
    if ( object.isMesh ) {
      object.castShadow = true;
      object.receiveShadow = true;
    };
  });
}

function wrapTexturesOnMaterial(material, x, y) {
  var maps = ['map', 'bumpMap', 'roughnessMap'];
	maps.forEach(function(mapName) {
		var texture = material[mapName];
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.Re2peatWrapping;
		texture.repeat.set(x, y);
	});
}

function update(){
  requestAnimationFrame( update );
  const time = performance.now();
  renderer.render( scene, camera );
  //renderer.shadowMap.renderReverseSided = true;
  renderer.shadowMap.needsUpdate = true;
  if ( controls.isLocked === true ) {
    let delta = (time - prevTime) / 1000.0;
    movePlayer(delta);
  }
  prevTime = time;
}

function movePlayer(delta) {
  raycaster.ray.origin.copy( controls.getObject().position );
  raycaster.ray.origin.y -= playerHeight;

  const intersections = raycaster.intersectObjects( [planeMesh] );
  const onObject = intersections.length > 0;

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

  direction.z = Number( moveForward ) - Number( moveBackward );
  direction.x = Number( moveRight ) - Number( moveLeft );
  direction.normalize(); // this ensures consistent movements in all directions
  if ( moveForward || moveBackward ) velocity.z -= direction.z * movementSpeed * delta;
  if ( moveLeft || moveRight ) velocity.x -= direction.x * movementSpeed * delta;
  if ( onObject === true ) {
    velocity.y = 0;
  }
  controls.moveRight( - velocity.x * delta );
  controls.moveForward( - velocity.z * delta );
  controls.getObject().position.y += ( velocity.y * delta ); // new behavior
  if ( controls.getObject().position.y < playerHeight ) {
    velocity.y = 0;
    controls.getObject().position.y = playerHeight;
  }
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default: 
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;
	//Set up shadow properties for the light
	light.shadow.mapSize.width = 2048;  // default: 512
	light.shadow.mapSize.height = 2048; // default: 512
	light.shadow.bias = 0.0001;
  light.shadow.camera.left = -500;
  light.shadow.camera.right = 500;
  light.shadow.camera.top = 500;
  light.shadow.camera.bottom = -500;
  
//light.shadow.mapSize.width = 1024*4;
//light.shadow.mapSize.height = 1024*4;
	return light;
}

function loadModel(url) {
  return new Promise(resolve => {
    new THREE.GLTFLoader().load(url, resolve);
  });
}

function loadTexture(url) {
  return new Promise(resolve => {
    new THREE.TextureLoader().load(url, resolve);
  });
}

/*
function getDirectionalLight(intensity) {
	var light = new THREE.DirectionalLight(0xffffff, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;
	//Set up shadow properties for the light
	light.shadow.mapSize.width = 2048;  // default: 512
	light.shadow.mapSize.height = 2048; // default: 512
	light.shadow.bias = 0.001;
 
  light.shadow.camera.left = -100;
light.shadow.camera.right = 100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;

//light.shadow.mapSize.width = 1024*4;
//light.shadow.mapSize.height = 1024*4;
	return light;
}

*/

function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
  object.rotateX(THREE.Math.degToRad(degreeX));
  object.rotateY(THREE.Math.degToRad(degreeY));
  object.rotateZ(THREE.Math.degToRad(degreeZ));
}

function addPlayerControls(document) {
  const onKeyDown = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

    }

  };

  const onKeyUp = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;

    }

  };

  document.addEventListener( 'keydown', onKeyDown );
  document.addEventListener( 'keyup', onKeyUp );
}
