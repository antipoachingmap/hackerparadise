(function() {
	var POPUP_FIELDS = {
		  "description": ""
		  , "location": "Location"
		  , "species": "Species"
		  , "victim_count": "# killed"
		  , "event_datetime": "When"		  
	//	  , "raw_sms": null
		}
		, DATE_TIME_FIELDS = [
			"When"
		]
		, formatter = tableFormatter
		, data
		, map
		, popup
		, speciesLayers = {}
		, USE_DUMMY_DATA = false
		;
	
	map = L.map('map', {scrollWheelZoom: false}).setView([-17.8639, 31.0297], 9);
	popup = L.popup();

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets'
	}).addTo(map);

	$.when(getMarkers()).then(onMarkers);

	function onMarkers(data) {
		$.each(data, function(index, entry) {
			var ICON_BASE_URL = 'http://antipoachingmap.org/wp-content/uploads/2015/07/#{species}.png'
				, icon
				, species = (entry.species || "").trim()
				, layer
				, useCustomIcon = true && species.length && species !== 'Other'
				;
				
			if (useCustomIcon) {
				icon = L.icon({
					iconUrl: ICON_BASE_URL.replace('#{species}', species)
					, iconAnchor: [32, 64]
				});
				marker = L.marker([entry.latitude, entry.longitude], {icon: icon});
			}
			else {
				marker = L.marker([entry.latitude, entry.longitude]);
			}
	
			layer = speciesLayers[species]
			if (layer) {
				layer.push(marker);
			} 
			else {
				speciesLayers[species] = [marker];
			}
				
			//marker.addTo(map)
			marker.bindPopup(popup, {offset: [0, -44]})
				.on('click', function(e) {
					marker.setPopupContent(makePopupContent(entry));
				});
		});	
		
		$.each(speciesLayers, function(species, layer) {
			speciesLayers[species] = L.layerGroup(layer).addTo(map);
		});
	
		L.control.layers(null, speciesLayers).addTo(map);
	}

	function tableFormatter(label, value) {
		value = $.inArray(label, DATE_TIME_FIELDS) !== -1 ?
			new Date(value).toString() :
			value;

		return label ? 
			"<tr><td>" + label + "</td><td>" + value + "</td></tr>" :
			"<tr><td colspan='2'>" + value + "</td></tr>" ;
	}

	function makePopupContent(entry) {
		var fieldsToShow = $.map(POPUP_FIELDS, function(label, field) {
			value = entry[field];
			return value ? formatter(label, value) : null;
		});

		return "<table>" + fieldsToShow.join('') + "</table>"
	}

	function getMarkers() {
		var data_url = 
			"https://infinite-inlet-2573.herokuapp.com/poaching_reports.json";

		return !USE_DUMMY_DATA ? 
			$.getJSON(data_url, onMarkers) : 
			getDummyData();
	}

})();