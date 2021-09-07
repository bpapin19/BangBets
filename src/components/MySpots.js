import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import "./MySpots.css";
import { BsTrash } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';
import spotUploadImage from '../spot-upload.png';

export default function MySpots() {

    const [spotsArray, setSpotsArray] = useState([]);
    const [noSpots, setNoSpots] = useState(false);
    const { currentUser } = useAuth();
    const [resSuccess, setResSuccess] = useState("");

    function deleteSpot(spotToDelete){
        axios({
            method: 'delete',
            url: `/api/spot/${spotToDelete._id}`,
          })
          .then(res => {
              setResSuccess(spotToDelete.name + " was successfully deleted");
              var newSpotsArray = spotsArray.filter(spot => spot._id != spotToDelete._id);
              if (newSpotsArray.length === 0) { setNoSpots(true);}
              setSpotsArray(newSpotsArray);
          });
    }

    function reverseArray(spotsArray) {
        var reversedSpotsArray = new Array;
        for (var i = spotsArray.length-1; i >= 0; i--) {
            reversedSpotsArray.push(spotsArray[i]);
        }
        return reversedSpotsArray;
    }

    useEffect(() => {
          axios({
            method: 'get',
            url: "/api/spots"
          })
          .then(res => {
            setSpotsArray(res.data.data);
          })
          .catch(function () {
            setNoSpots(true);
          });
      }, []);

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
                           <img className="no-spots-img" src={spotUploadImage} alt=""/>
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
                if (spot.user === currentUser.displayName) {
                    return (
                    <div>
                        <div className="container">
                            <div key={spot._id} className="card">
                                <div className="card-header">
                                    <img style={{objectFit: "cover"}} src={`/uploads/${spot.createdAt.split('.')[0]+"Z."+spot.photo.split('.')[1]}`} alt="" onError={(event) => event.target.src = 'https://i.ibb.co/KGvFgV0/download.jpg'}/>
                                </div>
                                <div className="spots-card-body">
                                    <div className="card-body-header">
                                        <span className={spot.type==='Spot' ? "tag tag-teal": "tag tag-orange"}>{spot.type}</span>
                                        <div className="btn-container">
                                            <button className="spots-btn btn-teal"><BsPencil /></button>
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
                })
            }
            </div>
        </div>
    </div>)
}