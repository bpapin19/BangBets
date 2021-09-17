import { React, useState, useEffect } from 'react'
import MapContainer from "./Map";
import {BiRefresh} from "react-icons/bi";


  export default function Home() {

    const [coords, setCoords] = useState("");

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoords, getError, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
      } else {
        alert("Geolocation is not available");
      }
    }

    const getError = () => {
      console.log("getCurrentPosition failed");
    }

    const getCoords = (position) => {
      window.sessionStorage.setItem("currentLat", position.coords.latitude);
      window.sessionStorage.setItem("currentLng", position.coords.longitude);
      setCoords({latitude: position.coords.latitude,
        longitude: position.coords.longitude});
    }

    const refreshLocation = () => {
      window.sessionStorage.removeItem("currentLat");
      window.sessionStorage.removeItem("currentLng");
      window.location.reload();
    }

    useEffect(() => {
      // if current location has not been stored yet, or if it's different than previous stored location, call getLocation()
        if ((window.sessionStorage.getItem("currentLat") === null) && (window.sessionStorage.getItem("currentLng") === null)) {
          getLocation();
        } else {
          setCoords({latitude: parseFloat(window.sessionStorage.getItem("currentLat")), longitude: parseFloat(window.sessionStorage.getItem("currentLng"))});
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
    <div className="app">
      {coords === "" 
      ? <div style={{marginLeft: "20px"}}>Loading Current Location...</div>
      : null
      }
      <button className="home-refresh-button" onClick={() => refreshLocation()}><BiRefresh className="refresh-icon" size={22}/><span className="refresh-text">Refresh Location</span></button>
      <MapContainer lat={coords.latitude} lng={coords.longitude} zoomLevel={20}/>
    </div>
    )
    
}