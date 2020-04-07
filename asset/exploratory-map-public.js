!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("ExploratoryMap",[],t):"object"==typeof exports?exports.ExploratoryMap=t():e.ExploratoryMap=t()}(window,(function(){return function(e){var t={};function r(s){if(t[s])return t[s].exports;var a=t[s]={i:s,l:!1,exports:{}};return e[s].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(s,a,function(t){return e[t]}.bind(null,a));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}({"./asset/src/exploratory-map-public.js":
/*!*********************************************!*\
  !*** ./asset/src/exploratory-map-public.js ***!
  \*********************************************/
/*! no static exports found */function(e,t,r){r(/*! ./exploratory-map-public.scss */"./asset/src/exploratory-map-public.scss");class s{constructor(e={}){this.options=Object.assign({selector:".exploratory-map-block",color:"#0dae0b"},e),this.markers=[],this.bounds=[],this.sources={},this.layers={},this.overlays={},this.block=document.querySelector(this.options.selector),this.block||console.warn('No element matched the selector "'+this.options.selector+'"'),this.container=this.block.querySelector(".map-container"),this.type=this.block.dataset.mapType;let{basemap:t,accessToken:r}=this.block.dataset;this.block.removeAttribute("data-basemap"),this.block.removeAttribute("data-access-token"),this.forms=this.block.querySelectorAll(".layer-form"),mapboxgl.accessToken=r,this.map=new mapboxgl.Map({container:this.container,zoom:3}),this.map.on("load",this.handleMapLoad.bind(this)),this.map.on("style.load",this.handleStyleLoad.bind(this)),this.map.setStyle(t)}handleMapLoad(e){const t=this;this.map.on("mouseenter","markers",this.hoverMarker.bind(this)),this.map.on("mouseleave","markers",this.unhoverMarker.bind(this)),this.map.on("click","markers",this.clickMarker.bind(this)),this.block.querySelectorAll(".item").forEach((function(e,r){e.addEventListener("mousedown",t.clickItem.bind(t))})),this.block.querySelectorAll(".layer-form input").forEach((function(e,r){e.addEventListener("click",t.changeLayer.bind(t))}))}handleStyleLoad(e){Object.keys(this.layers).length?Object.keys(this.layers).forEach(e=>{if(!this.map.getSource(e)){const t=this.layers[e],r=this.sources[e],s=document.getElementById(e);s&&s.checked&&(t.layout.visibility="visible"),this.map.addSource(e,r),this.map.addLayer(t)}}):(this.addOverlays(),this.addMarkers())}changeLayer(e){const t=e.currentTarget,r=t.checked,s=t.parentElement,a=t.id,i=s.dataset.layerType,o=t.value;if("basemap"==i&&r&&this.map.setStyle(o),"overlay"==i&&Object.keys(this.overlays).forEach(e=>{this.overlays[e];a==e&&r?this.map.setLayoutProperty(e,"visibility","visible"):(document.getElementById(e).checked=!1,this.map.setLayoutProperty(e,"visibility","none"))}),"markers"==i){const e=s.querySelectorAll("input:checked"),t=Array.from(e).map(e=>e.value);this.map.setFilter("markers",["in","type"].concat(t))}}addOverlays(){const e=this;this.block.querySelectorAll("input[name='overlay']").forEach((function(t,r){let s=t.id,a=t.value,i=t.checked;if(!e.map.getSource(s+"")&&a){const r={type:"raster",url:t.value},a={id:s,source:s,type:"raster",layout:{visibility:i?"visible":"none"}};e.map.addSource(s,r),e.map.addLayer(a),e.overlays[s]=a,e.layers[s]=a,e.sources[s]=r}}))}addMarkers(){const e=this,t=this.block.dataset.markers,r=t?JSON.parse(t):null;if(console.log(this),this.block.removeAttribute("data-markers"),!r)return!1;this.sources.markers={type:"geojson",data:{type:"FeatureCollection",features:[]}};let s=new mapboxgl.LngLatBounds;r.forEach((function(t,r){let a=[];if(!t.coords)return;a=t.coords.split(",");let i={type:"Feature",properties:{description:t.caption?t.caption:"",title:t.title?t.title:"",index:Number.isInteger(r)?r+1:"",item:t.item?t.item:"",type:t.type?t.type:""},geometry:{type:"Point",coordinates:a}};e.sources.markers.data.features.push(i),e.markers.push(i),e.getMarkerData(i,t),s.extend(a)})),this.sources["hover-markers"]=this.sources.markers,this.map.addSource("markers",this.sources.markers),this.map.addSource("hover-markers",this.sources["hover-markers"]);let a=this.options.color;"layered"==this.type&&(a=["match",["get","type"],"Bomb Locations","#4357AD","Sexual Violence","#E58F65","Mass Graves","#98C1D9","Murder","#FFD25A","Other","#C45BAA",this.options.color]);const i={id:"markers",type:"circle",source:"markers",paint:{"circle-color":a,"circle-radius":["interpolate",["linear"],["zoom"],10,5,17,20],"circle-stroke-color":"rgba(255,255,255,.9)","circle-stroke-width":1.5}},o={id:"markers-hover",type:"symbol",source:"hover-markers",paint:{"text-color":"#000000","text-halo-color":"rgba(255,255,255,.9)","text-halo-width":1.5},layout:{"text-field":"{title}","text-size":["match",["get","type"],"Landmark",20,"",20,0],"text-font":["Open Sans Semibold","Arial Unicode MS Bold"],"text-offset":[0,.6],"text-anchor":"top"},filter:["==","index",""]};this.map.addLayer(i),this.map.addLayer(o),this.layers.markers=i,this.layers["hover-markers"]=o,this.map.fitBounds(s,{padding:{top:100,bottom:100,left:100,right:100},animate:!1}),this.bounds=s,this.block.classList.add("loaded")}resetMap(){this.closePanel(),this.map.fitBounds(this.bounds,{padding:{top:100,bottom:100,left:100,right:100},animate:!0})}flyTo(e){const t=this,r=this.block.querySelector(".item.current"),s=r?r.dataset.index:null;if(e&&parseInt(s)!==parseInt(e)){this.block.querySelector(".item[data-index='"+e+"']");let r=this.findItem(e),a=15,i=this.findPanel(e).offsetWidth+a,o=this.block.offsetWidth,n=o/2-(o-i)/2,l=r.dataset.markerCoords;if(r.classList.add("current"),l&&l.length){let r=JSON.parse(l);this.map.flyTo({center:r,speed:5,zoom:15}),this.map.once("moveend",(function(r){let a=t.map.getCenter();const i=t.map.project(a);i.x-=n,a=t.map.unproject(i),t.map.flyTo({center:a}),t.openPanel(e),s&&t.closePanel(s,!0)}))}}else{let e=this.block.querySelector(".item.hidden");e&&e.classList.add("current")}}clickArrow(e){let t,r=e.currentTarget.getAttribute("data-direction"),s=this.block.querySelectorAll(".item"),a=this.block.querySelector(".item.current");if(a?"next"===r?t=a.nextElementSibling:"prev"===r&&(t=a.previousElementSibling):t=s[0],t){let e=t.dataset.index;this.flyTo(e)}else this.resetMap()}clickItem(e){let t=e.currentTarget;if(t){let e=t.dataset.index;this.flyTo(e)}}getMarkerData(e,t){const r=this,s=t.item;$.ajax({type:"GET",dataType:"json",url:"/api/items/"+s,success:function(t){r.populatePopup(e,t),r.populatePanel(e,t)},error:function(e,t,r){console.log(e,t,r)}})}populatePopup(e,t){let r=document.createElement("div");r.classList.add("map-popup"),r.dataset.index=e.properties.index;let s=document.createElement("h4");s.innerText=e.properties.title,r.appendChild(s),this.container.appendChild(r),this.block.querySelector(".item[data-index='"+e.properties.index+"']").classList.add("ready")}populatePanel(e,t){const r=document.createElement("div");r.classList.add("map-panel"),r.dataset.index=e.properties.index;const s=document.createElement("header"),a=document.createElement("h2");a.innerText=e.properties.title;const i=document.createElement("div");i.classList.add("map-arrow"),i.dataset.direction="prev",i.addEventListener("mousedown",this.clickArrow.bind(this));const o=document.createElement("div");o.classList.add("map-arrow"),o.dataset.direction="next",o.addEventListener("mousedown",this.clickArrow.bind(this));let n=document.createElement("div");n.classList.add("panel-inner"),n.appendChild(a.cloneNode(!0));let l=document.createElement("div");l.classList.add("panel-scroll");let c=document.createElement("div");c.classList.add("panel-properties"),s.appendChild(a),s.appendChild(i),s.appendChild(o),r.appendChild(s),n.appendChild(c),l.appendChild(n),r.appendChild(l),this.container.appendChild(r);[["alternative","Alt Title"],["date","Date"],["description","Description"],["references","Referenced Items"],["mediator","Media"]].forEach((function(e,r){let s=e[0],a=e[1],i=t["dcterms:"+s];if(i){let e=document.createElement("div");e.classList.add("panel-property"),e.classList.add(s),document.createElement("div").innerText=a,i.forEach((function(t,r){if("resource:item"===t.type){const r=t.display_title,s=t["@id"].replace("api","home").replace("items","item");let a=document.createElement("a");if(a.href=s,a.target="_blank","Mediator"===t.property_label){const e=t.thumbnail_url,r=document.createElement("img");r.src=e,a.appendChild(r)}else a.innerText=r;e.appendChild(a)}else e.innerText+=t["@value"]})),e&&c.appendChild(e)}})),n.appendChild(c)}hoverMarker(e){let t=e.features[0],r=t.properties.index;this.map.getCanvas().style.cursor="pointer",this.map.setFilter("markers-hover",["==","index",t.properties.index]),this.openPopup(r)}unhoverMarker(e){this.map.getCanvas().style.cursor="",this.map.setFilter("markers-hover",["==","index",""]),this.closePopup()}openPopup(e){let t=this.findPopup(e);t&&t.classList.add("show")}closePopup(){let e=this.container.querySelector(".map-popup.show");e&&e.classList.remove("show")}clickMarker(e){let t=e.features[0].properties.index;this.flyTo(t)}openPanel(e){const t=this,r=this.findPanel(e);this.findPanel()&&r.classList.add("swap"),r.classList.add("show"),setTimeout((function(){r.classList.remove("swap"),t.map.once("click",(function(s){t.closePanel(e),r.classList.remove("show")}))}))}closePanel(e,t){let r=this.findPanel(e);r&&(t&&r.classList.add("swap"),r.classList.remove("show"),setTimeout((function(){r.classList.remove("swap")})));let s=this.findItem(e);s&&s.classList.remove("current")}findPanel(e){let t;return e&&(t=this.container.querySelector(".map-panel[data-index='"+e+"']")),t||(t=this.container.querySelector(".map-panel.show"),t||!1)}findPopup(e){let t=this.container.querySelector(".map-popup[data-index='"+e+"']");return!(!t||!t.length)&&t}findItem(e){let t=this.block.querySelector(".item[data-index='"+e+"']");return t||(t=this.block.querySelector(".item.current"),t||!1)}findMarker(e,t){}}window.onload=function(){new s({})}},"./asset/src/exploratory-map-public.scss":
/*!***********************************************!*\
  !*** ./asset/src/exploratory-map-public.scss ***!
  \***********************************************/
/*! no static exports found */function(e,t,r){},0:
/*!***************************************************!*\
  !*** multi ./asset/src/exploratory-map-public.js ***!
  \***************************************************/
/*! no static exports found */function(e,t,r){e.exports=r(/*! /Users/coreytegeler/Sites/mct.barnard.edu/modules/ExploratoryMap/asset/src/exploratory-map-public.js */"./asset/src/exploratory-map-public.js")}})}));