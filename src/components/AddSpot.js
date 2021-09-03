import React, {useRef, useState, useEffect} from "react";
import {Form, Button, Card, Container} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import axios from 'axios';

export default function AddSpot() {

  // Use Ref
  const nameRef = useRef();
  const locationRef = useRef();
  const descriptionRef = useRef();
  const photoRef = useRef();
  const { currentUser } = useAuth();

  // Use State
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [type, setType] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState( null );

  useEffect(() => {
    if (file !== null){
      if (file.size > 4000000) {
        setError("File too large, uploads limited to 1MB");
        setSuccess("");
      } else if ((file.type !== 'image/jpeg') && (file.type !== 'image/png') && (file.type !== 'image/heic')) {
        setError("Only JPG, PNG, and HEIC formats are supported");
      } else {
        setError("");
      }
    }
  }, [file]);

  async function handleSubmit(e) {
      e.preventDefault();

      // Handle spot photo file upload
      const formData = new FormData();

      const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'from': 'add-spot'
        }
      };

        if (error === "") {
          try {

            formData.append('myfile', file);
            axios.post("http://localhost:3001/api/files", formData, config);

            axios({
              method: 'post',
              url: "http://localhost:3001/api/spot",
              data: {
                user: currentUser.displayName,
                name: nameRef.current.value,
                location: address,
                lat: coordinates.lat,
                lng: coordinates.lng,
                desc: descriptionRef.current.value,
                type: type,
                photo: file.name,
              }
            })
            .then(res => {
                setSuccess(res.data.message);
            })
            e.target.reset();
            setAddress("");
          } catch {
            setError('Unable to add your spot')
          }
        }
    }

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latlng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latlng);
  } 

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  }

  const handleChange = e => {
    setType(e.target.value);
  }

  const borderStyles = {
    borderRadius: "10px",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)"
  }

  return (
    <>
    <Container
            className="d-flex justify-content-center"
            style={{ minHeight: "100vh", paddingTop: "30px"}}
        >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          { success && 
          <div className="alert alert-success">{success}</div> }
          { error && 
          <div className="alert alert-danger">{error}</div> }
            <div style={ borderStyles }>
                <Card.Body>
                    <h2 className="text-center mb-4">Add a Spot</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control placeholder="Think of a name" ref={nameRef} required />
                        </Form.Group>
                        <Form.Group id="location">
                            <Form.Label>Address</Form.Label>
                            <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
                                <div>
                                  <Form.Control ref={locationRef} {...getInputProps({placeholder: "Address of spot"})} />
                                  <div>
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
                            <Form.Control placeholder="Describe the ground, lighting, etc." ref={descriptionRef}/>
                        </Form.Group>
                        <Form.Group id="type">
                          <Form.Label>Type</Form.Label>
                            <Form.Check 
                              type={'radio'}
                              id={'Spot'}
                              value={'Spot'}
                              label={'Spot'}
                              name={'type'}
                              onChange={handleChange}
                              required
                            />
                            <Form.Check 
                              type={'radio'}
                              id={'Park'}
                              value={'Park'}
                              label={'Park'}
                              name={'type'}
                              onChange={handleChange}
                              required
                            />
                        </Form.Group>
                        <Form.Group>
                          <Form.File id="photo" label="Photo" onChange={handleFileUpload} ref={photoRef}/>
                        </Form.Group>
                        <Button className="w-100" type="submit">Add Spot</Button>
                    </Form>
                </Card.Body>
            </div>
        </div>
    </Container>
    </>
  )
}