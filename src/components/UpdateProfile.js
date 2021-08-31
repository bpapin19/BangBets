import React, {useRef, useState} from "react";
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom'

export default function UpdateProfile() {
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updateEmail, updatePassword, updateUsername } = useAuth();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    function handleSubmit(e) {
        e.preventDefault();

        const promises = [];
        setLoading(true);
        setError("");

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value));
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value));
        }

        if (usernameRef.current.value) {
            promises.push(updateUsername(usernameRef.current.value));
        }

        Promise.all(promises).then(() => {
            history.push('/profile');
        }).catch(() => {
            setError("Failed to update account");
        }).finally(() => {
            setLoading(false);
        })
    }

    const borderStyles = {
        borderRadius: "10px",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
    }
    
    return (
        <>
        <Container
                className="d-flex justify-content-center"
                style={{ minHeight: "100vh"}}
            >
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <div style={borderStyles}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Update Profile</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form style={{width: "360px"}} onSubmit={handleSubmit}>
                            <Form.Group id="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" ref={usernameRef} defaultValue={currentUser.displayName} placeholder={currentUser.displayName}/>
                            </Form.Group>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} defaultValue={currentUser.email}/>
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control autocomplete="off" type="password" ref={passwordRef} placeholder="Leave blank to keep the same"/>
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same"/>
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">Update</Button>
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