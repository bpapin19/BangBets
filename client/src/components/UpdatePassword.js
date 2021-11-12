import React, {useRef, useState} from "react";
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

export default function UpdatePassword() {
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const { currentUser, updatePassword } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    var baseUrl = process.env.REACT_APP_ROUTE_URL;

    function handleSubmit(e) {
        e.preventDefault();

        const promises = [];
        setLoading(true);
        setError("");

        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            return setError("Passwords do not match")
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => {
            history.push('/profile');
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const borderStyles = {
        borderRadius: "10px",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
    }

    return (
        <>
        <Container
                className="d-flex justify-content-center"
                style={{ minHeight: "100vh", paddingTop: "30px"}}
            >
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <div style={borderStyles}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Update Password</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form style={{width: "360px"}} onSubmit={handleSubmit}>
                            <Form.Group id="password">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required/>
                            </Form.Group>
                            <Form.Group id="confirm-password">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" ref={confirmPasswordRef} required/>
                            </Form.Group>
                            <Button className="w-100" type="submit">Update</Button>
                        </Form>
                    </Card.Body>
                </div>
                <div className="w-100 text-center mt-2">
                    <Link to='/profile'>Cancel</Link>
                </div>
            </div>
        </Container>
        </>
    )
}