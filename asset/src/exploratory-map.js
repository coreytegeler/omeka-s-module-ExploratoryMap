require("./exploratory-map.scss");

class ExploratoryMap {
	constructor(userOpts = {}) {
		const self = this;
		let defaultOpts = {
			selector: ".exploratory-map-block",
			color: "#0dae0b"
		}
		this.options = Object.assign(defaultOpts, userOpts);

		this.markers = [];
		this.bounds = [];
		this.sources = {};
		this.layers = {};
		this.overlays = {};
		this.block = document.querySelector(this.options.selector);
		if(!this.block) {
			console.warn("No element matched the selector \""+this.options.selector+"\"");
		}
		this.container = this.block.querySelector(".map-container");
		this.type = this.block.dataset.mapType;

		let { basemap, accessToken } = this.block.dataset;

		this.block.removeAttribute("data-basemap");
		this.block.removeAttribute("data-access-token");

		this.forms = this.block.querySelectorAll(".layer-form");

		mapboxgl.accessToken = accessToken;
		this.map = new mapboxgl.Map({
		  container: this.container,
		  zoom: 3
		});
		this.map.on("load", self.handleMapLoad.bind(self));
		this.map.on("style.load", self.handleStyleLoad.bind(self));
		this.map.setStyle(basemap);
	}

	handleMapLoad(e) {
		const self = this;
		this.map.on('mouseenter', "markers", this.hoverMarker.bind(this));
		this.map.on('mouseleave', "markers", this.unhoverMarker.bind(this));
		this.map.on("click", "markers", this.clickMarker.bind(this));

		this.block.querySelectorAll(".item").forEach(function(item, i) {
			item.addEventListener("mousedown", self.clickItem.bind(self));
		});

		this.block.querySelectorAll(".layer-form input").forEach(function(form, i) {
			form.addEventListener('click', self.changeLayer.bind(self));
		});
	}

	handleStyleLoad(e) {
		if(!Object.keys(this.layers).length) {
			this.addOverlays();
			this.addMarkers();
		} else {

			Object.keys(this.layers).forEach((layerID) => {
				if(!this.map.getSource(layerID)) {
					const layer = this.layers[layerID],
								source = this.sources[layerID],
								input = document.getElementById(layerID);
					if(input && input.checked) {
						layer.layout.visibility = "visible";
					}
					this.map.addSource(layerID, source);
					this.map.addLayer(layer);
				}
			});
		}
	}

	changeLayer(e) {
		const self = this,
					input = e.currentTarget,
					checked = input.checked,
					form = input.parentElement,
					layerID = input.id,
					sourceID = layerID + "",
					layerType = form.dataset.layerType,
					value = input.value;

		if(layerType == "basemap") {
			if(checked) {
				this.map.setStyle(value);
			}
		}
		if(layerType == "overlay") {
			Object.keys(this.overlays).forEach((thisID) => {
				const layer = this.overlays[thisID];
				if(layerID == thisID && checked) {
					this.map.setLayoutProperty(thisID, 'visibility', 'visible');
				} else {
					document.getElementById(thisID).checked = false;
					this.map.setLayoutProperty(thisID, 'visibility', 'none');
				}
			});
		}
		if(layerType == "markers") {
			const checkedInputs = form.querySelectorAll("input:checked"),
						checkedValues = Array.from(checkedInputs).map((input) => input.value);
			this.map.setFilter("markers", ["in", "type"].concat(checkedValues));
		}
		
	}

	addOverlays() {
		const self = this,
					checkboxes = this.block.querySelectorAll("input[name='overlay']");
		checkboxes.forEach(function(checkbox, index) {
			let layerID = checkbox.id,
					value = checkbox.value,
					checked = checkbox.checked,
					overlaySource = self.map.getSource(layerID + "");
			if(!overlaySource && value) {
				const overlaySource = {
					"type": "raster",
					"url": checkbox.value
				};

				const overlayLayer = {
					"id": layerID,
					"source": layerID,
					"type": "raster",
					"layout": {
						"visibility": checked ? "visible" : "none"
					}
				}

				self.map.addSource(layerID, overlaySource);
				self.map.addLayer(overlayLayer);
				// const overlayLayer = self.map.getLayer(layerID);
				self.overlays[layerID] = overlayLayer;
				self.layers[layerID] = overlayLayer;
				self.sources[layerID] = overlaySource;
			}
		});
	}


	addMarkers() {
		const self = this,
				markersStr = this.block.dataset.markers,
				markersJSON = markersStr ? JSON.parse(markersStr) : null;
		console.log(this);
		this.block.removeAttribute("data-markers");
		if(!markersJSON) {
			return false;
		}

		this.sources["markers"] = {
			"type": "geojson",
			"data": {
				"type": "FeatureCollection",
				"features": []
			}
		};

		let mapBounds = new mapboxgl.LngLatBounds();
		markersJSON.forEach(function(markerObj, index) {
			let coords = [];
			if(markerObj["coords"]) {
				coords = markerObj["coords"].split(",");
			} else {
				return;
			}
			let marker = {
				"type": "Feature",
				"properties": {
					"description": markerObj.caption ? markerObj.caption : "",
					"title": markerObj.title ? markerObj.title : "",
					"index": Number.isInteger(index) ? index + 1 : "",
					"item": markerObj["item"] ? markerObj["item"] : "",
					"type": markerObj["type"] ? markerObj["type"] : ""
				},
				"geometry": {
					"type": 'Point',
					"coordinates": coords
				}
			};
			self.sources["markers"].data.features.push(marker);
			self.markers.push(marker);
			self.getMarkerData(marker, markerObj);
			mapBounds.extend(coords);
		});

		this.sources["hover-markers"] = this.sources["markers"];

		this.map.addSource("markers", this.sources["markers"]);
	  this.map.addSource("hover-markers", this.sources["hover-markers"]);


	  let circleColor = this.options.color;
	  
	  if(this.type == "layered") {
		  circleColor = [
				"match",
				["get", "type"],
				"Bomb Locations", "#4357AD",
				"Sexual Violence", "#E58F65",
				"Mass Graves", "#98C1D9",
				"Murder", "#FFD25A",
				"Other", "#C45BAA",
				this.options.color
			];

			
		}

		const markersLayer = {
			"id": "markers",
			"type": "circle",
			"source": "markers",
			"paint": {
				"circle-color": circleColor,
				"circle-radius": [
					"interpolate",
					["linear"],
					["zoom"],
					10, 5,
					17, 20
				],
				"circle-stroke-color": "rgba(255,255,255,.9)",
				"circle-stroke-width": 1.5
			}
		};

		const hoverMarkersLayer = {
			"id": "markers-hover",
			"type": "symbol",
			"source": "hover-markers",
			"paint": {
				"text-color": "#000000",
				"text-halo-color": "rgba(255,255,255,.9)",
				"text-halo-width": 1.5,
			},
			"layout": {
				"text-field": "{title}",
				"text-size": [
					"match",
					["get", "type"],
					"Landmark", 20,
					"", 20,
					0
				],
				"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
				"text-offset": [0, 0.6],
				"text-anchor": "top",
			},
			"filter": ["==", "index", ""]
		};
	
		this.map.addLayer(markersLayer);
		this.map.addLayer(hoverMarkersLayer);
		this.layers["markers"] = markersLayer;
		this.layers["hover-markers"] = hoverMarkersLayer;

		this.map.fitBounds(mapBounds, {
			padding: {
				top: 100,
				bottom: 100,
				left: 100,
				right: 100
			},
			animate: false
		});
		this.bounds = mapBounds;
		this.block.classList.add("loaded");
	};

	resetMap() {
		this.closePanel();
		this.map.fitBounds(this.bounds, {
			padding: {
				top: 100,
				bottom: 100,
				left: 100,
				right: 100
			},
			animate: true
		});
	};

	flyTo(markerIndex) {
		const self = this,
				currentItem = this.block.querySelector(".item.current"),
				currentIndex = currentItem ? currentItem.dataset.index : null;

		if(markerIndex && parseInt(currentIndex) !== parseInt(markerIndex)) {
			let item = this.block.querySelector(".item[data-index='" + markerIndex + "']"),
					nextItem = this.findItem(markerIndex),
					nextPanel = this.findPanel(markerIndex),
					panelPadding = 15,
					panelWidth = nextPanel.offsetWidth + panelPadding,
					blockWidth = this.block.offsetWidth,
					offsetX = blockWidth / 2 - (blockWidth - panelWidth) / 2,
					coordStr = nextItem.dataset.markerCoords;

			nextItem.classList.add("current");

			if(coordStr && coordStr.length) {
				let coordArr = JSON.parse(coordStr);
				this.map.flyTo({
					center: coordArr,
					speed: 5,
					zoom: 15
				});
				this.map.once("moveend", function(data) {
					let centerCoords = self.map.getCenter();
					const position = self.map.project(centerCoords);
					position.x -= offsetX;

					centerCoords = self.map.unproject(position);
					self.map.flyTo({
						center: centerCoords
					});
					self.openPanel(markerIndex);
					if(currentIndex) self.closePanel(currentIndex, true);
				});
			}
		} else {
			let nextItem = this.block.querySelector(".item.hidden");
			if(nextItem) nextItem.classList.add("current");
		}
	};

	clickArrow(e) {
		let direction = e.currentTarget.getAttribute("data-direction"),
				items = this.block.querySelectorAll(".item"),
				currentItem = this.block.querySelector(".item.current"),
				nextItem;

		if(!currentItem) {
			nextItem = items[0];
		} else if(direction === "next") {
			nextItem = currentItem.nextElementSibling;
		} else if(direction === "prev") {
			nextItem = currentItem.previousElementSibling;
		}
		if(nextItem) {
			let nextMarkerId = nextItem.dataset.index;
			this.flyTo(nextMarkerId);
		} else {
			this.resetMap();
		}
	};

	clickItem(e) {
		let item = e.currentTarget;
		if(item) {
			let markerIndex = item.dataset.index;
			this.flyTo(markerIndex);
		}
	};

	getMarkerData(marker, markerObj) {
		const self = this,
					item = markerObj["item"];
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: "/api/items/"+item,
			success: function(data) {
				self.populatePopup(marker, data);
				self.populatePanel(marker, data);
			},
			error: function(jqXHR, status, error) {
				console.log(jqXHR, status, error);
			}
		});
	};

	populatePopup(marker, data) {
		let popup = document.createElement("div");
		popup.classList.add("map-popup");
		popup.dataset.index = marker.properties.index;

		let popupTitle = document.createElement("h4");
		popupTitle.innerText = marker.properties.title;

		popup.appendChild(popupTitle);
		this.container.appendChild(popup);

		let item = this.block.querySelector(".item[data-index='" + marker.properties.index + "']");
		item.classList.add("ready");
	};

	populatePanel(marker, data) {
		const self = this;

		const panel = document.createElement("div");
		panel.classList.add("map-panel");
		panel.dataset.index = marker.properties.index;

		const panelHeader = document.createElement("header");

		const panelTitle = document.createElement("h2");
		panelTitle.innerText = marker.properties.title;
		panelHeader.appendChild(panelTitle);

		if(this.type === "story") {
			const prevArrow = document.createElement("div");
			prevArrow.classList.add("map-arrow");
			prevArrow.dataset.direction = "prev";
			prevArrow.addEventListener("mousedown", this.clickArrow.bind(this));
			const nextArrow = document.createElement("div");
			nextArrow.classList.add("map-arrow");
			nextArrow.dataset.direction = "next";
			nextArrow.addEventListener("mousedown", this.clickArrow.bind(this));
			panelHeader.appendChild(prevArrow);
			panelHeader.appendChild(nextArrow);
		}

		let panelInner = document.createElement("div");
		panelInner.classList.add("panel-inner");
		panelInner.appendChild(panelTitle.cloneNode(true));

		let panelScroll = document.createElement("div");
		panelScroll.classList.add("panel-scroll");

		let panelProperties = document.createElement("div");
		panelProperties.classList.add("panel-properties");

		
		
		panel.appendChild(panelHeader);
		panelInner.appendChild(panelProperties)
		panelScroll.appendChild(panelInner)
		panel.appendChild(panelScroll);

		this.container.appendChild(panel);

		let terms = [['alternative', 'Alt Title'], ['date', 'Date'], ['description', 'Description'], ['references', 'Referenced Items'], ['mediator', 'Media']];
		terms.forEach(function(term, i) {
			let slug = term[0],
					label = term[1],
					vals = data['dcterms:' + slug];
			if (vals) {
				let panelProperty = document.createElement("div");
				panelProperty.classList.add("panel-property");
				panelProperty.classList.add(slug);

				let panelPropertyLabel = document.createElement("div");
				panelPropertyLabel.innerText = label;
				vals.forEach(function(valObj, j) {
					if (valObj['type'] === 'resource:item') {
						const title = valObj['display_title'],
									url = valObj['@id'].replace('api', 'home').replace('items', 'item');

						let link = document.createElement("a");
						link.href = url;
						link.target = "_blank";

						if (valObj['property_label'] === 'Mediator') {
							const src = valObj['thumbnail_url'],
										img = document.createElement("img");
							img.src = src;
							link.appendChild(img);
						} else {
							link.innerText = title;
						}
						panelProperty.appendChild(link);
					} else {
						panelProperty.innerText += valObj['@value'];
					}
				});
				if(panelProperty) {
					panelProperties.appendChild(panelProperty);
				}
			}
		});
		panelInner.appendChild(panelProperties);
	};

	hoverMarker(e) {
		let marker = e.features[0],
				markerIndex = marker.properties.index;
		this.map.getCanvas().style.cursor = "pointer";
		this.map.setFilter("markers-hover", ["==", "index", marker.properties.index]);
		this.openPopup(markerIndex);
	};

	unhoverMarker(e) {
		this.map.getCanvas().style.cursor = "";
		this.map.setFilter("markers-hover", ["==", "index", ""]);
		this.closePopup();
	};

	openPopup(markerIndex) {
		let popup = this.findPopup(markerIndex);
		if(popup) {
			popup.classList.add("show");
		}
	};

	closePopup() {
		let popup = this.container.querySelector(".map-popup.show")
		if(popup) {
			popup.classList.remove("show");
		}
	};

	clickMarker(e) {
		let marker = e.features[0],
				markerIndex = marker.properties.index;
		this.flyTo(markerIndex);
	};

	openPanel(markerIndex) {
		const self = this,
					panel = this.findPanel(markerIndex);

		if(this.findPanel()) panel.classList.add("swap");
		panel.classList.add("show");
		setTimeout(function() {
			panel.classList.remove("swap");
			self.map.once("click", function(e) {
				self.closePanel(markerIndex);
				panel.classList.remove("show");
			});
		});
	};

	closePanel(markerIndex, swap) {
		let panel = this.findPanel(markerIndex);
		if(panel) {
			if(swap) panel.classList.add("swap");
			panel.classList.remove("show");
			setTimeout(function() {
				panel.classList.remove("swap");
			});
		}
		let item = this.findItem(markerIndex);
		if(item) {
			item.classList.remove("current");
		}
	};

	findPanel(markerIndex) {
		let panel;
		if(markerIndex) panel = this.container.querySelector(".map-panel[data-index='" + markerIndex + "']");
		if(panel) return panel;
		panel = this.container.querySelector(".map-panel.show");
		if(panel) return panel;
		return false;
	};

	findPopup(markerIndex) {
		let popup = this.container.querySelector(".map-popup[data-index='" + markerIndex + "']");
		if(popup && popup.length) return popup;
		return false;
	};

	findItem(markerIndex) {
		let item = this.block.querySelector(".item[data-index='" + markerIndex + "']");
		if(item) return item;
		item = this.block.querySelector(".item.current");
		if(item) return item;
		return false;
	};

	findMarker(mapId, markerIndex) {

	};

};

window.onload = function() {
	let map = new ExploratoryMap({});
};