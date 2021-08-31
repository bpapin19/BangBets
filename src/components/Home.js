import { React, useState, useEffect } from 'react'
import MapContainer from "./Map";


  export default function Home() {

    const [coords, setCoords] = useState("");

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoords, getError, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
      } else {
        alert("Geolocation is not available");
        console.log("error");
      }
    }

    const getError = () => {
      console.log("getCurrentPosition failed")
    }

    const getCoords = (position) => {
      setCoords({latitude: position.coords.latitude,
        longitude: position.coords.longitude})
    }

    useEffect(() => {
        getLocation();
    }, [])

    return (
    <div className="app">
      {coords === "" 
      ? <div style={{marginLeft: "10px"}}>Loading Current Location...</div>
      : null
      }
      <MapContainer lat={coords.latitude} lng={coords.longitude} zoomLevel={20}/>
    </div>
    )
    
}