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
		, data
		, map
		, popup
		, formatter = tableFormatter
		;
	
	data = getData();
	map = L.map('map', {'closePopupOnClick' : true}).setView([-17.8639, 31.0297], 9);
	popup = L.popup();

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets'
	}).addTo(map);

	$.each(data, function(index, entry) {
		var marker = L.marker([entry.latitude, entry.longitude]);
			
		marker.addTo(map)
			.bindPopup(popup)
			.on('click', function(e) {
				marker.setPopupContent(makePopupContent(entry));
			});
	});

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

})();
