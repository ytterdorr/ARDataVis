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

function insertCountryData(countryData, conf, threeGroup = markerGroup) {
  console.log("Insert country data");
  let barMax = conf.yMax; // How to make this variable?
  let barMin = conf.yMin;
  let zPos = -0.55; // What does this
  let yPos = 0.01;

  // Sort countries by average data.
  let arr = [];
  for (let country in countryData) {
    // Sort by average size
    let avgObj = {};
    avgObj.name = country;
    avgObj.avg = arrAvg(countryData[country].barData);
    arr.push(avgObj);
  }
  arr.sort((a, b) => {
    return a.avg < b.avg ? 1 : -1;
  });

  for (let elem in arr) {
    zPos += 0.1;
    let countryName = arr[elem].name;
    let country = countryData[countryName];
    // console.log(country)
    for (let i = 0; i <= 9; i++) {
      let xPos = -0.45 + i / 10 - 0.01;
      let height = (country.barData[i] - barMin) / (barMax - barMin);
      let color = country.barColor;
      // Create bars
      let bar = createBar(height, xPos, zPos, color);
      threeGroup.add(bar);
    }

    let name = createText(countryName, country.barColor);
    name.position.x = -0.7;
    name.position.z = zPos;
    name.position.y = yPos;
    name.rotation.x = -Math.PI / 2;

    threeGroup.add(name);
  }
}

function addSupportLines(conf, threeGroup) {
  let barMax = conf.yMax;
  let barMin = conf.yMin;
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
    // markerGroup.add(plane);

    let line = new THREE.Line(lineGeometry, lineMaterial);
    threeGroup.add(line);
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

  threeGroup.add(topValue1);
  threeGroup.add(topValue2);
  threeGroup.add(midValue1);
  threeGroup.add(midValue2);
  threeGroup.add(botValue1);
  threeGroup.add(botValue2);
}

function addYears(threeGroup) {
  let x = -0.46;
  for (let year = 1989; year <= 1998; year++) {
    let text = createText(" - " + year.toString());
    text.position.z = 0.65;
    text.position.y = 0.001;
    text.position.x = x;
    text.rotation.x = -Math.PI / 2;
    text.rotation.z = -Math.PI / 2;
    threeGroup.add(text);
    x += 0.1;
  }
}

function addTitle(title, threeGroup) {
  let head = document.createElement("h1");
  // head.innerHTML = title;
  // head.classList.add("title");
  // document.body.append(head);
  console.log(head);

  let widthMult = 2;
  let titleRect = createText(title, "white", widthMult);
  titleRect.position.y = 1.2;
  // Add to scene/group
  threeGroup.add(titleRect);
}

function addBase(threeGroup) {
  let baseGeometry = new THREE.CubeGeometry(1.45, 0, 1.25);
  let baseMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });

  var base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.x = -0.2;
  base.position.z = 0.1;

  threeGroup.add(base);
}

function parseDataToObject(data) {
  /* Result will be something like:
   *
   */
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
    if (countryName === "") {
      continue;
    }
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

let arrAvg = arr => {
  console.log(arr);
  return arr.reduce((a, b) => Number(a) + Number(b)) / arr.length;
};
function build3DGraph(data, confObj, markerGroup) {
  let countryData = parseDataToObject(data);
  addBase(markerGroup);
  addSupportLines(confObj, markerGroup);
  insertCountryData(countryData, confObj, markerGroup);
  addYears(markerGroup);
  addTitle(confObj.title, markerGroup);
}
