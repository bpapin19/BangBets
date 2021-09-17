import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Container, Form } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom";

export default function Profile(props) {
    const  [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const history  = useHistory();
    const [img, setImg] = useState({});
    const [loading, setLoading] = useState(false);
 
    var loadingTime = 0;
    
    useEffect(() => {
        let isMounted = true;
        setImageLink().then(() => {
            if (isMounted) setImg({url: `https://s3-us-west-1.amazonaws.com/spot-tracker-pfps/${currentUser.uid + ".jpg"}`, hash: new Date().getTime()})})
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function setImageLink() {
        //user has navigates from updateprofile
        if (history.location.state != null) {
            if (history.location.state.from === 'fromUpdate') {
                setLoading(true);
                props.setShouldUpdate(true);
                // set load time based on how big the file is to give AWS time to upload the file
                loadingTime = history.location.state.fileSize/1000 + 1000;
            }
        }
        setTimeout(() => {
            setLoading(false);
            props.setShouldUpdate(false);
            history.replace({pathname: '/profile', state: {from: 'fromProfile'}});
        }, loadingTime);
    };

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
                        <Form style={{width: "360px"}}>
                            <h2 className="text-center mb-4">Profile</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {!loading &&
                                <img className="pfp-big" src={img.url + '?' + img.hash} alt="" onError={(event) => event.target.src = 'https://i.ibb.co/zHrQvyf/default.jpg'}/>
                            }
                            {loading &&
                                <iframe title={img.hash} className='pfp-big' src="https://giphy.com/embed/hWZBZjMMuMl7sWe0x8"/>
                            }                                
                            <div style={elementStyles}>
                                <strong>Username: </strong> 
                                <span>{currentUser.displayName}</span>
                            </div>
                            <div style={elementStyles}>
                                <strong>Email: </strong> 
                                <span>{currentUser.email}</span>
                            </div>
                            <Link to='/my-spots' className="btn btn-primary w-100 mb-2">My Spots</Link>
                            <Link to='/update-profile' className="btn btn-primary w-100">Update Profile</Link>
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