json.array!(@poaching_reports) do |poaching_report|
  json.extract! poaching_report, :id, :latitude, :longitude, :location, :species, :victim_count, :description, :event_datetime, :photos
  json.url poaching_report_url(poaching_report, format: :json)
end
