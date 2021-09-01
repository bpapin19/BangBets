import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import "./MySpots.css";
import { BsTrash } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';

export default function MySpots() {

    const [spotsArray, setSpotsArray] = useState([]);
    const { currentUser } = useAuth();
    const [resSuccess, setResSuccess] = useState("");
    const [resError, setResError] = useState("");
    const [deleted, setDeleted] = useState(false);

    function deleteSpot(spot){
        axios({
            method: 'delete',
            url: `http://localhost:3001/api/spot/${spot._id}`,
          })
          .then(res => {
              setResSuccess(spot.name + " was successfully deleted");
              setDeleted(true);
          });
    }

    useEffect(() => {
        try {
          axios({
            method: 'get',
            url: "http://localhost:3001/api/spots"
          })
          .then(res => {
            setSpotsArray(res.data.data);
          });
        } catch {
          setResError('Unable to get spots');
        }
      }, [deleted]);

    return (
    <div>
        { resSuccess && 
            <div style={{textAlign: 'center'}} className="alert alert-success">{resSuccess}</div> }
        { resError && 
            <div style={{textAlign: 'center'}} className="alert alert-danger">{resError}</div> }
        <h1 className="title">My Spots</h1>
        <div className="spots-body">
            <div className="spot-cards">
            {spotsArray.map(spot => {
                if (spot.user === currentUser.displayName) {
                    return (
                    <div>
                        <div className="container">
                            <div key={spot._id} className="card">
                                <div className="card-header">
                                    <img src={`/uploads/${spot.createdAt.split('.')[0]+"Z."+spot.photo.split('.')[1]}`} alt="" onError={(event) => event.target.src = 'https://i.ibb.co/KGvFgV0/download.jpg'}/>
                                </div>
                                <div className="card-body">
                                    <div className="card-body-header">
                                        <span className={spot.type==='Spot' ? "tag tag-teal": "tag tag-orange"}>{spot.type}</span>
                                        <div className="btn-container">
                                            <button className="spots-btn btn-teal"><BsPencil /></button>
                                            <button className="spots-btn btn-red" onClick={() => {deleteSpot(spot) }}><BsTrash /></button>
                                        </div>
                                    </div>
                                    <h4>{spot.name}</h4>
                                    <p>{spot.desc}</p>
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