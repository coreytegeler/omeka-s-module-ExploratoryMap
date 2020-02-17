$(function() {
  var base, bg, clickArrow, clickItem, clickMarker, closePanel, closePopup, createGeoJson, createMap, dark, findItem, findMaps, findMarker, findPanel, findPopup, flyTo, getMarkerData, highlight, hoverMarker, layerId, openPanel, openPopup, populatePanel, populatePopup, resetMap, unhoverMarker;
  window.maps = [];
  window.markers = [];
  window.bounds = [];
  layerId = 'markers';
  base = '#fcf8e3';
  bg = 'beige';
  dark = '#072605';
  highlight = '#0dae0b';
  createMap = function(id) {
    var $container, accessToken, map, styleUri;
    $container = $('#' + id);
    accessToken = 'pk.eyJ1IjoibWN0YmFybmFyZCIsImEiOiJjamZ2ZDJybXUwZXprMnpydnNuOHd6anZnIn0.is86NnAGTq9Zi4FgtDo-Cg';
    mapboxgl.accessToken = accessToken;
    styleUri = 'mapbox://styles/mctbarnard/cjfvd4gii00ch2rqr13ngsrbo';
    map = new mapboxgl.Map({
      container: id,
      style: styleUri,
      zoom: 3
    });
    maps[id] = map;
    return map.on('load', function() {
      createGeoJson(this, id);
      map.on('mouseenter', layerId, hoverMarker);
      map.on('mouseleave', layerId, unhoverMarker);
      map.on('click', layerId, clickMarker);
      $('.exploratory-map .map-arrow').on('click', clickArrow);
      return $('.item-showcase .item').on('click', clickItem);
    });
  };
  createGeoJson = function(map, id) {
    var container, coords, hoverLayer, index, j, lat, layer, len, lng, location, mapBounds, mapId, marker, markerObj, markersJson, markersStr, paddedBounds;
    container = map.getContainer();
    markersStr = container.getAttribute('data-markers');
    if (!markersStr) {
      return false;
    }
    markersJson = JSON.parse(markersStr);
    layer = {
      'id': layerId,
      'type': 'symbol',
      'source': {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': []
        }
      },
      'layout': {
        'icon-image': 'circle-15-hover',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'text-allow-overlap': true,
        'text-ignore-placement': true
      }
    };
    hoverLayer = {
      'id': layerId + '-hover',
      'type': 'symbol',
      'source': {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': []
        }
      },
      'layout': {
        'icon-image': 'circle-15-hover',
        'icon-ignore-placement': true,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'text-allow-overlap': true,
        'text-ignore-placement': true,
        'text-field': '{title}',
        'text-size': 20,
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.6],
        'text-anchor': 'top'
      },
      'paint': {
        'text-color': dark,
        'text-halo-color': 'white',
        'text-halo-width': 1
      },
      'filter': ['==', 'index', '']
    };
    mapBounds = new mapboxgl.LngLatBounds();
    for (index = j = 0, len = markersJson.length; j < len; index = ++j) {
      markerObj = markersJson[index];
      location = markerObj['location'];
      lat = location['o-module-mapping:lat'];
      lng = location['o-module-mapping:lng'];
      coords = [lng, lat];
      marker = {
        'type': 'Feature',
        'properties': {
          'description': markerObj.caption,
          'title': markerObj.title,
          'index': index + 1,
          'item': markerObj.item
        },
        'geometry': {
          'type': 'Point',
          'coordinates': coords
        }
      };
      layer.source.data.features.push(marker);
      hoverLayer.source.data.features.push(marker);
      markers.push(marker);
      mapBounds.extend(coords);
      getMarkerData(marker, map, markerObj);
    }
    map.addLayer(layer);
    map.addLayer(hoverLayer);
    map.fitBounds(mapBounds, {
      padding: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      },
      animate: false
    });
    paddedBounds = map.getBounds();
    mapId = $(container).attr('id');
    bounds[mapId] = mapBounds;
    return $(container).parent().addClass('loaded');
  };
  resetMap = function(mapId) {
    var map, mapBounds;
    map = maps[mapId];
    mapBounds = bounds[mapId];
    return map.fitBounds(mapBounds, {
      padding: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      },
      animate: true
    });
  };
  flyTo = function(mapId, markerIndex) {
    var $block, $currentItem, $item, $items, $nextItem, $nextPanel, blockWidth, coords, currentIndex, map, offsetX, panelPadding, panelWidth;
    map = maps[mapId];
    $block = $(map.getContainer()).parents('.exploratory-map-block');
    $currentItem = $block.find('.item-showcase .item.current');
    currentIndex = $currentItem.attr('data-index');
    $currentItem.removeClass('current');
    $block.find('.map-panel').removeClass('show');
    $items = $block.find('.item-showcase .item');
    if (markerIndex && parseInt(currentIndex) !== parseInt(markerIndex)) {
      $item = $items.filter('[data-index="' + markerIndex + '"]');
      $nextItem = findItem(mapId, markerIndex);
      $nextItem.addClass('current');
      coords = $item.attr('data-marker-coords');
      $nextPanel = findPanel(mapId, markerIndex);
      panelPadding = parseInt($nextPanel.css('left'));
      panelWidth = $nextPanel.outerWidth();
      panelWidth += panelPadding;
      blockWidth = $block.innerWidth();
      offsetX = blockWidth / 2 - (blockWidth - panelWidth) / 2;
      if (coords && coords.length) {
        coords = JSON.parse(coords);
        map.flyTo({
          center: coords,
          speed: 5,
          zoom: 9
        });
        return map.once('moveend', function(data) {
          var position;
          coords = map.getCenter();
          position = map.project(coords);
          position.x -= offsetX;
          coords = map.unproject(position);
          map.flyTo({
            center: coords
          });
          return openPanel(mapId, markerIndex);
        });
      }
    } else {
      $nextItem = $items.filter('.hidden');
      $nextItem.addClass('current');
      return resetMap(mapId);
    }
  };
  clickArrow = function(e) {
    var $block, $currentItem, $items, $nextItem, direction, mapId, nextMarkerId;
    direction = e.target.getAttribute('data-direction');
    $block = $(this).parents('.exploratory-map-block');
    mapId = $block.attr('data-id');
    $items = $block.find('.item-showcase .item');
    $currentItem = $items.filter('.current');
    if (!$currentItem.length) {
      $nextItem = $items.first().next();
    } else if (direction === 'next') {
      $nextItem = $currentItem.next();
      if (!$nextItem.length) {
        $nextItem = $items.first();
      }
    } else if (direction === 'prev') {
      $nextItem = $currentItem.prev();
      if (!$nextItem.length) {
        $nextItem = $items.last();
      }
    }
    nextMarkerId = $nextItem.attr('data-index');
    return flyTo(mapId, nextMarkerId);
  };
  clickItem = function(e) {
    var mapId, markerIndex;
    mapId = $(this).parents('.exploratory-map-block').attr('data-id');
    markerIndex = this.getAttribute('data-index');
    return flyTo(mapId, markerIndex);
  };
  getMarkerData = function(marker, map, markerObj) {
    var api;
    api = markerObj.location['o:item']['@id'];
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      url: api,
      success: function(data) {
        populatePopup(marker, map, data);
        return populatePanel(marker, map, data);
      },
      error: function(jqXHR, status, error) {
        return console.log(jqXHR, status, error);
      }
    });
  };
  populatePopup = function(marker, map, data) {
    var $block, $item, $popup;
    $popup = $('<div class="map-popup"></div>').attr('data-index', marker.properties.index).append('<h4>' + marker.properties.title + '</h4>').appendTo(map.getContainer());
    $block = $(map.getContainer()).parents('.exploratory-map-block');
    $item = $block.find('.item[data-index="' + marker.properties.index + '"]');
    return $item.addClass('ready');
  };
  populatePanel = function(marker, map, data) {
    var $html, $inner, $panel, $properties, $property, $scroll, i, j, k, label, len, len1, resourceId, resourceName, slug, src, term, terms, title, url, valObj, vals;
    $panel = $('<div class="map-panel"></div>').attr('data-index', marker.properties.index).append('<header><h2>' + marker.properties.title + '</h2></header>').appendTo(map.getContainer());
    $scroll = $('<div class="scroll"></div>').appendTo($panel);
    $inner = $('<div class="inner"></div>').appendTo($scroll).append('<h2>' + marker.properties.title + '</h2>');
    $properties = $('<div class="properties"></div>').appendTo($inner);
    terms = [['alternative', 'Alt Title'], ['date', 'Date'], ['description', 'Description'], ['references', 'Referenced Items'], ['mediator', 'Media']];
    for (i = j = 0, len = terms.length; j < len; i = ++j) {
      term = terms[i];
      slug = term[0];
      label = term[1];
      vals = data['dcterms:' + slug];
      if (vals) {
        $property = $('<div class="property ' + slug + '"></div>');
        $property.append('<h4>' + label + '</h4>');
        for (k = 0, len1 = vals.length; k < len1; k++) {
          valObj = vals[k];
          if (valObj['type'] === 'resource:item') {
            resourceId = valObj['value_resource_id'];
            resourceName = valObj['value_resource_name'];
            title = valObj['display_title'];
            url = valObj['@id'].replace('api', 'home').replace('items', 'item');
            $html = $('<a href="' + url + '" target="_blank"></a>');
            if (valObj['property_label'] === 'Mediator') {
              src = valObj['thumbnail_url'];
              $html.append($('<img src="' + src + '"/>'));
            } else {
              $html.html(title);
            }
            $property.append($html);
          } else {
            $property.append(valObj['@value']);
          }
        }
      }
      $properties.append($property);
    }
    return $inner.append($properties);
  };
  hoverMarker = function(e) {
    var container, map, mapId, marker;
    map = e.target;
    container = map.getContainer();
    map.getCanvas().style.cursor = 'pointer';
    mapId = container.getAttribute('id');
    marker = e.features[0];
    map.setFilter(layerId + '-hover', ['==', 'index', marker.properties.index]);
    return openPopup(mapId, marker);
  };
  unhoverMarker = function(e) {
    var map;
    map = e.target;
    map.getCanvas().style.cursor = '';
    map.setFilter(layerId + '-hover', ['==', 'index', '']);
    return closePopup(map);
  };
  openPopup = function(mapId, markerIndex) {
    var $popup, map;
    map = maps[mapId];
    $popup = findPopup(mapId, markerIndex);
    return $popup.addClass('show');
  };
  closePopup = function(map) {
    var $container;
    $container = $(map.getContainer());
    return $container.find('.map-popup').removeClass('show');
  };
  clickMarker = function(e) {
    var container, map, mapId, marker, markerIndex;
    map = e.target;
    container = map.getContainer();
    mapId = container.getAttribute('id');
    marker = e.features[0];
    markerIndex = marker.properties.index;
    return flyTo(mapId, markerIndex);
  };
  openPanel = function(mapId, markerIndex) {
    var $panel, map;
    map = maps[mapId];
    $panel = findPanel(mapId, markerIndex);
    $panel.addClass('show');
    return setTimeout(function() {
      return map.once('click', function(e) {
        $panel.removeClass('show');
        return false;
      });
    });
  };
  closePanel = function(mapId) {
    var $panel, map;
    map = maps[mapId];
    $panel = findPanel(mapId);
    return $panel.removeClass('show');
  };
  findPanel = function(mapId, markerIndex) {
    var $map, $panel;
    $map = $('#' + mapId);
    $panel = $map.find('.map-panel').filter('[data-index="' + markerIndex + '"]');
    if ($panel.length) {
      return $panel;
    }
    $panel = $map.find('.map-panel');
    if ($panel.length) {
      return $panel;
    } else {
      return false;
    }
  };
  findPopup = function(mapId, markerIndex) {
    var $map, $popup;
    $map = $('#' + mapId);
    if ($popup = $map.find('.map-popup').filter('[data-index="' + markerIndex + '"]')) {
      return $popup;
    } else {
      return false;
    }
  };
  findItem = function(mapId, markerIndex) {
    var $block, $item, $items;
    $block = $('.exploratory-map-block[data-id="' + mapId + '"]');
    $items = $block.find('.item-showcase .item');
    $item = $items.filter('[data-index="' + markerIndex + '"]');
    return $item;
  };
  findMarker = function(mapId, markerIndex) {};
  findMaps = function() {
    return $('.exploratory-map-block').each(function(i, block) {
      var id;
      id = 'em-map-' + i;
      $(block).attr('data-id', id);
      $(block).find('.exploratory-map').attr('id', id);
      return createMap(id);
    });
  };
  return findMaps();
});
