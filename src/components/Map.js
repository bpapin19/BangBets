import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import mapStyles from "./mapStyles";
import "./Map.css";
import axios from 'axios';

import spotIcon from '../spotIcon.svg';
import parkIcon from '../parkIcon.svg';
import moment from 'moment';

const mapContainerStyle = {
  width: '100vw',
  height: '90vh',
};

const libraries = ["places"];
const zoom= 14;

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true
}    

export default function MapContainer(props) {

  const [spotsArray, setSpotsArray] = useState([]);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);       
  const [selectedPlace, setSelectedPlace] = useState("");

  const onMarkerClick = id => e => {
    setShowingInfoWindow(true);
    setSelectedPlace(id);
  }

  function onInfoWindowClose() {
    console.log("onclose");
    setShowingInfoWindow(false);
  }

  useEffect(() => {
    try {
      axios({
        method: 'get',
        url: "http://localhost:3001/api/spots"
      })
      .then(res => {
        setSpotsArray(res.data.data);
      }, (error) => {
        console.log(error);
      });
    } catch {
    }
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  if (loadError) return ("error loading maps");
  if (!isLoaded) return ("loading maps");

  return (
    <div>
    <GoogleMap
      zoom={zoom}
      mapContainerStyle={mapContainerStyle}
      center={props}
      options={options}
    >
      {spotsArray.map(spot => {
          return <Marker
            icon={spot.type==='Spot' ? spotIcon : parkIcon}
            key={spot._id}
            onClick={onMarkerClick(spot._id)}
            name={spot.name}
            position={{lat: spot.lat, lng: spot.lng}}
          >
            {showingInfoWindow && selectedPlace === spot._id && <InfoWindow
            className="info-window"
            onCloseClick={onInfoWindowClose}
            position={{lat: spot.lat, lng: spot.lng}}
            >
              <div className="iw-container">       
                <strong className="iw-title">{spot.name}</strong>
                <div className="iw-content">
                  <a href={'https://maps.google.com/?ll=' + spot.lat + ',' + spot.lng} target= "_blank" rel="noreferrer" className="iw-subTitle">{spot.location}<span className="tooltiptext">Open in GoogleMaps</span></a>
                  <div><b>Added By: </b>{spot.user}</div>
                  <div><b>Type: </b>{spot.type}</div>
                  <div><b>Description: </b>{spot.desc}</div>
                  <div><b>Posted on: </b>{moment(spot.createdAt).format("MMM Do YYYY")}</div>
                  {/* <img src={`/uploads/${spot.createdAt.split('.')[0]+"Z"}.jpg`}> </img> */}
                </div>
              </div>
              </InfoWindow>}
            </Marker>
      })
      }
      
      <Marker position={props} />
      </GoogleMap> 
    </div>
  );
}