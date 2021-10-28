import { React, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

import './Home.css';


  export default function BookieHome() {
    const {setBookie} = useAuth();

    useEffect(() => {
      setBookie("client");
    }, []);

    return (
    <div className="app">
      <div className="top-panel">
        <div>Bookie Home</div>
      </div>
    </div>
    )
    
}