import {React, useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import './NavBar.css';
import { useAuth } from '../contexts/AuthContext';
import logo from '../bangbets_transparent.png';
import { MdOutlineSportsFootball } from 'react-icons/md';
import { BiBasketball } from 'react-icons/bi';
import { IoBaseballOutline } from 'react-icons/io5';
import { MdSportsHockey } from 'react-icons/md';
import { GiAmericanFootballHelmet } from 'react-icons/gi';

export default function NavBar() {

  const {currentUser} = useAuth();

  return (
    <header className="navbar">
      <div className="container flex navbar-content">
        <div className="container flex">
            {currentUser && currentUser.displayName === "client" && <div>
                <NavLink
                    to="/"
                    exact
                    activeClassName="text-black"
                    className="site-title"
                >
                    <img className="logo" alt="" src={logo}/>BANG BETS
                </NavLink>
            </div>}
            {currentUser && currentUser.displayName === "bookie" && <div>
                <NavLink
                    to="/bookie-active-bets"
                    exact
                    activeClassName="text-black"
                    className="site-title"
                >
                    <img className="logo" alt="" src={logo}/>BANG BETS
                </NavLink>
            </div>}
        <div className="inline-flex py-3 px-3 my-6">
        {currentUser &&
          <NavLink
            to="/profile"
            activeClassName="text-blue-100 bg-blue-700"
            className="navlink-username"
          >
            <span className="username">{currentUser.email.substring(0, currentUser.email.indexOf('@'))}</span>
          </NavLink>
        }
        </div>
      </div>
      {currentUser && currentUser.displayName === "client" &&
      <div className="container flex sports-bar">
            <NavLink
              to="football-bets"
              activeClassName="sports-bar-active"
              className="navlink-title"
            >
              <MdOutlineSportsFootball className="nav-icon" size={30}/>
              <div>NFL</div>
            </NavLink>
            <NavLink
              to="basketball-bets"
              activeClassName="sports-bar-active"
              className="navlink-title"
            >
              <BiBasketball className="nav-icon" size={30}/>
              <div>NBA</div>
            </NavLink>
            <NavLink
              to="baseball-bets"
              activeClassName="sports-bar-active"
              className="navlink-title"
            >
              <IoBaseballOutline className="nav-icon" size={30}/>
              <div>MLB</div>
            </NavLink>
            <NavLink
              to="hockey-bets"
              activeClassName="sports-bar-active"
              className="navlink-title"
            >
              <MdSportsHockey className="nav-icon" size={30}/>
              <div>NHL</div>
            </NavLink>
            <NavLink
              to="mma-bets"
              activeClassName="sports-bar-active"
              className="navlink-title"
            >
              <GiAmericanFootballHelmet className="nav-icon" size={30}/>
              <div>CFB</div>
            </NavLink>
      </div>}
      {currentUser && currentUser.displayName === "bookie" &&
      <div className="container flex sports-bar">
            <NavLink
              to="bookie-active-bets"
              activeClassName="sports-bar-active"
              className="navlink-title"
            >
              Active
            </NavLink>
            <NavLink
              to="bookie-week-bets"
              activeClassName="sports-bar-active"
              className="navlink-title"
            >
              This Week
            </NavLink>
            <NavLink
              to="bookie-all-bets"
              activeClassName="sports-bar-active"
              className="navlink-title"
            >
              All
            </NavLink>
      </div>}
    </div>
    </header>
  );
}
