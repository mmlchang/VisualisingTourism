var container, 
    renderer_tptt, 
    scene_tptt, 
    camera_tptt, 
    mesh, 
    start = Date.now(),
    fov = 30;

var clock = new THREE.Clock();

var timeUniform = {
	iGlobalTime: {
		type: 'f',
		value: 0.1
	},
	iResolution: {
		type: 'v2',
		value: new THREE.Vector2()
	}
};

timeUniform.iResolution.value.x = window.innerWidth;
timeUniform.iResolution.value.y = window.innerHeight;

window.addEventListener('load', function() {
  container = document.getElementById('container_water');
  scene_tptt = new THREE.Scene();
  
  camera_tptt = new THREE.PerspectiveCamera( 
    fov, 
    window.innerWidth / window.innerHeight, 
    1, 
    10000
  );
  camera_tptt.position.x = 20;    
  camera_tptt.position.y = 10;    
  camera_tptt.position.z = 20;
  camera_tptt.lookAt(scene_tptt.position);
  scene_tptt.add(camera_tptt);
  
  var axis = new THREE.AxisHelper(10);
  scene_tptt.add (axis);
  
  material = new THREE.ShaderMaterial({
    uniforms: timeUniform,
    vertexShader: document.getElementById('vertex-shader').textContent,
    fragmentShader: document.getElementById('fragment-shader').textContent
  });
  
  var water = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 40), material
  );
  scene_tptt.add(water);
  
  var geometry = new THREE.SphereGeometry( 10, 32, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  var sphere = new THREE.Mesh( geometry, material );
  scene_tptt.add( sphere );

  renderer_tptt = new THREE.WebGLRenderer();
  renderer_tptt.setSize( window.innerWidth, window.innerHeight );
  
  container.appendChild( renderer_tptt.domElement );

  render_tptt();
});

window.addEventListener('resize',function() {
	camera_tptt.aspect = window.innerWidth / window.innerHeight;
	camera_tptt.updateProjectionMatrix();
	renderer_tptt.setSize(window.innerWidth, window.innerHeight);
});

function render_tptt() {
  timeUniform.iGlobalTime.value += clock.getDelta();
  renderer_tptt.render(scene_tptt, camera_tptt);
  requestAnimationFrame(render_tptt);
}