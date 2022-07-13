// Global
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
]

//Zoom and drag effect
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



 
 // Mouseover on countries
for (let index = 0; index < countryArray.length; index++) {
  const element = countryArray[index];
  element.addEventListener("mouseover", showName);
  element.addEventListener("mouseout", hideText);
}

// Display country names
function showName() {
  let getCountryName = this.getAttribute("title");
  document.querySelector(".tooltiptext").innerHTML = `${getCountryName}`;
  document.querySelector(".tooltiptext").style.visibility = "visible";
}

// Hide text on mouseout
function hideText() {
  document.querySelector(".tooltiptext").style.visibility = "hidden";
}

// Country name follows cursor
let tooltip = document.querySelector('.tooltip');
const onMouseMove = (e) =>{
  tooltip.style.left = e.pageX + 'px';
  tooltip.style.top = e.pageY + 'px';
}
document.addEventListener('mousemove', onMouseMove);

/* AmCharts.makeChart("map",{
  "type": "map",
  "pathToImages": "http://www.amcharts.com/lib/3/images/",
  "addClassNames": true,
  "fontSize": 15,
  "color": "#000000",
  "projection": "mercator",
  "backgroundAlpha": 1,
  "backgroundColor": "rgba(255,255,255,0.51)",
  "dataProvider": {
    "map": "worldLow",
    "getAreasFromMap": true,
    "images": [
      {
        "top": 40,
        "left": 60,
        "width": 80,
        "height": 40,
        "pixelMapperLogo": true,
        "imageURL": "http://pixelmap.amcharts.com/static/img/logo-black.svg",
        "url": "http://www.amcharts.com"
      }
    ]
  },
  "balloon": {
    "horizontalPadding": 15,
    "borderAlpha": 0,
    "borderThickness": 1,
    "verticalPadding": 15
  },
  "areasSettings": {
    "color": "rgb(201, 201, 201)",
    "outlineColor": "rgba(255,255,255,0.51)",
    "rollOverOutlineColor": "rgba(255,255,255,0.51)",
    "rollOverBrightness": 20,
    "selectedBrightness": 20,
    "selectable": false,
    "unlistedAreasAlpha": 0,
    "unlistedAreasOutlineAlpha": 0
  },
  "imagesSettings": {
    "alpha": 1,
    "color": "rgb(201, 201, 201)",
    "outlineAlpha": 0,
    "rollOverOutlineAlpha": 0,
    "outlineColor": "rgba(255,255,255,0.51)",
    "rollOverBrightness": 20,
    "selectedBrightness": 20,
    "selectable": true
  },
  "linesSettings": {
    "color": "rgb(201, 201, 201)",
    "selectable": true,
    "rollOverBrightness": 20,
    "selectedBrightness": 20
  },
  "zoomControl": {
    "zoomControlEnabled": true,
    "homeButtonEnabled": true,
    "panControlEnabled": false,
    "right": 38,
    "bottom": 30,
    "minZoomLevel": 0.25,
    "gridHeight": 100,
    "gridAlpha": 0.1,
    "gridBackgroundAlpha": 0,
    "gridColor": "#FFFFFF",
    "draggerAlpha": 1,
    "buttonCornerRadius": 2
  }
}); */