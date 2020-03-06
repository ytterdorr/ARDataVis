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

markerRoot1 = new THREE.Group();
markerRoot1.rotation.y = Math.PI / 4;
scene.add(markerRoot1);

// Add rotation listener
document.addEventListener("keydown", function(e) {
  rotationSpeed = 0.03;
  if (e.key === "ArrowRight") {
    markerRoot1.rotation.y -= rotationSpeed;
  }
  if (e.key === "ArrowLeft") {
    markerRoot1.rotation.y += rotationSpeed;
  }
  if (e.key === "ArrowUp") {
    markerRoot1.rotation.x += rotationSpeed;
  }
  if (e.key === "ArrowDown") {
    markerRoot1.rotation.x -= rotationSpeed;
  }
});

/***** How the bars are created *****/
function createBar(height, xPos, zPos, rgbColor) {
  let barWidth = 0.09;
  let barHeight = height;
  let barDepth = 0.09;
  let firstBarGeometry = new THREE.CubeGeometry(barWidth, barHeight, barDepth);
  let firstBarMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(rgbColor),
    opacity: 0.8,
    transparent: true
  });

  // Add edges
  let firstBar = new THREE.Mesh(firstBarGeometry, firstBarMaterial);
  let edgeGeometry = new THREE.EdgesGeometry(firstBar.geometry); // or WireframeGeometry
  var material = new THREE.LineBasicMaterial({
    color: 0xaaaaaa,
    linewidth: 1,
    opacity: 0.7,
    transparent: true
  });
  var edges = new THREE.LineSegments(edgeGeometry, material);
  firstBar.add(edges); // add wireframe as a child of the parent mesh
  firstBar.position.y = barHeight / 2;
  firstBar.position.x = xPos;
  firstBar.position.z = zPos;
  // firstBar.scale.set(new THREE.Vector3(2, 2, 2));

  return firstBar;
}

/***** Make text *****/
function createText(text, color = "black", widthMult = 1) {
  console.log(widthMult);
  var bitmap = document.createElement("canvas");
  var g = bitmap.getContext("2d");
  bitmap.width = 128 * widthMult;
  bitmap.height = 32;
  // g.fillStyle = sceneHexColor;
  // g.fillRect(0, 0, bitmap.width, bitmap.height);
  g.font = "20px Arial";
  g.fillStyle = color;
  g.fillText(text, 0, 20);
  g.strokeStyle = "black";
  g.strokeText(text, 0, 20);

  // canvas contents will be used for a texture
  var texture = new THREE.Texture(bitmap);
  texture.needsUpdate = true;

  var textMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true
  });

  // textMaterial.color.set(0xff0000);
  var textGeometry = new THREE.PlaneGeometry(0.3 * widthMult, 0.1);

  var textPlane = new THREE.Mesh(textGeometry, textMaterial);
  return textPlane;
}

/***** Insert country data ****/
// TODO Set barMax and barMin from config
let barMax = conf.yMax; // How to make this variable?
let barMin = conf.yMin;
function insertCountryData(countryData, markerRoot = markerRoot1) {
  console.log("Insert country data");
  // console.log(countryData);
  let zPos = -0.55; // What does this
  let yPos = 0.01;

  for (let elem in countryData) {
    zPos += 0.1;
    let country = countryData[elem];
    // console.log(country)
    for (let i = 0; i <= 9; i++) {
      let xPos = -0.45 + i / 10 - 0.01;
      let height = (country.barData[i] - barMin) / (barMax - barMin);
      let color = country.barColor;
      // Create bars
      let bar = createBar(height, xPos, zPos, color);
      markerRoot.add(bar);
    }

    let name = createText(elem, country.barColor);
    name.position.x = -0.7;
    name.position.z = zPos;
    name.position.y = yPos;
    name.rotation.x = -Math.PI / 2;

    markerRoot.add(name);
  }
}

function createSupportLines() {
  // Lines
  let lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linewidth: 0.2,
    opacity: 0.5,
    transparent: true
  });
  for (let height = 0; height <= 1; height += 0.1) {
    let lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
      new THREE.Vector3(-0.5, height, -0.5),
      new THREE.Vector3(0.5, height, -0.5),
      new THREE.Vector3(0.5, height, 0.5)
    );

    let planeGeometry = new THREE.PlaneGeometry(1, 1);
    let planeMaterial = new THREE.MeshBasicMaterial({
      color: "gray",
      opacity: 0.1,
      transparent: true,
      side: THREE.DoubleSide
    });

    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = height;
    // markerRoot1.add(plane);

    let line = new THREE.Line(lineGeometry, lineMaterial);
    markerRoot1.add(line);
  }

  // Insert reference values
  let widthMult = 0.5;
  let text = barMax.toString();
  let textColor = "black";
  let topValue1 = createText(text, textColor, widthMult);
  topValue1.position.x = -0.5;
  topValue1.position.y = 1;
  topValue1.position.z = -0.5;
  let topValue2 = createText(text, textColor, widthMult);
  topValue2.position.x = 0.5;
  topValue2.position.z = 0.7;
  topValue2.position.y = 1;
  topValue2.rotation.y = -Math.PI / 2;

  // Create mid values
  text = (barMax - (barMax - barMin) / 2).toString();
  let midValue1 = createText(text, textColor, widthMult);
  midValue1.position.x = -0.5;
  midValue1.position.y = 0.5;
  midValue1.position.z = -0.5;

  let midValue2 = createText(text, textColor, widthMult);
  midValue2.position.x = 0.5;
  midValue2.position.y = 0.5;
  midValue2.position.z = 0.7;
  midValue2.rotation.y = -Math.PI / 2;

  // Create bottom values
  text = barMin.toString();
  let botValue1 = createText(text, textColor, widthMult);
  botValue1.position.x = -0.5;
  botValue1.position.y = 0.01;
  botValue1.position.z = -0.5;

  let botValue2 = createText(text, textColor, widthMult);
  botValue2.position.x = 0.5;
  botValue2.position.y = 0.01;
  botValue2.position.z = 0.7;
  botValue2.rotation.y = -Math.PI / 2;

  markerRoot1.add(topValue1);
  markerRoot1.add(topValue2);
  markerRoot1.add(midValue1);
  markerRoot1.add(midValue2);
  markerRoot1.add(botValue1);
  markerRoot1.add(botValue2);
}

function addYears() {
  let x = -0.46;
  for (let year = 1989; year <= 1998; year++) {
    let text = createText(" - " + year.toString());
    text.position.z = 0.65;
    text.position.y = 0.001;
    text.position.x = x;
    text.rotation.x = -Math.PI / 2;
    text.rotation.z = -Math.PI / 2;
    markerRoot1.add(text);
    x += 0.1;
  }
}

function createTitle(title) {
  let head = document.createElement("h1");
  head.innerHTML = title;
  head.classList.add("title");
  document.body.append(head);
  console.log(head);

  let widthMult = 2;
  let titleRect = createText(title, "white", widthMult);
  titleRect.position.y = 1.2;
  markerRoot1.add(titleRect);
}

function addBase() {
  let baseGeometry = new THREE.CubeGeometry(1.45, 0, 1.25);
  let baseMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });

  var base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.x = -0.2;
  base.position.z = 0.1;

  markerRoot1.add(base);
  // markerRoot1.add( firstBar );
}

function parseDataToObject(data) {
  // Basiclly load the data graph.
  let rows = data.split("\n");
  // Skip the index row
  rows = rows.slice(1);
  let countryData = {};
  let colors = [
    "blue",
    "yellow",
    "red",
    "green",
    "skyblue",
    "olive",
    "orchid",
    "silver",
    "tomato",
    "purple"
  ];
  let colorIndex = 0;

  // Get row data
  for (let i in rows) {
    row = rows[i].split(",");
    let countryName = row[0];
    let data = row.slice(1);
    // Store in countryData object
    countryData[countryName] = {
      barData: data,
      barColor: colors[colorIndex]
    };
    // Update color index
    colorIndex += 1;
  }
  // console.log(countryData)
  return countryData;
}

function build3DGraph(data) {
  let countryData = parseDataToObject(data);
  addBase();
  createSupportLines();
  insertCountryData(countryData);
  addYears();
  createTitle(dataTitle);
}

/****************
 * Load the data *
 ****************/
var fileURL = "../" + conf.fileURL;
var dataTitle = conf.title;
let getData = function(fileURL) {
  $.ajax({
    url: fileURL,
    success: function(data) {
      // Parse data
      console.log("Got some file");
      // console.log(data)
      build3DGraph(data);
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
