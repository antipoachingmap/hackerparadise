(function() {
	var USE_DUMMY_DATA = false
		, POPUP_FORMATTER = tableFormatter
		, HARARE_LAT_LNG = [-17.8639, 31.0297]
		, map
		, popup
		;
	
	map = L.map('map', {scrollWheelZoom: false}).setView(HARARE_LAT_LNG, 9);
	popup = L.popup();

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets'
	}).addTo(map);

	$.when(getMarkers()).then(onMarkers);
	// THE END


	// FUNCTIONS start here
	function onMarkers(data) {
		var speciesLayers = {}
			, baseLayers = null; // add baseLayers to enable toggling map types

		$(data)
			.filter(ensureRequiredFields)
			.each(function(index, post) {
				var marker = makeMarker(post)
					, species = post.species
					, layer = speciesLayers[species]
					;
				
				if (layer) {
					layer.push(marker);
				}
				else {
					speciesLayers[species] = [marker];
				}
			});
		
		$.each(speciesLayers, function(species, layer) {
			// will need to merge instead of create new layers 
			// if we get multiple feeds of events from server
			speciesLayers[species] = L.layerGroup(layer).addTo(map);
		});

		L.control.layers(baseLayers, speciesLayers).addTo(map);
	}

	function makeMarker(post) {
		var ICON_BASE_URL = 'http://antipoachingmap.org/wp-content/uploads/2015/07/#{species}.png'
			, icon
			, marker
			, species = post.species
			, useCustomIcon
			;

		// we can remove code using 'useCustomIcon' if we have a default icon corresponding to 'Other' species				
		useCustomIcon = species.length && species !== 'Other'
		if (useCustomIcon) {
			icon = L.icon({
				iconUrl: ICON_BASE_URL.replace('#{species}', species)
				, iconAnchor: [32, 64]	// our icons have a different origin (0,0) then the out of the box ones
			});
			marker = L.marker([post.latitude, post.longitude], {icon: icon});
		}
		else {
			marker = L.marker([post.latitude, post.longitude]);
		}

		marker
			.bindPopup(popup, {offset: [0, -44]})
			.on('click', function(e) {
				marker.setPopupContent(makePopupContent(post));
			});

		return marker;
	}

	function makePopupContent(post) {
		var POPUP_FIELDS = {
			  "description": ""
			  , "location": "Location"
			  , "species": "Species"
			  , "victim_count": "# killed"
			  , "event_datetime": "When"
			}

		return POPUP_FORMATTER(post, POPUP_FIELDS);
	}

	// EWWW, tables!!!  Quick and dirty...
	// IF you really hate them, make another formatter and assign it to
	// POPUP_FORMATTER at the beginning of this file
	function tableFormatter(post, fieldsToShow) {
		var rows = $.map(fieldsToShow, function(label, field) {
			var value = post[field];
			return value ? tableRowFormatter(label, value) : null;
		});

		return "<table>" + rows.join('') + "</table>";
	}

	function tableRowFormatter(label, value) {
		var DATE_TIME_FIELDS = [
			"When"
		];

		value = $.inArray(label, DATE_TIME_FIELDS) !== -1 ?
			new Date(value).toString() :
			value;

		return label ?
			"<tr><td>" + label + "</td><td>" + value + "</td></tr>" :
			"<tr><td colspan='2'>" + value + "</td></tr>" ;
	}

	function ensureRequiredFields(index, post) {
		var REQUIRED_FIELDS = ['latitude', 'longitude', 'species']
			, missingFields = []
			, emptyFields = []
			, isInvalid = false;

		$.each(REQUIRED_FIELDS, function(index, field) {
			var value = post[field];
			if (!value) {
				missingFields.push(field);
			}
			else if (typeof value === 'string' && !value.trim().length) {
				emptyFields.push(field);
			}
		});

		if (missingFields.length) {
			isInvalid = true;
			console.log('Skipping post because it is missing the following fields: ', missingFields);
			console.dir(post);
		}
		if (emptyFields.length) {
			isInvalid = true;
			console.log('Skipping post because the following fields are empty: ', emptyFields);
			console.dir(post);
		}
		
		return !isInvalid;
	}

	function getMarkers() {
		var data_url =
			"https://infinite-inlet-2573.herokuapp.com/poaching_reports.json";

		return !USE_DUMMY_DATA ?
			$.getJSON(data_url) :
			getDummyData();	// defined in getDummyData.js
	}

})();