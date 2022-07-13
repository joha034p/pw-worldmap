// GLOBAL
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

//ZOOM AND DRAG
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



 
 // EVENTLISTENERS ON COUNTRIES
for (let index = 0; index < countryArray.length; index++) {
  const element = countryArray[index];
  element.addEventListener("mouseover", showName);
  element.addEventListener("mouseout", hideText);
  element.addEventListener("click", showPopup);
}

// Display country names
function showName() {
  let countryTitle = this.getAttribute("title");
  document.querySelector(".tooltiptext").innerHTML = `${countryTitle}`;
  document.querySelector(".tooltiptext").style.visibility = "visible";
  document.querySelector(".country-title").innerHTML = `${countryTitle}`;
  document.querySelector(".siteLink").innerHTML = `Se alle vine fra ${countryTitle}`;
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




// POPUP
function showPopup() {
  let popup = document.querySelector(".popup");
  let closeBtn = document.getElementsByClassName("close")[0];
  let countryTitle = this.getAttribute("title");
  let lowerTitle = countryTitle.toLowerCase();
  let formattedTitle = lowerTitle.replace(/ /g,"-").replace(/æ/g,"ae").replace(/ø/g,"oe").replace(/å/g,"aa");
  let img = document.querySelector(".svgfile");
  popup.style.display = "block";

  img.src = `img/${formattedTitle}.svg`;

  document.querySelector(".siteLink").href = `https://philipsonwine.com/vin/lande/${formattedTitle}`;
    
    // close on x
    closeBtn.onclick = function() {
      popup.style.display = "none";
    }
    
    // close on click outside of box
    window.onclick = function(event) {
      if (event.target === popup) {
        popup.style.display = "none";
      }
    }
    
    // close on Esc
    window.onkeydown = function(event) {
      if (event.key === "Escape") {
        popup.style.display = "none";
      }
    }
  }
    
    