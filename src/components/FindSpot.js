import React, {useState, useEffect } from "react";
import MapContainer from "./Map";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import './FindSpotStyles.css';
import {TiLocationArrow} from "react-icons/ti";

export default function FindSpot() {

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCurrentCoords, errorCallback, {timeout:5000, enableHighAccuracy:true});
      setLoading(false);
    } else {
      alert("Geolocation is not available");
    }
  }

  function getAddressFromCoordinates(latitude, longitude) {
    return new Promise((resolve) => {
      const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=${latitude},${longitude}&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=te0_4-q9qNhjDswASSr7RXX5mkogA3vw4jqc_uWr2OY`
      fetch(url)
        .then(res => res.json())
        .then((resJson) => {
          // the response had a deeply nested structure :/
          if (resJson
            && resJson.Response
            && resJson.Response.View
            && resJson.Response.View[0]
            && resJson.Response.View[0].Result
            && resJson.Response.View[0].Result[0]) {
            resolve(resJson.Response.View[0].Result[0].Location.Address.Label);
          } else {
            resolve()
          }
        })
        .catch((e) => {
          resolve();
        });
    });
  }

  const getCurrentCoords = async (position) => {
    setCoordinates({lat: position.coords.latitude,
      lng: position.coords.longitude})
    setAddress("Current Location");
    const currentAddress = await getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
    window.sessionStorage.setItem('SearchedLocation', currentAddress);
  }

  const errorCallback = () => {
    // TODO
  }

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latlng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latlng);
    window.sessionStorage.setItem('SearchedLocation', value);
  }

  const handleCloseClick = () => {
    setAddress("");
  }

  useEffect(() => {
    window.sessionStorage.getItem('SearchedLocation') === null ? getCurrentLocation()
      : handleSelect(window.sessionStorage.getItem('SearchedLocation'));
    
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="app">
          <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
              <div className="sub-bar">
                  <label style={{margin:"15px", fontSize:"25px"}}>Search for Spots</label>
                  <div>
                  <input {...getInputProps({className: 'search-input'})} />
                  {address.length > 0 && (
                      <button
                        className="clear-button"
                        onClick={() => handleCloseClick()}
                      >
                        x
                      </button>
                  )}
                  <button className="use-curr-button" onClick={() => getCurrentLocation()}><TiLocationArrow size={20} className="icon"/><span className="button-text">Use Current Location</span></button>
                  <div style={{padding: "10px"}}></div>
                  </div>
                  <div className="dropdown">
                    {loading ? <div className="dropdown">loading...</div> : null}
                    {suggestions.map(suggestion => {
                      const style = suggestion.active
                      ? { backgroundColor: '#0070ff', cursor: 'pointer', color: "white"}
                      : { backgroundColor: '#ffffff', cursor: 'pointer' };

                      return (
                        <div key={suggestion.placeId} {...getSuggestionItemProps(suggestion, { style })}>
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                </div>
              }
          </PlacesAutocomplete>
          {loading && <div>loading current location</div>}
          {coordinates === "" ?
          <div>Loading Map...</div> :
          <MapContainer lat={coordinates.lat} lng={coordinates.lng} zoomLevel={17}/>
          }
        </div>
        )
}