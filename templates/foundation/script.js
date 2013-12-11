window.onload = function() {
  
  //  Accordion hide/show
  var accordionTitles = document.getElementsByClassName('accordion-title');

  //  Convert node list to array
  Array.prototype.slice.call(accordionTitles).forEach(function(title){

    title.onclick = function() { 
      var content = next(title),
          style = window.getComputedStyle(content),
          display = style.getPropertyValue('display');

      if (display === 'block') {
        content.style.display = 'none';
      } else {
        content.style.display = 'block';
      }
      return false; 
    }
  });

  //  Get app version
  var oReq = new XMLHttpRequest();
  oReq.onload = function() {
    var response = JSON.parse(this.responseText);

    document.getElementById("appVersion").innerHTML = response.version;
    document.getElementById("since").innerHTML = "Built " + response.since;
  }
  oReq.open("get", "build", true);
  oReq.send();
};

/* 
   Credit to John Resig for this function 
   taken from Pro JavaScript techniques 
*/
function next(elem) {
    do {
        elem = elem.nextSibling;
    } while (elem && elem.nodeType !== 1);
    return elem;        
}