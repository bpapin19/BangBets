import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import "./MySpots.css";
import { BsTrash } from 'react-icons/bs';

export default function MySpots() {

    const [spotsArray, setSpotsArray] = useState([]);
    const [noSpots, setNoSpots] = useState(false);
    const { currentUser } = useAuth();
    const [resSuccess, setResSuccess] = useState("");

    var baseUrl = process.env.REACT_APP_ROUTE_URL;

    function deleteSpot(spotToDelete){
        axios({
            method: 'delete',
            url: `${baseUrl}/api/spot/${spotToDelete._id}`,
          })
          .then(res => {
              setResSuccess(spotToDelete.name + " was successfully deleted");
              var newSpotsArray = spotsArray.filter(spot => spot._id !== spotToDelete._id);
              if (newSpotsArray.length === 0) { setNoSpots(true);}
              setSpotsArray(newSpotsArray);
          });
    }

    function reverseArray(spotsArray) {
        var reversedSpotsArray = [];
        for (var i = spotsArray.length-1; i >= 0; i--) {
            reversedSpotsArray.push(spotsArray[i]);
        }
        return reversedSpotsArray;
    }

    useEffect(() => {
          axios({
            method: 'get',
            url: baseUrl + "/api/spots"
          })
          .then(res => {
            setSpotsArray(res.data.data);
          });
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        spotsArray.filter(spot => {
            if (spot.userId === currentUser.uid) {
                setNoSpots(false);
            } else {
                setNoSpots(true);
            }
            return 0;
        });
    }, [spotsArray]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
    <div>
        { resSuccess && 
            <div style={{textAlign: 'center'}} className="alert alert-success">{resSuccess}</div> }
        <h1 className="title">My Spots</h1>
        {noSpots &&
            <div>
                <div style={{paddingTop: "30px"}}className="container">
                   <div className="card">
                        <div className="card-header">
                           <img className="no-spots-img" alt=""/>
                        </div>
                        <div className="no-spots-card-body">
                            You haven't uploaded any spots.
                            <br/><br/>
                            Click <b>Add a Spot</b> to get started.
                            <br/>
                            <br/>
                            <Link to="/add-spot" className="btn btn-primary">Add a Spot</Link>
                        </div>
                   </div>
                </div>
            </div>
        }
        <div className="spots-body">
            <div className="spot-cards">
            {reverseArray(spotsArray).map(spot => {
                if (spot.userId === currentUser.uid) {
                    return (
                    <div key={spot._id}>
                        <div className="container">
                            <div className="card">
                                <div className="card-header">
                                    <img style={{objectFit: "cover"}} src={`https://s3-us-west-1.amazonaws.com/skate-spot-tracker/${spot.createdAt.split('.')[0]+"Z."+spot.photo.split('.')[1]}`} alt="" onError={(event) => event.target.src = 'https://i.ibb.co/KGvFgV0/download.jpg'}/>
                                </div>
                                <div className="spots-card-body">
                                    <div className="card-body-header">
                                        <span className={spot.type==='Spot' ? "tag tag-teal": "tag tag-orange"}>{spot.type}</span>
                                        <div className="btn-container">
                                            <button className="spots-btn btn-red" onClick={() => {deleteSpot(spot) }}><BsTrash /></button>
                                        </div>
                                    </div>
                                    <h4>{spot.name}</h4>
                                    <p style={{color: "gray"}}>{spot.desc}</p>
                                    <div className="footer">
                                        <small>{moment(spot.createdAt).fromNow()}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                }
                return 0;
                })
            }
            </div>
        </div>
    </div>)
}