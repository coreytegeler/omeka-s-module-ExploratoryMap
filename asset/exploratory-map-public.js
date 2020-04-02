!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("ExploratoryMap",[],t):"object"==typeof exports?exports.ExploratoryMap=t():e.ExploratoryMap=t()}(window,(function(){return function(e){var t={};function r(i){if(t[i])return t[i].exports;var s=t[i]={i:i,l:!1,exports:{}};return e[i].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=e,r.c=t,r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(i,s,function(t){return e[t]}.bind(null,s));return i},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}({"./asset/src/exploratory-map-public.js":
/*!*********************************************!*\
  !*** ./asset/src/exploratory-map-public.js ***!
  \*********************************************/
/*! no static exports found */function(e,t,r){r(/*! ./exploratory-map-public.scss */"./asset/src/exploratory-map-public.scss");class i{constructor(e={}){this.options=Object.assign({selector:".exploratory-map-block",color:"#0dae0b"},e),this.markers=[],this.bounds=[],this.sources={},this.layers={},this.overlays={},this.block=document.querySelector(this.options.selector),this.block||console.warn('No element matched the selector "'+this.options.selector+'"'),this.container=this.block.querySelector(".map-container");let{basemap:t,accessToken:r}=this.block.dataset;this.block.removeAttribute("data-basemap"),this.block.removeAttribute("data-access-token"),this.forms=this.block.querySelectorAll(".layer-form"),mapboxgl.accessToken=r,this.map=new mapboxgl.Map({container:this.container,zoom:3}),this.map.on("load",this.handleMapLoad.bind(this)),this.map.on("style.load",this.handleStyleLoad.bind(this)),this.map.setStyle(t)}handleMapLoad(e){const t=this;this.map.on("mouseenter","markers",this.hoverMarker.bind(this)),this.map.on("mouseleave","markers",this.unhoverMarker.bind(this)),this.map.on("click","markers",this.clickMarker.bind(this)),this.block.querySelectorAll(".map-arrow").forEach((function(e,r){e.addEventListener("mousedown",t.clickArrow.bind(t))})),this.block.querySelectorAll(".item").forEach((function(e,r){e.addEventListener("mousedown",t.clickItem.bind(t))})),this.block.querySelectorAll(".layer-form input").forEach((function(e,r){e.addEventListener("click",t.changeLayer.bind(t))}))}handleStyleLoad(e){Object.keys(this.layers).length?Object.keys(this.layers).forEach(e=>{if(!this.map.getSource(e)){const t=this.layers[e],r=this.sources[e],i=document.getElementById(e);i&&i.checked&&(t.layout.visibility="visible"),this.map.addSource(e,r),this.map.addLayer(t)}}):(this.addOverlays(),this.addMarkers())}changeLayer(e){const t=e.target,r=t.checked,i=t.parentElement,s=t.id,a=i.dataset.layerType,o=t.value;if("basemap"==a&&r&&this.map.setStyle(o),"overlay"==a&&Object.keys(this.overlays).forEach(e=>{this.overlays[e];s==e&&r?this.map.setLayoutProperty(e,"visibility","visible"):(document.getElementById(e).checked=!1,this.map.setLayoutProperty(e,"visibility","none"))}),"markers"==a){const e=i.querySelectorAll("input:checked"),t=Array.from(e).map(e=>e.value);this.map.setFilter("markers",["in","type"].concat(t))}}addOverlays(){const e=this;this.block.querySelectorAll("input[name='overlay']").forEach((function(t,r){let i=t.id,s=t.value,a=t.checked;if(!e.map.getSource(i+"")&&s){const r={type:"raster",url:t.value},s={id:i,source:i,type:"raster",layout:{visibility:a?"visible":"none"}};e.map.addSource(i,r),e.map.addLayer(s),e.overlays[i]=s,e.layers[i]=s,e.sources[i]=r}}))}addMarkers(){const e=this,t=this.block.dataset.markers,r=t?JSON.parse(t):null;if(this.block.removeAttribute("data-markers"),!r)return!1;this.sources.markers={type:"geojson",data:{type:"FeatureCollection",features:[]}};let i=new mapboxgl.LngLatBounds;r.forEach((function(t,r){let s=t.location,a=s["o-module-mapping:lat"],o=[s["o-module-mapping:lng"],a],n={type:"Feature",properties:{description:t.caption?t.caption:"",title:t.title?t.title:"",index:Number.isInteger(r)?r+1:"",item:t.item?t.item:"",type:t.type?t.type:""},geometry:{type:"Point",coordinates:o}};e.sources.markers.data.features.push(n),e.markers.push(n),e.getMarkerData(n,t),i.extend(o)})),this.sources["hover-markers"]=this.sources.markers,this.map.addSource("markers",this.sources.markers),this.map.addSource("hover-markers",this.sources["hover-markers"]);let s={id:"markers",type:"circle",source:"markers",paint:{"circle-color":this.options.color,"circle-radius":10,"circle-stroke-color":"rgba(255,255,255,.9)","circle-stroke-width":1.5}},a={id:"markers-hover",type:"symbol",source:"hover-markers",layout:{"text-field":"{title}","text-size":25,"text-font":["Open Sans Semibold","Arial Unicode MS Bold"],"text-offset":[0,.6],"text-anchor":"top"},paint:{"text-color":"#000000","text-halo-color":"rgba(255,255,255,.9)","text-halo-width":1.5},filter:["==","index",""]};this.map.addLayer(s),this.map.addLayer(a),this.layers.markers=s,this.layers["hover-markers"]=a,this.map.fitBounds(i,{padding:{top:100,bottom:100,left:100,right:100},animate:!1}),this.bounds=i,this.block.classList.add("loaded")}resetMap(){this.closePanel(),this.map.fitBounds(this.bounds,{padding:{top:100,bottom:100,left:100,right:100},animate:!0})}flyTo(e){const t=this,r=this.block.querySelector(".item.current"),i=r?r.dataset.index:null;if(r&&(r.classList.remove("current"),this.closePanel()),e&&parseInt(i)!==parseInt(e)){this.block.querySelector(".item[data-index='"+e+"']");let r=this.findItem(e),i=15,s=this.findPanel(e).offsetWidth+i,a=this.block.offsetWidth,o=a/2-(a-s)/2,n=r.dataset.markerCoords;if(r.classList.add("current"),n&&n.length){let r=JSON.parse(n);this.map.flyTo({center:r,speed:5,zoom:8}),this.map.once("moveend",(function(r){let i=t.map.getCenter(),s=t.map.project(i);s.x-=o,i=t.map.unproject(s),t.map.flyTo({center:i}),t.openPanel(e)}))}}else{let e=this.block.querySelector(".item.hidden");e&&e.classList.add("current")}}clickArrow(e){let t,r=e.target.getAttribute("data-direction"),i=this.block.querySelectorAll(".item"),s=this.block.querySelector(".item.current");if(s?"next"===r?t=s.nextElementSibling:"prev"===r&&(t=s.previousElementSibling):t=i[0],t){let e=t.dataset.index;this.flyTo(e)}else this.resetMap()}clickItem(e){let t=e.target;if(t){let e=t.dataset.index;this.flyTo(e)}}getMarkerData(e,t){const r=this,i=t.location["o:item"]["@id"];$.ajax({type:"GET",dataType:"json",url:i,success:function(t){r.populatePopup(e,t),r.populatePanel(e,t)},error:function(e,t,r){console.log(e,t,r)}})}populatePopup(e,t){let r=document.createElement("div");r.classList.add("map-popup"),r.dataset.index=e.properties.index;let i=document.createElement("h4");i.innerText=e.properties.title,r.appendChild(i),this.container.appendChild(r),this.block.querySelector(".item[data-index='"+e.properties.index+"']").classList.add("ready")}populatePanel(e,t){const r=document.createElement("div");r.classList.add("map-panel"),r.dataset.index=e.properties.index;const i=document.createElement("header"),s=document.createElement("h2");s.innerText=e.properties.title;const a=document.createElement("div");a.classList.add("map-arrow"),a.dataset.direction="prev",a.addEventListener("mousedown",this.clickArrow.bind(this));const o=document.createElement("div");o.classList.add("map-arrow"),o.dataset.direction="next",o.addEventListener("mousedown",this.clickArrow.bind(this));let n=document.createElement("div");n.classList.add("panel-inner"),n.appendChild(s.cloneNode(!0));let l=document.createElement("div");l.classList.add("panel-scroll");let c=document.createElement("div");c.classList.add("panel-properties"),i.appendChild(s),i.appendChild(a),i.appendChild(o),r.appendChild(i),n.appendChild(c),l.appendChild(n),r.appendChild(l),this.container.appendChild(r);[["alternative","Alt Title"],["date","Date"],["description","Description"],["references","Referenced Items"],["mediator","Media"]].forEach((function(e,r){let i=e[0],s=e[1],a=t["dcterms:"+i];if(a){let e=document.createElement("div");e.classList.add("panel-property"),e.classList.add(i),document.createElement("div").innerText=s,a.forEach((function(t,r){if("resource:item"===t.type){const r=t.display_title,i=t["@id"].replace("api","home").replace("items","item");let s=document.createElement("a");if(s.href=i,s.target="_blank","Mediator"===t.property_label){src=t.thumbnail_url;let e=document.createElement("img");e.src=src,s.appendChild(e)}else s.innerText=r;e.appendChild(s)}else e.innerText+=t["@value"]})),e&&c.appendChild(e)}})),n.appendChild(c)}hoverMarker(e){let t=e.features[0],r=t.properties.index;this.map.getCanvas().style.cursor="pointer",this.map.setFilter("markers-hover",["==","index",t.properties.index]),this.openPopup(r)}unhoverMarker(e){this.map.getCanvas().style.cursor="",this.map.setFilter("markers-hover",["==","index",""]),this.closePopup()}openPopup(e){let t=this.findPopup(e);t&&t.classList.add("show")}closePopup(){let e=this.container.querySelector(".map-popup");e&&e.classList.remove("show")}clickMarker(e){let t=e.features[0].properties.index;this.flyTo(t)}openPanel(e){const t=this,r=this.findPanel(e);r.classList.add("show"),setTimeout((function(){t.map.once("click",(function(e){r.classList.remove("show")}))}))}closePanel(){let e=this.findPanel();e&&e.classList.remove("show");let t=this.findItem();t&&t.classList.remove("current")}findPanel(e){let t=this.container.querySelector(".map-panel[data-index='"+e+"']");return t||(t=this.container.querySelector(".map-panel.show"),t||!1)}findPopup(e){let t=this.container.querySelector(".map-popup[data-index='"+e+"']");return!(!t||!t.length)&&t}findItem(e){let t=this.block.querySelector(".item[data-index='"+e+"']");return t||(t=this.block.querySelector(".item.current"),t||!1)}findMarker(e,t){}}window.onload=function(){new i({})}},"./asset/src/exploratory-map-public.scss":
/*!***********************************************!*\
  !*** ./asset/src/exploratory-map-public.scss ***!
  \***********************************************/
/*! no static exports found */function(e,t,r){},0:
/*!***************************************************!*\
  !*** multi ./asset/src/exploratory-map-public.js ***!
  \***************************************************/
/*! no static exports found */function(e,t,r){e.exports=r(/*! /Users/coreytegeler/Sites/mct.barnard.edu/modules/ExploratoryMap/asset/src/exploratory-map-public.js */"./asset/src/exploratory-map-public.js")}})}));