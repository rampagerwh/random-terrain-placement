const terrainRadius = 2
const terrainColor = "rgb(200, 200, 200)"
const minTerrainSeparation = 0.1
const svgPadding = 20

let body = document.getElementById("body");
window.addEventListener("resize", recalc, true)

let svg = document.getElementById("svg")
let widthInput = document.getElementById("width")
let heightInput = document.getElementById("height")
let generatedTerrainsContainer = document.getElementById("generatedContainer")

let scale = 1
let generatedTerrains = []

recalc()

function recalc() {
  let bodyWidth = body.offsetWidth - 2 * svgPadding
  let width = parseInt(widthInput.value)

  let t = bodyWidth / width
  let f = t % 1 // get fractional part
  scale = Math.max(t - f, 1)
  
  let height = parseInt(heightInput.value)
  let windowHeight = (window.innerHeight - 2 * svgPadding) * 0.85
  t = windowHeight / height
  f = t % 1 // get fractional part
  let hScale = Math.max(t - f, 1)
  scale = Math.min(scale, hScale)  

  svg.setAttribute("width", width * scale)
  svg.setAttribute("height", height * scale)

  updateTerrain()
}

function createTerrain(x, y) {
  let terrain = document.createElementNS(svg.namespaceURI, "circle")
  terrain.setAttribute("cx", x + "%")
  terrain.setAttribute("cy", y + "%")
  terrain.setAttribute("r", terrainRadius * scale)
  terrain.setAttribute("fill", terrainColor)
  svg.appendChild(terrain)
}

function updateTerrain() {
  let terrainElements = svg.getElementsByTagName("circle")

  for (let i = 0; i < terrainElements.length; i++) {
    terrainElements[i].setAttribute("r", terrainRadius * scale)
  }

  for (let i = 0; i < generatedTerrains.length; i++) {
    generatedTerrainsContainer.children[i + 1].innerText =
      format(i, generatedTerrains[i][0], generatedTerrains[i][1])
  }
}

function generateTerrains(count) {
  generatedTerrains = [
    [random(), random()]
  ]
  createTerrain(generatedTerrains[0][0] * 100, generatedTerrains[0][1] * 100)

  for (let i = 1; i < count; i++) {
    let terrain = generateRandomPoint(generatedTerrains)
    generatedTerrains.push(terrain)
    createTerrain(terrain[0] * 100, terrain[1] * 100)
  }

  generatedTerrainsContainer = document.getElementById("generatedContainer")
  if (generatedTerrains.lenth < 1) {
    return
  }

  let content = document.createTextNode("Terrain positions:")
  let element = document.createElement("b")
  element.appendChild(content)
  generatedTerrainsContainer.appendChild(element)


  for (let i = 0; i < generatedTerrains.length; i++) {
    content = document.createTextNode(format(i, generatedTerrains[i][0], generatedTerrains[i][1]))
    element = document.createElement("p")
    element.appendChild(content)
    generatedTerrainsContainer.appendChild(element)
  }
}

function clearTerrain() {
  let terrainElements = svg.getElementsByTagName("circle")

  while (terrainElements.length > 0) {
    terrainElements[0].remove()
  }

  generatedTerrainsContainer.replaceChildren();
}

function onGenerateClicked() {
  clearTerrain()

  let terrainCountInput = document.getElementById("terrainCount");
  let terrainCount = parseInt(terrainCountInput.value)

  generateTerrains(terrainCount)
}

function dist(from, to) {
  let a = Math.pow(from[0] - to[0], 2)
  let b = Math.pow(from[1] - to[1], 2)
  return Math.sqrt(a + b)
}

function findClosestPointIndex(point, points) {
  let closestPointIndex = 0
  let minDistance = Infinity
  for (let i = 0; i < points.length; i++) {
    let distance = dist(point, points[i])
    if (distance < minDistance) {
      minDistance = distance
      closestPointIndex = i
    }
  }

  return closestPointIndex
}

function generateRandomPoint(previousPoints) {
  const candidateCount = 10

  let bestCandidate = []
  let bestDistance = 0
  for (let i = 0; i < candidateCount; i++) {
    let candidate = [random(), random()]
    let closestPoint = previousPoints[findClosestPointIndex(candidate, previousPoints)]
    let distance = dist(candidate, closestPoint)
    if (distance > bestDistance) {
      bestDistance = distance
      bestCandidate = candidate
    }
  }

  return bestCandidate
}

function random() {
  return Math.random() * (1.0 - minTerrainSeparation) + (minTerrainSeparation * 0.5)
}

function format(index, x, y) {
  let scaledX = Math.floor(x * parseInt(widthInput.value))
  let scaledY = Math.floor(y * parseInt(heightInput.value))
  return "#" + (index + 1) + " at " + scaledX + "cm, " + scaledY + "cm"
}
