$(function() {
  var clickArrow, clickMarker, createGeoJson, createMap, findItem, findMaps, findMarker, findPopup, flyTo, hoverMarker, layerId, openPopup, populatePopup, preloadPopup, unhoverMarker;
  window.maps = [];
  window.markers = [];
  layerId = 'markers';
  createMap = function(id) {
    var $container, accessToken, map, styleUri;
    $container = $('#' + id);
    accessToken = 'pk.eyJ1IjoiY29yZXl0ZWdlbGVyIiwiYSI6ImNpd25xNjU0czAyeG0yb3A3cjdkc2NleHAifQ.EJAjj38qZXzIylzax3EMWg';
    mapboxgl.accessToken = accessToken;
    styleUri = 'mapbox://styles/coreytegeler/cjdpzc01i107c2ro96vjrzk8g';
    map = new mapboxgl.Map({
      container: id,
      style: styleUri,
      zoom: 3
    });
    maps[id] = map;
    return map.on('load', function() {
      createGeoJson(this);
      map.on('mouseenter', layerId, hoverMarker);
      map.on('mouseleave', layerId, unhoverMarker);
      map.on('click', layerId, clickMarker);
      $('.item-showcase .item').on('click', function(e) {
        var mapId, markerIndex;
        mapId = $(this).parents('.exploratory-map-block').attr('data-id');
        markerIndex = this.getAttribute('data-marker-index');
        return flyTo(mapId, markerIndex);
      });
      return $('.exploratory-map .map-arrow').on('click', clickArrow);
    });
  };
  createGeoJson = function(map) {
    var bounds, container, coords, index, j, lat, layer, len, lng, location, marker, markerObj, markersJson, markersStr, paddedBounds;
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
        'icon-image': 'circle-15',
        'text-field': '{title}',
        'text-size': 20,
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.6],
        'text-anchor': 'top'
      },
      'paint': {
        'text-color': 'black',
        'text-halo-color': 'white',
        'text-halo-width': 1,
        'icon-color': 'red'
      }
    };
    bounds = new mapboxgl.LngLatBounds();
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
          'index': index,
          'item': markerObj.item
        },
        'geometry': {
          'type': 'Point',
          'coordinates': coords
        }
      };
      layer.source.data.features.push(marker);
      markers.push(marker);
      bounds.extend(coords);
      preloadPopup(marker, container, markerObj);
    }
    map.addLayer(layer);
    map.fitBounds(bounds, {
      padding: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      },
      animate: false
    });
    paddedBounds = map.getBounds();
    return $(container).addClass('show');
  };
  flyTo = function(mapId, markerIndex) {
    var $block, $item, $items, $nextItem, $nextPopup, blockWidth, coords, map, offsetX, popupPadding, popupWidth;
    map = maps[mapId];
    $block = $(map.getContainer()).parents('.exploratory-map-block');
    $items = $block.find('.item-showcase .item');
    $item = $items.filter('[data-marker-index="' + markerIndex + '"]');
    coords = $item.attr('data-marker-coords');
    $block.find('.item-showcase .item').removeClass('current');
    $nextItem = findItem(mapId, markerIndex);
    $nextItem.addClass('current');
    $block.find('.em-popup').removeClass('show');
    $nextPopup = findPopup(mapId, markerIndex);
    popupPadding = parseInt($nextPopup.css('left'));
    popupWidth = $nextPopup.outerWidth();
    popupWidth += popupPadding;
    blockWidth = $block.innerWidth();
    offsetX = blockWidth / 2 - (blockWidth - popupWidth) / 2;
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
        return openPopup(mapId, markerIndex);
      });
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
      $nextItem = $items.first();
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
    nextMarkerId = $nextItem.attr('data-marker-index');
    return flyTo(mapId, nextMarkerId);
  };
  hoverMarker = function(e) {
    var container;
    container = e.target.getContainer();
    return $(container).addClass('marker-hover');
  };
  unhoverMarker = function(e) {
    var container;
    container = e.target.getContainer();
    return $(container).removeClass('marker-hover');
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
  openPopup = function(mapId, markerIndex, api) {
    var $popup, map;
    map = maps[mapId];
    $popup = findPopup(mapId, markerIndex);
    $popup.addClass('show');
    return setTimeout(function() {
      return map.once('click', function(e) {
        $popup.removeClass('show');
        return false;
      });
    });
  };
  preloadPopup = function(marker, map, markerObj) {
    var $popup, api;
    $popup = $('<div class="em-popup"></div>').attr('data-marker-index', marker.properties.index).append('<h2>' + marker.properties.title + '</h2>').appendTo(map);
    api = markerObj.location['o:item']['@id'];
    return $.ajax({
      type: 'GET',
      dataType: 'json',
      url: api,
      success: function(data) {
        return populatePopup(data, $popup);
      },
      error: function(jqXHR, status, error) {
        return console.log(jqXHR, status, error);
      }
    });
  };
  populatePopup = function(data, popup) {
    var $li, $ul, i, j, k, label, len, len1, resourceId, resourceName, slug, term, terms, text, title, url, val, valObj, vals;
    console.log(data);
    $ul = $('<ul></ul>');
    terms = [['alternative', 'Alt Title'], ['description', 'Description'], ['description', 'Description'], ['references', 'Referenced Items']];
    for (i = j = 0, len = terms.length; j < len; i = ++j) {
      term = terms[i];
      slug = term[0];
      label = term[1];
      vals = data['dcterms:' + slug];
      if (vals) {
        $li = $('<li class="' + slug + '"></li>');
        $li.append('<strong>' + label + ': </strong>');
        for (k = 0, len1 = vals.length; k < len1; k++) {
          valObj = vals[k];
          text = '';
          if (valObj['type'] === 'resource:item') {
            resourceId = valObj['value_resource_id'];
            resourceName = valObj['value_resource_name'];
            title = valObj['display_title'];
            url = valObj['@id'];
            val = '<a href="' + url + '" target="_blank">' + title + '</a>';
          } else {
            val = valObj['@value'];
          }
          if (val.length) {
            text += val;
          }
          $li.append(text);
        }
      }
      $ul.append($li);
    }
    return popup.append($ul);
  };
  findItem = function(mapId, markerIndex) {
    var $block, $item, $items;
    $block = $('.exploratory-map-block[data-id="' + mapId + '"]');
    $items = $block.find('.item-showcase .item');
    $item = $items.filter('[data-marker-index="' + markerIndex + '"]');
    return $item;
  };
  findMarker = function(mapId, markerIndex) {};
  findPopup = function(mapId, markerIndex) {
    var $map, $popup;
    $map = $('#' + mapId);
    if ($popup = $map.find('.em-popup').filter('[data-marker-index="' + markerIndex + '"]')) {
      return $popup;
    } else {
      return false;
    }
  };
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
