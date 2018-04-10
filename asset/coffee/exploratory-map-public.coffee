$ ->
	window.maps = []
	window.markers = []
	layerId = 'markers'

	createMap = (id) ->
		$container = $('#'+id)
		accessToken = 'pk.eyJ1IjoiY29yZXl0ZWdlbGVyIiwiYSI6ImNpd25xNjU0czAyeG0yb3A3cjdkc2NleHAifQ.EJAjj38qZXzIylzax3EMWg'
		mapboxgl.accessToken = accessToken
		styleUri = 'mapbox://styles/coreytegeler/cjdpzc01i107c2ro96vjrzk8g'

		map = new mapboxgl.Map
			container: id,
			style: styleUri,
			zoom: 3,

		maps[id] = map

		map.on 'load', () ->
			createGeoJson(this)

			map.on 'mouseenter', layerId, hoverMarker

			map.on 'mouseleave', layerId, unhoverMarker

			map.on 'click', layerId, clickMarker

			$('.item-showcase .item').on 'click', (e) ->
				mapId = $(this).parents('.exploratory-map-block').attr('data-id')
				markerIndex = this.getAttribute('data-marker-index')
				flyTo(mapId, markerIndex)

			$('.exploratory-map .map-arrow').on 'click', clickArrow


	createGeoJson = (map) ->
		container = map.getContainer()
		markersStr = container.getAttribute('data-markers')
		if !markersStr
			return false
		markersJson = JSON.parse(markersStr)
		layer = 
			'id': layerId,
			'type': 'symbol',
			'source':
				'type': 'geojson'
				'data':
					'type': 'FeatureCollection'
					'features': []
			'layout':
				'icon-image': 'circle-15'
				'text-field': '{title}'
				'text-size': 20
				'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
				'text-offset': [0, 0.6]
				'text-anchor': 'top'
			'paint':
				'text-color': 'black'
				'text-halo-color': 'white'
				'text-halo-width': 1
				'icon-color': 'red'

		bounds = new mapboxgl.LngLatBounds()
		for markerObj, index in markersJson
			location = markerObj['location']
			lat = location['o-module-mapping:lat']
			lng = location['o-module-mapping:lng']
			coords = [lng, lat]
			marker =
				'type': 'Feature',
				'properties':
					'description': markerObj.caption
					'title': markerObj.title
					'index': index
					'item': markerObj.item
				'geometry':
					'type': 'Point'
					'coordinates': coords
			layer.source.data.features.push(marker)
			markers.push(marker)
			bounds.extend(coords)
			preloadPopup(marker, container, markerObj)
		map.addLayer(layer)
		map.fitBounds bounds,
      padding:
        top: 100
        bottom: 100
        left: 100
        right: 100
      animate: false
		paddedBounds = map.getBounds()
		$(container).addClass('show')

	flyTo = (mapId, markerIndex) ->
		map = maps[mapId]
		$block = $(map.getContainer()).parents('.exploratory-map-block')
		$items = $block.find('.item-showcase .item')
		$item = $items.filter('[data-marker-index="'+markerIndex+'"]')
		coords = $item.attr('data-marker-coords')
		$block.find('.item-showcase .item').removeClass('current')
		$nextItem = findItem(mapId, markerIndex)
		$nextItem.addClass('current')
		$block.find('.em-popup').removeClass('show')
		$nextPopup = findPopup(mapId, markerIndex)
		popupPadding =  parseInt($nextPopup.css('left'))
		popupWidth = $nextPopup.outerWidth()
		popupWidth += popupPadding
		blockWidth = $block.innerWidth()
		offsetX = blockWidth/2 - (blockWidth-popupWidth)/2
		if coords && coords.length
			coords = JSON.parse(coords)
			map.flyTo
				center: coords
				speed: 5
				zoom: 9
			map.once 'moveend', (data) ->
				coords = map.getCenter()
				position = map.project(coords)
				position.x -= offsetX
				coords = map.unproject(position)
				map.flyTo
					center: coords
				openPopup(mapId, markerIndex)



	clickArrow = (e) ->
		direction = e.target.getAttribute('data-direction')
		$block = $(this).parents('.exploratory-map-block')
		mapId = $block.attr('data-id')
		$items = $block.find('.item-showcase .item')
		$currentItem = $items.filter('.current')
		if !$currentItem.length
			$nextItem = $items.first()
		else if direction == 'next'
			$nextItem = $currentItem.next()
			if !$nextItem.length
				$nextItem = $items.first()
		else if direction == 'prev'
			$nextItem = $currentItem.prev()
			if !$nextItem.length
				$nextItem = $items.last()
		nextMarkerId = $nextItem.attr('data-marker-index')
		flyTo(mapId, nextMarkerId)

	hoverMarker = (e) ->
		container = e.target.getContainer()
		$(container).addClass('marker-hover')
		# mapId = container.getAttribute('id')
		# marker = e.features[0]
		# markerIndex = marker.properties.index
		# popup = findPopup(mapId, markerIndex)
		# if popup.length == 0
		#   preloadPopup(marker, container)

	unhoverMarker = (e) ->
		container = e.target.getContainer()
		$(container).removeClass('marker-hover')

	clickMarker = (e) ->
		map = e.target
		container = map.getContainer()
		mapId = container.getAttribute('id')
		marker = e.features[0]
		markerIndex = marker.properties.index
		flyTo(mapId, markerIndex)
		
	openPopup = (mapId, markerIndex, api) ->
		map = maps[mapId]
		$popup = findPopup(mapId, markerIndex)
		$popup.addClass('show')
		setTimeout () ->
			map.once 'click', (e) ->
				$popup.removeClass('show')
				return false

	preloadPopup = (marker, map, markerObj) ->
		$popup = $('<div class="em-popup"></div>')
			.attr('data-marker-index', marker.properties.index)
			.append('<h2>'+marker.properties.title+'</h2>')
			.appendTo(map)
		api = markerObj.location['o:item']['@id']
		$.ajax
			type: 'GET'
			dataType: 'json'
			url: api
			success: (data) ->
				populatePopup(data, $popup)
			error: (jqXHR, status, error) ->
				console.log jqXHR,status,error

	populatePopup = (data, popup) ->
		console.log data
		$ul = $('<ul></ul>')
		terms = [
			['alternative','Alt Title']
			['description','Description']
			['description','Description']
			['references','Referenced Items']
		]
		for term, i in terms
			slug = term[0]
			label = term[1]
			vals = data['dcterms:'+slug]
			if vals
				$li = $('<li class="'+slug+'"></li>')
				$li.append('<strong>'+label+': </strong>');
				for valObj in vals
					text = ''
					if valObj['type'] == 'resource:item'
						resourceId = valObj['value_resource_id']
						resourceName = valObj['value_resource_name']
						title = valObj['display_title']
						url = valObj['@id']
						val = '<a href="'+url+'" target="_blank">'+title+'</a>'
					else
						val = valObj['@value']
					if val.length
						text += val
					$li.append(text)
			$ul.append($li)
		popup.append($ul)

	findItem = (mapId, markerIndex) ->
		$block = $('.exploratory-map-block[data-id="'+mapId+'"]')
		$items = $block.find('.item-showcase .item')
		$item = $items.filter('[data-marker-index="'+markerIndex+'"]')
		return $item

	findMarker = (mapId, markerIndex) ->
		return

	findPopup = (mapId, markerIndex) ->
		$map = $('#'+mapId)
		if $popup = $map.find('.em-popup').filter('[data-marker-index="'+markerIndex+'"]')
			return $popup
		else
			return false

	findMaps = () ->
		$('.exploratory-map-block').each (i, block) ->
			id = 'em-map-'+i
			$(block).attr('data-id',id)
			$(block).find('.exploratory-map').attr('id',id)
			createMap(id)


	findMaps()
