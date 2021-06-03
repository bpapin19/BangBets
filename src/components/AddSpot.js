import React, {useRef, useState} from "react";
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import MapContainer from "./Map";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

export default function AddSpot() {
    const nameRef = useRef();
    const locationRef = useRef();
    const descriptionRef = useRef();
    const spotRef = useRef();
    const parkRef = useRef();
    const photoRef = useRef();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { currentUser } = useAuth();
    const provider = new OpenStreetMapProvider();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
          setError('')
          // Add to database
        } catch {
          setError('Unable to add your spot')
        }

        const results = await provider.search({ query: locationRef.current.value });
        console.log(results[0]);

        console.log(currentUser.email);
        console.log(nameRef.current.value);
        console.log(locationRef.current.value);
        //add location to db with address and coordinates
        console.log(descriptionRef.current.value);
        // console.log(parkRef.current.value);
        console.log(photoRef.current.value);
        
    }

    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState("");

    const handleSelect = async (value) => {
      const results = await geocodeByAddress(value);
      const latlng = await getLatLng(results[0]);
      setAddress(value);
      setCoordinates(latlng);
    }

    return (
      <>
      <Container
              className="d-flex justify-content-center"
              style={{ minHeight: "100vh"}}
          >
          <div className="w-100" style={{ maxWidth: "400px" }}>
              <Card>
                  <Card.Body>
                      <h2 className="text-center mb-4">Add a Spot</h2>
                      {error && <Alert variant="danger">{error}</Alert>}
                      <Form onSubmit={handleSubmit}>
                          <Form.Group id="name">
                              <Form.Label>Name</Form.Label>
                              <Form.Control placeholder="Think of a name" ref={nameRef} required />
                          </Form.Group>
                          
                          <Form.Group id="location">
                              <Form.Label>Location</Form.Label>
                              <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
                                  <div>
                                    <Form.Control ref={locationRef} {...getInputProps({placeholder: "Address of spot"})} />
                                    <div>
                                      {loading ? <div>...loading</div> : null}

                                      {suggestions.map(suggestion => {
                                        const style = suggestion.active
                                        ? { backgroundColor: '#0070ff', cursor: 'pointer', color: "white" }
                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };

                                        return (
                                        <div {...getSuggestionItemProps(suggestion, { style })}>
                                          {suggestion.description}
                                        </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                }
                              </PlacesAutocomplete>
                          </Form.Group>
                          <Form.Group id="description">
                              <Form.Label>Description</Form.Label>
                              <Form.Control placeholder="Describe the ground, security, lighting, etc." ref={descriptionRef}/>
                          </Form.Group>
                          <Form.Group id="type">
                            <Form.Label>Type</Form.Label>
                              <Form.Check 
                                type={'radio'}
                                id={'Spot'}
                                value={'Spot'}
                                label={'Spot'}
                                name={'type'}
                                required
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'Park'}
                                value={'Park'}
                                label={'Park'}
                                name={'type'}
                                required
                              />
                          </Form.Group>
                          <Form.Group>
                            <Form.File id="photo" label="Photo" ref={photoRef}/>
                          </Form.Group>
                          <Button disabled={loading} className="w-100" type="submit">Add Spot</Button>
                      </Form>
                  </Card.Body>
              </Card>
          </div>
      </Container>
      </>
    )
}