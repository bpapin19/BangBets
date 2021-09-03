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
              <div>
                <div className="card-body">
                  <div className="">
                      <img className="map-image" src={`/uploads/${spot.createdAt.split('.')[0]+"Z."+spot.photo.split('.')[1]}`} alt="" onError={(event) => event.target.src = 'https://i.ibb.co/KGvFgV0/download.jpg'}/>
                  </div>
                  <div className="card-body-header">
                      <span className={spot.type==='Spot' ? "tag tag-teal": "tag tag-orange"}>{spot.type}</span>
                  </div>
                  <div>
                    <h4>{spot.name}</h4>
                  </div>
                  <p style={{color: "gray"}}>{spot.desc}</p>
                  <div>{spot.location}</div>
                  <div className="footer">
                      <div>{moment(spot.createdAt).format("MMM Do YYYY")}</div>
                      <div>{spot.user}</div>
                  </div>
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