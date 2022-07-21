// GLOBAL
window.addEventListener("DOMContentLoaded", start);

function start() {
  zoomAndDrag();
  countryEventlisteners();
  areaEventlisteners();
}

// Array of used countries
let countryArray = [
  document.querySelector("#AR"),
  document.querySelector("#AU"),
  document.querySelector("#CA"),
  document.querySelector("#CL"),
  document.querySelector("#FR"),
  document.querySelector("#GR"),
  document.querySelector("#IT"),
  document.querySelector("#NZ"),
  document.querySelector("#PT"),
  document.querySelector("#RO"),
  document.querySelector("#ES"),
  document.querySelector("#ZA"),
  document.querySelector("#DE"),
  document.querySelector("#UY"),
  document.querySelector("#US"),
  document.querySelector("#AT"),
  document.querySelector("#DK"),
  document.querySelector("#IE"),
  document.querySelector("#IS"),
  document.querySelector("#MX"),
  document.querySelector("#CH"),
  document.querySelector("#GB"),
]

// Array of used areas
let areaArray = [
  /* FRANKRIG */
  document.querySelector("#FR-07"),
  document.querySelector("#FR-67"),
  document.querySelector("#FR-68"),
  document.querySelector("#FR-83"),
  document.querySelector("#FR-04"),
  document.querySelector("#FR-05"),
  document.querySelector("#FR-06"),
  document.querySelector("#FR-13"),
  document.querySelector("#FR-84"),
  document.querySelector("#FR-33"),
  document.querySelector("#FR-21"),
  document.querySelector("#FR-71"),
  document.querySelector("#FR-51"),
  document.querySelector("#FR-31"),
  document.querySelector("#FR-32"),
  document.querySelector("#FR-40"),
  document.querySelector("#FR-65"),
  document.querySelector("#FR-39"),
  document.querySelector("#FR-11"),
  document.querySelector("#FR-12"),
  document.querySelector("#FR-30"),
  document.querySelector("#FR-34"),
  document.querySelector("#FR-66"),
  document.querySelector("#FR-37"),
  document.querySelector("#FR-41"),
  document.querySelector("#FR-44"),
  document.querySelector("#FR-45"),
  document.querySelector("#FR-49"),
  document.querySelector("#FR-69"),
  /* ITALIEN */
  document.querySelector("#IT_65"),
  document.querySelector("#IT-75"),
  document.querySelector("#IT-72"),
  document.querySelector("#IT-45"),
  document.querySelector("#IT-36"),
  document.querySelector("#IT-25"),
  document.querySelector("#IT-57"),
  document.querySelector("#IT-21"),
  document.querySelector("#IT-88"),
  document.querySelector("#IT-82"),
  document.querySelector("#IT-52"),
  document.querySelector("#IT-32"),
  document.querySelector("#IT-55"),
  document.querySelector("#IT-34"),
  /* SPANIEN */
  document.querySelector("#ES-A"),
  document.querySelector("#ES-LE"),
  document.querySelector("#ES-MA"),
  document.querySelector("#ES-PM"),
  document.querySelector("#ES-SG"),
  document.querySelector("#ES-LO"),
  document.querySelector("#ES-V"),
  document.querySelector("#ES-ZA"),
  /* USA */
  document.querySelector("#US-CA"),
  document.querySelector("#US-OR"),
  /* AUSTRALIEN */
  document.querySelector("#AU-SA"),
  document.querySelector("#AU-VIC"),
  /* CHILE */
  document.querySelector("#CL-LI"),
  document.querySelector("#CL-VS"),
  /* ARGENTINA */
  document.querySelector("#AR-A"),
  document.querySelector("#AR-M"),
  document.querySelector("#AR-R"),
  document.querySelector("#AR-U"),
  /* TYSKLAND */
  document.querySelector("#DE-RP"),
  document.querySelector("#DE-BW"),
  /* NEW ZEALAND */
  document.querySelector("#NZ-HKB"),
  document.querySelector("#NZ-MBH"),
  document.querySelector("#NZ-OTA"),
  /* PORTUGAL */
  document.querySelector("#PT-13"),
  document.querySelector("#PT-18"),
  /* ØSTRIG */
  document.querySelector("#AT-1"),
  document.querySelector("#AT-6"),
  /* SYDAFRIKA */
  document.querySelector("#ZA-WC"),
  /* IRLAND */
  document.querySelector("#IE-D"),
  document.querySelector("#GB-NIR"),
  /* DANMARK */
  document.querySelector("#DK-85"),
  document.querySelector("#DK-83"),
  /* RUMÆNIEN */
  document.querySelector("#RO-PH"),
  /* URUGUAY */
  document.querySelector("#UY-MA"),
  /* ISLAND */
  document.querySelector("#IS-1"),
  /* MEXICO */
  document.querySelector("#MX-JAL"),
  document.querySelector("#MX-DF"),
  /* SCHWEIZ */
  document.querySelector("#CH-ZG"),
  /* STORBRITANNIEN */
  document.querySelector("#GB-UKN"),
  document.querySelector("#GB-UKJ"),
]



//ZOOM AND DRAG
function zoomAndDrag() {
const maxScale = 5,
   minScale = 0.15;

 var selected,
   scale = 1,
   svg = document.querySelector('svg');

 function beginDrag(e) {
   e.stopPropagation();
   let target = e.target;

   if (target.classList.contains('draggable')) {
     selected = target;
   } else {
     selected = document.querySelector('.main-container');
   }

   selected.dataset.startMouseX = e.clientX;
   selected.dataset.startMouseY = e.clientY;
 }

 function drag(e) {
   if (!selected) return;
   e.stopPropagation();

   let startX = parseFloat(selected.dataset.startMouseX),
     startY = parseFloat(selected.dataset.startMouseY),
     dx = (e.clientX - startX),
     dy = (e.clientY - startY);

   if (selected.classList.contains('draggable')) {
     let selectedBox = selected.getBoundingClientRect(),
       boundaryBox = selected.parentElement.getBoundingClientRect();

     if (selectedBox.right + dx > boundaryBox.right) {
       dx = (boundaryBox.right - selectedBox.right);
     } else if (selectedBox.left + dx < boundaryBox.left) {
       dx = (boundaryBox.left - selectedBox.left);
     }

     if (selectedBox.bottom + dy > boundaryBox.bottom) {
       dy = (boundaryBox.bottom - selectedBox.bottom);
     } else if (selectedBox.top + dy < boundaryBox.top) {
       dy = (boundaryBox.top - selectedBox.top);
     }
   }

   let currentMatrix = selected.transform.baseVal.consolidate().matrix,
     newMatrix = currentMatrix.translate(dx / scale, dy / scale),
     transform = svg.createSVGTransformFromMatrix(newMatrix);

   selected.transform.baseVal.initialize(transform);
   selected.dataset.startMouseX = dx + startX;
   selected.dataset.startMouseY = dy + startY;
 }

 function endDrag(e) {
   e.stopPropagation();

   if (selected) {
     selected = undefined;
   }
 }


 function zoom(e) {
   e.stopPropagation();
   e.preventDefault();

   let delta = e.wheelDelta,
     container = document.querySelector('svg .main-container'),
     scaleStep = delta > 0 ? 1.25 : 0.8;

   if (scale * scaleStep > maxScale) {
     scaleStep = maxScale / scale;
   }

   if (scale * scaleStep < minScale) {
     scaleStep = minScale / scale;
   }

   scale *= scaleStep;

   let box = svg.getBoundingClientRect();
   let point = svg.createSVGPoint();
   point.x = e.clientX - box.left;
   point.y = e.clientY - box.top;

   let currentZoomMatrix = container.getCTM();

   point = point.matrixTransform(currentZoomMatrix.inverse());

   let matrix = svg.createSVGMatrix()
     .translate(point.x, point.y)
     .scale(scaleStep)
     .translate(-point.x, -point.y);


   let newZoomMatrix = currentZoomMatrix.multiply(matrix);
   container.transform.baseVal.initialize(svg.createSVGTransformFromMatrix(newZoomMatrix));

   let t = newZoomMatrix;
 }

 document.querySelector('svg').addEventListener('mousedown', beginDrag);
 document.querySelector('svg').addEventListener('mousewheel', zoom);
 svg.addEventListener('mousemove', drag);
 window.addEventListener('mouseup', endDrag);
}


 
// EVENTLISTENERS ON COUNTRIES
 function countryEventlisteners() {
for (let index = 0; index < countryArray.length; index++) {
  const element = countryArray[index];
  element.addEventListener("mouseover", showCountryName);
  element.addEventListener("mouseout", hideCountryText);
  element.addEventListener("click", showPopup);
  element.style.cssText = `
  fill: rgb(42, 74, 58);
  cursor: pointer;
  transition: .2s;
  `;
}

// Display country names
function showCountryName() {
  let countryTitle = this.getAttribute("title");
  document.querySelector(".tooltiptext").innerHTML = `${countryTitle}`;
  document.querySelector(".tooltiptext").style.visibility = "visible";
  document.querySelector(".country-title").innerHTML = `${countryTitle}`;
  document.querySelector(".siteLink").innerHTML = `Se alle vine fra ${countryTitle}`;
  this.style.cssText = `
  fill: rgb(106, 168, 137);
  cursor: pointer;
  transition: .2s;
  `;
}

// Hide country text on mouseout
function hideCountryText() {
  document.querySelector(".tooltiptext").style.visibility = "hidden";
  this.style.cssText = `
  fill: rgb(42, 74, 58);
  cursor: pointer;
  transition: .2s;
  `;
}

// Country name follows cursor
let tooltip = document.querySelector('.tooltip');
const onMouseMove = (e) => {
  tooltip.style.left = e.pageX + 'px';
  tooltip.style.top = e.pageY + 'px';
}
document.addEventListener('mousemove', onMouseMove);
}



// EVENTLISTENERS ON AREAS
function areaEventlisteners() {
for (let index = 0; index < areaArray.length; index++) {
  const element = areaArray[index];
  element.addEventListener("mouseover", showAreaName);
  element.addEventListener("mouseout", hideAreaText);
  element.addEventListener("click", linkToAreaLandingpage);
  element.style.cssText = `
  fill: rgb(42, 74, 58);
  cursor: pointer;
  transition: .2s;
  `;
}

// Display area names
function showAreaName() {
  let areaTitle = this.getAttribute("title");
  document.querySelector(".tooltiptext").style.visibility = "visible";
  document.querySelector(".tooltiptext").innerHTML = `${areaTitle}`;
  this.style.cssText = `
  fill: rgb(106, 168, 137);
  cursor: pointer;
  transition: .2s;
  `;
}

// Hide area text on mouseout
function hideAreaText() {
  document.querySelector(".tooltiptext").style.visibility = "hidden";
  this.style.cssText = `
  fill: rgb(42, 74, 58);
  cursor: pointer;
  transition: .2s;
  `;
}

// Link to relevant area landingpage
function linkToAreaLandingpage() {
  let areaTitle = this.getAttribute("title").replace(/ô/g,"o");
  let getParent = this.parentElement.parentElement.parentElement.parentElement;
  let countryTitle = getParent.querySelector(".country-title").innerHTML;
  // Alternative link solution
  /* let lowerTitle = countryTitle.toLowerCase();
  let formattedTitle = lowerTitle.replace(/ /g,"-").replace(/æ/g,"ae").replace(/ø/g,"oe").replace(/å/g,"aa"); */

  if (areaTitle.includes(",")) {
    /* window.open(`https://philipsonwine.com/vin/lande/${formattedTitle}`); */
    window.open(`https://philipsonwine.com/vin/typer/alle-vine?Country=%5B${countryTitle}%5D`);
  } if (areaTitle.includes(" ")) {
    window.open(`https://philipsonwine.com/produkter?Search=${areaTitle}`);
  } else {
    /* window.open(`https://philipsonwine.com/vin/lande/${formattedTitle}?Region=%5B${areaTitle}%5D`); */
    window.open(`https://philipsonwine.com/vin/typer/alle-vine?Country=%5B${countryTitle}%5D&Region=%5B${areaTitle}%5D`);
    }
  }
}



// POPUP
function showPopup() {
  let popup = document.querySelector(".popup");
  let closeBtn = document.getElementsByClassName("close")[0];
  let countryTitle = this.getAttribute("title");
  let lowerTitle = countryTitle.toLowerCase();
  let formattedTitle = lowerTitle.replace(/ /g,"-").replace(/æ/g,"ae").replace(/ø/g,"oe").replace(/å/g,"aa");

  popup.style.display = "block";

  // Show country SVGs
  document.querySelector(`.svg-container .${formattedTitle}`).classList.remove("hide");

  // Set viewbox on countries
  let findSVG = document.querySelector(`.svg-container .${formattedTitle}`);
  findSVG.setAttribute("viewBox", "0 0 1000 1000");

  // Link to relevant landingpage on button
  document.querySelector(".siteLink").href = `https://philipsonwine.com/vin/typer/alle-vine?Country=%5B${countryTitle}%5D`;
  // Alternative link solution
  /* document.querySelector(".siteLink").href = `https://philipsonwine.com/vin/lande/${formattedTitle}`; */
    
    // close on x
    closeBtn.onclick = function() {
      popup.style.display = "none";
      document.querySelector(`.svg-container .${formattedTitle}`).classList.add("hide");
    }
    
    // close on click outside of box
    window.onclick = function(event) {
      if (event.target === popup) {
        popup.style.display = "none";
        document.querySelector(`.svg-container .${formattedTitle}`).classList.add("hide");
      }
    }
    
    // close on Esc
    window.onkeydown = function(event) {
      if (event.key === "Escape") {
        popup.style.display = "none";
        document.querySelector(`.svg-container .${formattedTitle}`).classList.add("hide");
      }
    }
}