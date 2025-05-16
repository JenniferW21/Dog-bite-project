let data;

async function init(){
  let link = "https://data.cityofnewyork.us/resource/rsgh-akpg.json";
  info = await fetch(link);
  data = await info.json();
}
