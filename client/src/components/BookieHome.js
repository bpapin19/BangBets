import { React, useState, useEffect } from 'react';
import { MdOutlineSportsFootball } from 'react-icons/md';
import { BiBasketball } from 'react-icons/bi';
import { IoBaseballOutline } from 'react-icons/io5';
import { MdSportsHockey } from 'react-icons/md';
import { GiMailedFist } from 'react-icons/gi';
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