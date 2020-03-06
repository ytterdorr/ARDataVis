// Our Javascript will go here.
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Set background color
var sceneHexColor = "#101010";
var sceneBackgroundColor = new THREE.Color(0x505050);
scene.background = sceneBackgroundColor;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Position camera
camera.position.z = 2;
camera.position.y = 1;
camera.lookAt(new THREE.Vector3(0, 0.5, 0));

markerGroup = new THREE.Group();
markerGroup.rotation.y = Math.PI / 4;
scene.add(markerGroup);

// Add rotation listener
document.addEventListener("keydown", function(e) {
  rotationSpeed = 0.03;
  if (e.key === "ArrowRight") {
    markerGroup.rotation.y -= rotationSpeed;
  }
  if (e.key === "ArrowLeft") {
    markerGroup.rotation.y += rotationSpeed;
  }
  if (e.key === "ArrowUp") {
    markerGroup.rotation.x += rotationSpeed;
  }
  if (e.key === "ArrowDown") {
    markerGroup.rotation.x -= rotationSpeed;
  }
});

/****************
 * Load the data *
 ****************/
var fileURL = "../" + conf.fileURL;
var dataTitle = conf.title;
let getData = function(fileURL) {
  $.ajax({
    url: fileURL,
    success: function(data) {
      console.log("Got some file");
      build3DGraph(data, dataTitle, markerGroup);
    }
  }).fail(function() {
    console.log("Failed to get data");
  });
};

getData(fileURL);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
