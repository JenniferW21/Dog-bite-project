let data;

async function init(){
  let link = "https://data.cityofnewyork.us/resource/rsgh-akpg.json";
  info = await fetch(link);
  data = await info.json();
}

function displayLocation(){
  let location = [40.754041, -73.872378];
  let otput = document.getElementByID
  showMap(location);
}

let map;

function showMap(location){
  if (map) {
    map.remove();
  }

  map = L.map("map").setView(location, 14);

  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(map);

  let marker = L.marker(location).addTo(map);// ******** places marker on map
}     