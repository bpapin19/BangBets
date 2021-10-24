import { React, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { MdOutlineSportsFootball } from 'react-icons/md';
import { BiBasketball } from 'react-icons/bi';
import { IoBaseballOutline } from 'react-icons/io5';
import { MdSportsHockey } from 'react-icons/md';
import { GiMailedFist } from 'react-icons/gi';
import { useAuth } from '../contexts/AuthContext';

import './Home.css';


  export default function ClientHome() {
    const {setClient} = useAuth();

    useEffect(() => {
      setClient("client");
    }, []);

    return (
    <div className="app">
      <div className="top-panel">
        <div>
          <Link  to="/football-bets" className="icon"><MdOutlineSportsFootball size={50}/> <span>Football</span> </Link>
        </div>
        <div>
          <a className="icon" href=""><BiBasketball size={50}/> <span>Basketball</span></a>
        </div>
        <div>
          <a className="icon" href=""><IoBaseballOutline size={50}/> <span>Baseball</span></a>
        </div>
        <div>
          <a className="icon" href=""><MdSportsHockey size={50}/> <span>Hockey</span></a>
        </div>
        <div>
          <a className="icon" href=""><GiMailedFist size={50}/> <span>MMA/UFC</span></a>
        </div>
      </div>
    </div>
    )
}