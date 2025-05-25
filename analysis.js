function get(id){
  return document.getElementById(id);
}

function displayChart( data, id, type ){
  let chart = c3.generate({
    bindto: '#' + id,
    data: {
      columns: data,
      type:type
    }
  });
}

let data;
async function init(){
  let link = "https://data.cityofnewyork.us/resource/rsgh-akpg.json";
  info = await fetch(link);
  data = await info.json();
  console.log(data);
}

function dogYears(){
  let year;
  for (let i = 0; i < data.length; i++){
    let date = new Date(data[i].created_date);
    let year = date.getFullYear();
    if (count[year]){
      count[year]++;
    } else {
      count[year] = 1;
    }
  }
  let columns = [];
  for (let year in count){
    columns.push([year, count[year]]);
  }
  displayChart(columns, 'timeline', 'line');
}