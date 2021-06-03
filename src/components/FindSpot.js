import React, {useState, useEffect } from "react";
import MapContainer from "./Map";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

export default function FindSpot() {

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCurrentCoords, errorCallback, {timeout:5000, enableHighAccuracy:true});
    } else {
      alert("Geolocation is not available");
    }
  }

  const getCurrentCoords = (position) => {
    console.log(position)
    setCoordinates({lat: position.coords.latitude,
      lng: position.coords.longitude})
    setAddress("Current Location")
  }

  const errorCallback = () => {

  }

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latlng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latlng);
    window.sessionStorage.setItem('SearchedLocation', value);
  }

  useEffect(() => {
    console.log("here")
    {window.sessionStorage.getItem('SearchedLocation') == null 
            ? getCurrentLocation() 
            : handleSelect(window.sessionStorage.getItem('SearchedLocation'))
          }
  },[])

    return (
        <div className="app">
          <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
              <div>
                <label style={{margin:"15px"}}>Location of Spot</label>
                <input {...getInputProps()} />
                <div>
                  {loading ? <div style={{marginLeft:"150px"}}>loading...</div> : null}
                  {suggestions.map(suggestion => {
                    const style = suggestion.active
                    ? { backgroundColor: '#0070ff', cursor: 'pointer', color: "white"}
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };

                    return (
                      <div style={{marginLeft:"15px"}} {...getSuggestionItemProps(suggestion, { style })}>
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
                <button onClick={getCurrentLocation()}>Use Current Location</button>
              </div>
            }
          </PlacesAutocomplete>
          {coordinates == "" ?
          <div>Loading Map...</div> :
          <MapContainer lat={coordinates.lat} lng={coordinates.lng} zoomLevel={17}/>
          }
        </div>
        )
}