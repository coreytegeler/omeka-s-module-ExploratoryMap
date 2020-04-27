!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("ExploratoryMap",[],t):"object"==typeof exports?exports.ExploratoryMap=t():e.ExploratoryMap=t()}(window,(function(){return function(e){var t={};function s(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,s),a.l=!0,a.exports}return s.m=e,s.c=t,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(r,a,function(t){return e[t]}.bind(null,a));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=0)}({"./asset/src/exploratory-map.js":
/*!**************************************!*\
  !*** ./asset/src/exploratory-map.js ***!
  \**************************************/
/*! no static exports found */function(e,t,s){s(/*! ./exploratory-map.scss */"./asset/src/exploratory-map.scss");class r{constructor(e={}){this.options=Object.assign({selector:".exploratory-map-block",color:"#0dae0b"},e),this.markers=[],this.bounds=[],this.sources={},this.layers={},this.overlays={},this.block=document.querySelector(this.options.selector),this.block||console.warn('No element matched the selector "'+this.options.selector+'"'),this.container=this.block.querySelector(".map-container"),this.type=this.block.dataset.mapType;let{basemap:t,accessToken:s}=this.block.dataset;this.block.removeAttribute("data-basemap"),this.block.removeAttribute("data-access-token"),this.forms=this.block.querySelectorAll(".layer-form"),this.colors={},mapboxgl.accessToken=s,this.map=new mapboxgl.Map({container:this.container,zoom:3}),this.map.on("load",this.handleMapLoad.bind(this)),this.map.on("style.load",this.handleStyleLoad.bind(this)),this.map.setStyle(t);const r=this.block.querySelector(".sort-list");if(r){new List(r,{valueNames:["title","date","type"]}).sort("date",{order:"asc"})}}handleMapLoad(e){const t=this;this.map.on("mouseenter","markers",this.hoverMarker.bind(this)),this.map.on("mouseleave","markers",this.unhoverMarker.bind(this)),this.map.on("click","markers",this.clickMarker.bind(this)),this.map.on("click",this.clickMap.bind(this)),this.block.querySelectorAll(".item").forEach((function(e,s){e.addEventListener("mousedown",t.clickItem.bind(t))})),this.block.querySelectorAll(".layer-form input").forEach((function(e,s){e.addEventListener("click",t.changeLayer.bind(t))}))}handleStyleLoad(e){Object.keys(this.layers).length?Object.keys(this.layers).forEach(e=>{if(!this.map.getSource(e)){const t=this.layers[e],s=this.sources[e],r=document.getElementById(e);r&&r.checked&&(t.layout.visibility="visible"),this.map.addSource(e,s),this.map.addLayer(t)}}):(this.addOverlays(),this.addMarkers())}changeLayer(e){const t=e.currentTarget,s=t.checked,r=t.parentElement,a=t.id,o=r.dataset.layerType,i=t.value;if("basemap"==o&&s&&this.map.setStyle(i),"overlay"==o&&Object.keys(this.overlays).forEach(e=>{this.overlays[e];a==e&&s?this.map.setLayoutProperty(e,"visibility","visible"):(document.getElementById(e).checked=!1,this.map.setLayoutProperty(e,"visibility","none"))}),"markers"==o){const e=r.querySelectorAll("input:checked"),t=Array.from(e).map(e=>e.value);this.map.setFilter("markers",["in","type"].concat(t))}}addOverlays(){const e=this;this.block.querySelectorAll("input[name='overlay']").forEach((function(t,s){let r=t.id,a=t.value,o=t.checked;if(!e.map.getSource(r+"")&&a){const s={type:"raster",url:t.value},a={id:r,source:r,type:"raster",layout:{visibility:o?"visible":"none"}};e.map.addSource(r,s),e.map.addLayer(a),e.overlays[r]=a,e.layers[r]=a,e.sources[r]=s}}))}addMarkers(){const e=this,t=this.block.dataset.markers,s=t?JSON.parse(t):null;if(this.block.removeAttribute("data-markers"),!s)return!1;this.sources.markers={type:"geojson",data:{type:"FeatureCollection",features:[]}};let r=new mapboxgl.LngLatBounds;s.forEach((function(t,s){const{lng:a,lat:o,caption:i,title:n,item:l,type:c}=t;let d={type:"Feature",properties:{description:i||"",title:n||"",index:Number.isInteger(s)?s+1:"",item:l||"",type:c||""}};isNaN(a)||isNaN(o)||(d.geometry={type:"Point",coordinates:[a,o]},e.sources.markers.data.features.push(d),r.extend([a,o])),e.markers.push(d),e.getMarkerData(d,l)})),this.sources["markers-labels"]=this.sources.markers,this.map.addSource("markers",this.sources.markers),this.map.addSource("markers-labels",this.sources["markers-labels"]);let a=this.options.color;"layered"==this.type&&(a=["match",["get","type"]],this.block.querySelectorAll(".layer-filter input").forEach((function(t,s){const r=t.getAttribute("id"),a=r?e.block.querySelector("[for='"+r+"']"):null,o=t?t.value:null,i=a?window.getComputedStyle(a).color:null;o&&o&&(e.colors[o]=i)})),Object.keys(this.colors).forEach(e=>{const t=this.colors[e];a.push(e),a.push(t)}),a.push(this.options.color));let o=["interpolate",["linear"],["zoom"],10,5,17,8];o=["match",["get","type"],"Landmarks",5,8];const i={id:"markers",type:"circle",source:"markers",paint:{"circle-color":a,"circle-radius":o,"circle-stroke-color":"rgba(255,255,255,.9)","circle-stroke-width":1.5}},n={id:"markers-labels",type:"symbol",source:"markers-labels",minzoom:13,paint:{"text-color":"#000000","text-halo-color":"rgba(255,255,255,.9)","text-halo-width":1.5},layout:{"text-field":"{title}","text-size":["match",["get","type"],"Landmarks",15,"",15,0],"text-font":["Open Sans Semibold","Arial Unicode MS Bold"],"text-offset":[0,.6],"text-anchor":"top"}};this.map.addLayer(i),this.map.addLayer(n),this.layers.markers=i,this.layers["markers-labels"]=n,this.map.fitBounds(r,{padding:{top:100,bottom:100,left:100,right:100},animate:!1}),this.bounds=r,this.block.classList.add("loaded")}resetMap(){this.closePanel(),this.map.fitBounds(this.bounds,{padding:{top:100,bottom:100,left:100,right:100},animate:!0})}flyTo(e){const t=this,s=this.block.querySelector(".item.current"),r=s?s.dataset.index:null;if(e&&parseInt(r)!==parseInt(e)){let s=this.findItem(e),a=15,o=this.findPanel(e).offsetWidth+a,i=this.block.offsetWidth,n=i/2-(i-o)/2,l=s.dataset.lng,c=s.dataset.lat;if(s.classList.add("current"),!isNaN(l)&&!isNaN(c)){let s=[l,c];s?(this.map.flyTo({center:s,speed:5,zoom:15}),this.map.once("moveend",(function(s){let a=t.map.getCenter();const o=t.map.project(a);o.x-=n,a=t.map.unproject(o),t.map.flyTo({center:a}),t.openPanel(e),r&&t.closePanel(r,!0)}))):(t.openPanel(e),r&&t.closePanel(r,!0))}}else{let e=this.block.querySelector(".item.hidden");e&&e.classList.add("current")}}clickArrow(e){if(!this.block.classList.contains("loaded"))return;let t,s=e.currentTarget.getAttribute("data-direction"),r=this.block.querySelectorAll(".item"),a=this.block.querySelector(".item.current");if(a?"next"===s?t=a.nextElementSibling:"prev"===s&&(t=a.previousElementSibling):t=r[0],t){let e=t.dataset.index;this.flyTo(e)}else this.resetMap()}clickItem(e){let t=e.currentTarget;if(this.block.classList.contains("loaded")&&t){let e=t.dataset.index;this.flyTo(e)}}getMarkerData(e,t){const s=this;$.ajax({type:"GET",dataType:"json",url:"/api/items/"+t,success:function(t){s.populatePanel(e,t)},error:function(e,t,s){console.log(e,t,s)}})}populatePanel(e,t){const s=document.createElement("div");s.classList.add("map-panel"),s.dataset.index=e.properties.index;const r=document.createElement("header"),a=document.createElement("h2");if(a.innerText=e.properties.title,r.appendChild(a),"story"===this.type){const e=document.createElement("div");e.classList.add("map-arrow"),e.dataset.direction="prev",e.addEventListener("mousedown",this.clickArrow.bind(this));const t=document.createElement("div");t.classList.add("map-arrow"),t.dataset.direction="next",t.addEventListener("mousedown",this.clickArrow.bind(this)),r.appendChild(e),r.appendChild(t)}let o=document.createElement("div");o.classList.add("panel-inner"),o.appendChild(a.cloneNode(!0));let i=document.createElement("div");i.classList.add("panel-scroll");let n=document.createElement("div");n.classList.add("panel-properties"),s.appendChild(r),o.appendChild(n),i.appendChild(o),s.appendChild(i),this.container.appendChild(s);[["alternative","Alt Title"],["date","Date"],["description","Description"],["references","Referenced Items"],["mediator","Media"]].forEach((function(e,s){let r=e[0],a=e[1],o=t["dcterms:"+r];if(o){let e=document.createElement("div");e.classList.add("panel-property"),e.classList.add(r),document.createElement("div").innerText=a,o.forEach((function(t,s){if("resource:item"===t.type){const s=t.display_title,r=t["@id"].replace("api","home").replace("items","item");let a=document.createElement("a");if(a.href=r,a.target="_blank","Mediator"===t.property_label){const e=t.thumbnail_url,s=document.createElement("img");s.src=e,a.appendChild(s)}else a.innerText=s;e.appendChild(a)}else{let s=t["@value"];if("date"==r){const e=new Date(s),t=["January","February","March","April","May","June","July","August","September","October","November","December"],r=e.getUTCMonth(),a=e.getUTCDate(),o=e.getUTCFullYear();e.toString("dddd, MMMM ,yyyy");s=`${t[r]} ${a}, ${o}`}e.innerText+=s}})),e&&n.appendChild(e)}})),o.appendChild(n)}hoverMarker(e){this.map.getCanvas().style.cursor="pointer"}unhoverMarker(e){this.map.getCanvas().style.cursor=""}clickMarker(e){let t=e.features[0].properties.index;this.flyTo(t)}clickMap(e){const{lngLat:t}=e;console.log("Coordinates:",t.lat+", "+t.lng)}openPanel(e){const t=this,s=this.findPanel(e);this.findPanel()&&s.classList.add("swap"),s.classList.add("show"),setTimeout((function(){s.classList.remove("swap"),t.map.once("click",(function(r){t.closePanel(e),s.classList.remove("show")}))}))}closePanel(e,t){let s=this.findPanel(e);s&&(t&&s.classList.add("swap"),s.classList.remove("show"),setTimeout((function(){s.classList.remove("swap")})));let r=this.findItem(e);r&&r.classList.remove("current")}findPanel(e){let t;return e&&(t=this.container.querySelector(".map-panel[data-index='"+e+"']")),t||(t=this.container.querySelector(".map-panel.show"),t||!1)}findItem(e){let t=this.block.querySelector(".item[data-index='"+e+"']");return t||(t=this.block.querySelector(".item.current"),t||!1)}findMarker(e,t){}}window.onload=function(){new r({})}},"./asset/src/exploratory-map.scss":
/*!****************************************!*\
  !*** ./asset/src/exploratory-map.scss ***!
  \****************************************/
/*! no static exports found */function(e,t,s){},0:
/*!********************************************!*\
  !*** multi ./asset/src/exploratory-map.js ***!
  \********************************************/
/*! no static exports found */function(e,t,s){e.exports=s(/*! /Users/coreytegeler/Sites/mct.barnard.edu/modules/ExploratoryMap/asset/src/exploratory-map.js */"./asset/src/exploratory-map.js")}})}));