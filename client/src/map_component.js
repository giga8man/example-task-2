/* global fetch, L */
import React, { useEffect, useRef, useState } from 'react'
import Moment from 'moment'

const getRouteSummary = (locations) => {
  const to = Moment(locations[0].time).format('hh:mm DD.MM')
  const from = Moment(locations[locations.length - 1].time).format('hh:mm DD.MM')
  return `${from} - ${to}`
}

const MapComponent = ({when}) => {
  const map = useRef()
  const [locations, setLocations] = useState();
  const [mapPosition, setMapPosition] = useState();
  const [marker, setMarker] = useState();
  // Request location data.
  useEffect(() => {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then((json) => {
        setLocations(json)
      })
  }, [])
  // TODO(Task 2): Request location closest to specified datetime from the back-end.
  useEffect(() => {
    when && fetch('http://localhost:3000/location/'+ when.getTime())
    .then(response => response.json())
    .then((json) => {
      setMapPosition(json.closestPoint)
    })
  }, [when])

  // Initialize map.
  useEffect(() => {
    map.current = new L.Map('mapid')
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    const osm = new L.TileLayer(osmUrl, {
      minZoom: 8,
      maxZoom: 12,
      attribution
    })
    map.current.setView(new L.LatLng(52.51, 13.40), 9)
    map.current.addLayer(osm)
  }, [])
  // Update location data on map.
  useEffect(() => {
    if (!map.current || !locations) {
      return // If map or locations not loaded yet.
    }
    // TODO(Task 1): Replace the single red polyline by the different segments on the map.
    locations.forEach(trip => {
      const color = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});//https://stackoverflow.com/a/5092872
      const latlons = trip.map(({ lat, lon }) => [lat, lon])
      const polyline = L.polyline(latlons, { color }).bindPopup(getRouteSummary(trip)).addTo(map.current)
      map.current.fitBounds(polyline.getBounds())
      return () => map.current.remove(polyline)
    });
  }, [locations, map.current])
  // TODO(Task 2): Display location that the back-end returned on the map as a marker.
  useEffect(() => {
   marker && map.current.removeLayer(marker);
   if(mapPosition) setMarker(L.marker([mapPosition.lat, mapPosition.lon]).addTo(map.current));
  }, [mapPosition])

  return (
    <div>
      {locations && `${locations.length} locations loaded`}
      {!locations && 'Loading...'}
      <div id='mapid' />
    </div>)
}

export default MapComponent
