import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import mapStyles from "./mapStyles";

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
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = useState([]);

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
      <Marker position={props} />
      </GoogleMap>
    </div>
  );
}