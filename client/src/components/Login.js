import React, {useRef, useState, useEffect} from "react";
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const { setClientAuth } = useAuth();
    const { setBookieAuth } = useAuth();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(false);
    const [bookie, setBookie] = useState(false);
    const history = useHistory();
    const {currentUser} = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            if (client) {
                if (emailRef.current.value !== "joselopez@gmail.com") {
                    await login(emailRef.current.value, passwordRef.current.value);
                    history.push('/');
                } else {
                    setError("Failed to sign in");
                }
            } else if (bookie) {
                if (emailRef.current.value === "newertest@gmail.com") {
                    await login(emailRef.current.value, passwordRef.current.value);
                    history.push('/bookie-active-bets');
                } else {
                    setError("Failed to sign in");
                }
            }
        } catch {
            setError("Failed to sign in");
        }
        
        setLoading(false);
    }

    var bookieButton;
    var clientButton;
    var submitButton;

    useEffect(() => {
        bookieButton = document.getElementById("bookie-button");
        clientButton = document.getElementById("client-button");
        submitButton = document.getElementById("submit-button");
    });

    useEffect(() => {
        clientButton.classList.add("client-selected");
        setClient(true);
    }, []);

    function handleClient() {
        setClient(true);
        setBookie(false);

        clientButton.classList.add("client-selected");
        submitButton.classList.add("client-submit");
        if (bookieButton.classList.contains("bookie-selected")) {
            bookieButton.classList.remove("bookie-selected");
        }
        if (submitButton.classList.contains("bookie-submit")) {
            submitButton.classList.remove("bookie-submit");
        }
    }

    function handleBookie() {
        setBookie(true);
        setClient(false);
        bookieButton.classList.add("bookie-selected");
        submitButton.classList.add("bookie-submit");
        if (clientButton.classList.contains("client-selected")) {
            clientButton.classList.remove("client-selected");
        }
        if (submitButton.classList.contains("client-submit")) {
            submitButton.classList.remove("client-submit");
        }
    }

    const borderStyles = {
        borderRadius: "10px",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
        width: "100%",
    }
    
    return (
        <>
        <Container
                className="d-flex justify-content-center"
                style={{ minHeight: "100vh", paddingTop: "30px" }}
            >
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <div style={borderStyles}>
                    <div className="top-buttons">
                        <button onClick={() => handleClient()} id="client-button" className="client-button">Client</button>
                        <button onClick={() => handleBookie()} id="bookie-button" className="bookie-button">Admin</button>
                    </div>
                    <hr className="divider"/>
                    <Card.Body>
                        <h2 className="text-center mb-4">Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Button disabled={loading} id="submit-button" className="submit-button" type="submit">Login</Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                    <Link to='/forgot-password' className="forgot-password">Forgot password? </Link>
                </div>
                    </Card.Body>
                </div>
            </div>
        </Container>
        </>
    )
}