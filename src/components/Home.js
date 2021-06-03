import { React, Component, useState, setState, useEffect } from 'react'
import MapContainer from "./Map";
import { Card } from "react-bootstrap"
import { render } from '@testing-library/react';

  export default function Home() {

    const [coords, setCoords] = useState("");

    const getLocation = () => {
      console.log("getlocation")
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoords, getError, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
      } else {
        alert("Geolocation is not available");
        console.log("error")
      }
    }

    const getError = () => {
      console.log("getCurrentPosition failed")
    }

    const getCoords = (position) => {
      console.log("getcoord")
      setCoords({latitude: position.coords.latitude,
        longitude: position.coords.longitude})
    }

    useEffect(() => {
        getLocation();
        console.log("home")
    }, [])

    return (
    <div className="app">
      {console.log(coords)}
      {coords == "" 
      ? <div style={{marginLeft: "10px"}}>Loading Current Location...</div>
      : null
      }
      <MapContainer lat={coords.latitude} lng={coords.longitude} zoomLevel={20}/>
      
    </div>
    )
    
}