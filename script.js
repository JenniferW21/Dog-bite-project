let data;

async function init(){
  let link = "https://data.cityofnewyork.us/resource/rsgh-akpg.json";
  info = await fetch(link);
  data = await info.json();
  console.log(data);
}

function dogGender(){
  //gender: m f u,
  let m=0, f=0, u=0;
  for(let i=0; i<data.length; i++){
    let gender = data[i];
    if(gender.gender == "M"){
      m++;
    }else if(gender.gender == "F"){
      f++;
    }else if(gender.gender == "U"){
      u++;
    }
}
let chartGender = [
  ['M', m],
  ['F', f],
  ['U', u]
];

}
function gender(){
  
}

function myFunction() {
   var element = document.body;
   element.classList.toggle("dark-mode");
}