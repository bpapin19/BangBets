import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Container, Form } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom";

export default function Profile() {
    const  [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const history  = useHistory();

    async function handleLogout() {
        setError('')
        try {
            await logout();
            history.pushState('/logout');
        } catch {
            setError('Failed to log out');
        }
    }

    const borderStyles = {
        borderRadius: "10px",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
    }

    const elementStyles = {
        paddingBottom: "10px",
    }

    return (
        <>
        <Container style={{paddingTop: "30px"}} className="d-flex justify-content-center">
            <div className="w-100" style={{maxWidth: "400px"}}>
                <div style={ borderStyles }>
                    <Card.Body>
                        <Form>
                            <h2 className="text-center mb-4">Profile</h2>
                            <img className="pfp-big" src='https://i.ibb.co/zHrQvyf/default.jpg'/>                       
                            <div style={elementStyles}>
                                <strong>Username: </strong> 
                                <span>{currentUser.email.substring(0, currentUser.email.indexOf('@'))}</span>
                            </div>
                            <div style={elementStyles}>
                                <strong>Email: </strong> 
                                <span>{currentUser.email}</span>
                            </div>
                            {currentUser.displayName === 'client' && <Link to='/my-bets' className="btn btn-primary w-100 mb-2">My Bets</Link>}
                        </Form>
                    </Card.Body>
                </div>
            </div>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div>
        </Container>
        </>
    )
}